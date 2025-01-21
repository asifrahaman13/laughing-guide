import logging
from typing import Dict, List
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import google.generativeai as genai


class EmbeddingService:
    def __init__(self, embedding_model: str):
        self.__embeddings_cache: Dict[str, List[float]] = {}
        self.embedding_model = embedding_model

    def get_embeddings(self, text: str) -> List[float]:
        if text in self.__embeddings_cache:
            return self.__embeddings_cache[text]
        else:
            result = genai.embed_content(model=self.embedding_model, content=text)
            embedding_result = self.__embeddings_cache[text] = result["embedding"]
            if not isinstance(embedding_result, list):
                return []
            return self.__embeddings_cache[text]


class QdrantService:
    def __init__(self, url):
        self.__client = QdrantClient(url=url)

    def collection_exists(self, collection_name):
        try:
            response = self.__client.get_collection(collection_name)
            return response is not None
        except Exception as e:
            if "404" in str(e):
                return False
            else:
                raise e

    def create_collection(self, collection_name):
        if self.collection_exists(collection_name):
            pass
        else:
            self.__client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE),
            )

    def upsert_points(self, collection_name, points):
        self.__client.upsert(collection_name=collection_name, points=points)

    def search(self, query_embedding, id, limit=5):
        # filter_condition = Filter(
        #     must=[FieldCondition(key="id", match=MatchValue(value=id))]
        # )
        return self.__client.search(
            collection_name="sample_collection",
            query_vector=query_embedding,
            limit=limit,
            # query_filter=filter_condition,
        )


class QdrantQueryRepository:
    def __init__(
        self, embedding_service: EmbeddingService, qdrant_service: QdrantService
    ):
        self.__embedding_service = embedding_service
        self.__qdrant_service = qdrant_service

    def prepare_points(
        self, texts: List[str], metadata: List[Dict]
    ) -> List[PointStruct]:
        import uuid

        return [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=self.__embedding_service.get_embeddings(text),
                payload={"text": text, **meta},
            )
            for _, (text, meta) in enumerate(zip(texts, metadata))
        ]

    def initialize_qdrant(self, texts: List[str], metadata: List[Dict]):
        points = self.prepare_points(texts, metadata)

        self.__qdrant_service.upsert_points("sample_collection", points)
        return True

    def query_text(self, query_text: str, id: str):
        try:
            query_embedding = self.__embedding_service.get_embeddings(query_text)
            response = self.__qdrant_service.search(query_embedding, id)

            logging.info(f"Query: {query_text}")
            result = []
            for data in response:
                if data.score > 0.5:
                    result.append(
                        {
                            "score": data.score,
                            "text": data.payload["text"],
                            "source": data.payload["source"],
                            "metadata": data.payload,
                        }
                    )
            return result
        except Exception as e:
            logging.error(f"Failed to search: {e}")
            return []
