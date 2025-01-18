import asyncio
import json
from typing import Any, AsyncGenerator, Awaitable, Dict, List
from src.internal.entities.router_models import QueryResponse
from src.internal.interfaces.services.query_interface import QueryInterface
from ...config.config import POSTGRES_URL
import logging

logging.basicConfig(level=logging.INFO)


class QueryService(QueryInterface):
    def __init__(
        self,
        sqlite_repository,
        redis_repository,
        openai_repository,
        vector_db_repository,
    ) -> None:
        self.sqlite_repository = sqlite_repository
        self.redis_repository = redis_repository
        self.openai_repository = openai_repository
        self.vector_db_repository = vector_db_repository

    async def query_db(self, query: str) -> AsyncGenerator[Dict[str, Any], None]:
        await asyncio.sleep(0)
        yield QueryResponse(
            message="Querying the database", answer_type="status", status=True
        )
        logging.info(f"Querying the database with the query: {query}")

        cache_key = self.redis_repository.get_cached_key(query)
        cached_result = self.redis_repository.get_cached_data(cache_key)
        cached_sql_query = self.redis_repository.get_cached_data(f"{cache_key}_sql")
        sql_query = None
        if cached_result and cached_sql_query:
            results = json.loads(cached_result.decode("utf-8"))
            headers = json.loads(
                self.redis_repository.get_cached_data(f"{cache_key}_headers").decode(
                    "utf-8"
                )
            )
            sql_query = cached_sql_query.decode("utf-8")
            logging.info("Results found in cache.")
            yield QueryResponse(
                sql_query=sql_query, answer_type="sql_query", status=False
            )
        else:
            yield QueryResponse(message="Thinking", answer_type="status", status=True)
            top_suggestions = self.vector_db_repository.query_text(query, "1")

            logging.info(f"Top suggestions: {top_suggestions}")
            query_result = self.openai_repository.get_llm_response(
                query, top_suggestions
            )
            sql_query = query_result

            logging.info(f"Query result: {query_result}")
            yield QueryResponse(
                message="Executing the query", answer_type="status", status=True
            )
            yield QueryResponse(
                sql_query=sql_query, answer_type="sql_query", status=False
            )
            results, headers = self.sqlite_repository.query_database(
                query_result, POSTGRES_URL
            )
            self.redis_repository.set_cache_data(f"{cache_key}_sql", query_result)
            self.redis_repository.set_cache_data(cache_key, json.dumps(results))
            self.redis_repository.set_cache_data(
                f"{cache_key}_headers", json.dumps(headers)
            )

        if results:
            yield QueryResponse(
                json_message=results,
                message=results,
                answer_type="table_response",
                status=False,
            )
        else:
            logging.info("No results found.")

    def add_data_to_vector_db(
        self, user_query: str, sql_query: str, source: List[Dict[str, Any]]
    ) -> Awaitable[Any]:
        data = [
            {
                "text": f"User prompt: {user_query}\n Sql query: {sql_query}",
                "source": source,
            }
        ]
        texts = [item["text"] for item in data]
        metadata = [{k: v for k, v in item.items() if k != "text"} for item in data]
        return self.vector_db_repository.initialize_qdrant(texts, metadata)
