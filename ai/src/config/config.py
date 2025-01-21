import yaml
from pydantic import BaseModel
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging configuration
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class AppConfig(BaseModel):
    title: str
    version: str
    description: str


class ServerConfig(BaseModel):
    host: str
    port: int


class RedisConfig(BaseModel):
    host: str
    port: int
    db: int


class Config(BaseModel):
    app: AppConfig
    server: ServerConfig
    redis: RedisConfig


def load_config(file_path: str) -> Config:
    with open(file_path, "r") as file:
        config_dict = yaml.safe_load(file)
    return Config(**config_dict)


# Load the configuration
config = load_config("config.yaml")


SECRET_KEY = os.getenv("SECRET_KEY")
assert SECRET_KEY, "Secret key is not set"
logging.info("Secret key is set")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
assert GEMINI_API_KEY, "Gemini API key not set"
logging.info("Gemini API key is set")

GEMINI_EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL")
assert GEMINI_EMBEDDING_MODEL, "Gemini embedding model is not set"
logging.info("Gemini embedding model is set")

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
assert QDRANT_API_KEY, "Qdrant API key not set"

QDRANT_API_ENDPOINT = os.getenv("QDRANT_API_ENDPOINT")
assert QDRANT_API_ENDPOINT, "Qdrant api endpoint not set"

REDIS_PORT = config.redis.port
assert REDIS_PORT, "Redis port is not set."
logging.info("Redis port is set")

REDIS_HOST = config.redis.host
assert REDIS_HOST, "Redis host is not set."
logging.info("Redis host is set")

POSTGRES_URL = os.getenv("POSTGRES_URL")
assert POSTGRES_URL, "Postgres URL is not set"
logging.info("Postgres URL is set")
