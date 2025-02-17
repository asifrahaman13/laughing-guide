import redis
from src.infastructure.repositories.vector_db_repository import (
    EmbeddingService,
    QdrantQueryRepository,
    QdrantService,
)
from src.infastructure.repositories.auth_repository import AuthRepository
from src.infastructure.repositories.openai_repository import OpenAIRepository
from src.infastructure.repositories.redis_repository import RedisRepository
from src.infastructure.repositories.sqlite_query_repository import SqliteQueryRepository

from src.internal.use_cases.query_service import QueryService
from src.internal.use_cases.authentication_service import AuthenticationService
from src.ConnectionManager.ConnectionManager import ConnectionManager
from ..config.config import (
    REDIS_PORT,
    REDIS_HOST,
    QDRANT_API_ENDPOINT,
)
from ..config.config import GEMINI_EMBEDDING_MODEL


class DIContainer:
    def __init__(self):
        self.__instances = {}

    def get_redis_repository(self):
        if "redis_repository" not in self.__instances:
            redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
            self.__instances["redis_repository"] = RedisRepository(redis_client)
        return self.__instances["redis_repository"]

    def get_openai_repository(self):
        if "openai_repository" not in self.__instances:
            self.__instances["openai_repository"] = OpenAIRepository()
        return self.__instances["openai_repository"]

    def get_sqlite_query_repository(self):
        if "sqlite_query_repository" not in self.__instances:
            self.__instances["sqlite_query_repository"] = SqliteQueryRepository()
        return self.__instances["sqlite_query_repository"]

    def get_vector_db_repository(self):
        if "vectordb_repoitory" not in self.__instances:
            embedding_model = GEMINI_EMBEDDING_MODEL
            embedding_service = EmbeddingService(embedding_model)
            qdrant_service = QdrantService(url=QDRANT_API_ENDPOINT)
            self.__instances["vectordb_repoitory"] = QdrantQueryRepository(
                embedding_service, qdrant_service
            )
        return self.__instances["vectordb_repoitory"]

    def get_auth_repository(self):
        if "auth_repository" not in self.__instances:
            self.__instances["auth_repository"] = AuthRepository()
        return self.__instances["auth_repository"]

    def get_sqlite_query_database_service(self):
        if "sqlite_query_service" not in self.__instances:
            self.__instances["sqlite_query_service"] = QueryService(
                self.get_sqlite_query_repository(),
                self.get_redis_repository(),
                self.get_openai_repository(),
                self.get_vector_db_repository(),
            )
        return self.__instances["sqlite_query_service"]

    def get_auth_service(self):
        if "auth_service" not in self.__instances:
            self.__instances["auth_service"] = AuthenticationService(
                self.get_auth_repository()
            )
        return self.__instances["auth_service"]


container = DIContainer()
websocket_manager = ConnectionManager(REDIS_HOST, REDIS_PORT)


def get_sqlite_query_database_service():
    return container.get_sqlite_query_database_service()


def get_auth_service():
    return container.get_auth_service()
