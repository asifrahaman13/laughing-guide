import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from math import ceil
import redis.asyncio as redis
import uvicorn
from contextlib import asynccontextmanager
from fastapi import Depends, HTTPException, Request, Response
from fastapi import status
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import os
from .config.config import REDIS_HOST, REDIS_PORT
from .application.web.controllers.query_controller import query_controller
from .application.web.controllers.data_points_controller import data_points
from .infastructure.repositories.vector_db_repository import QdrantService
from .config.config import QDRANT_API_ENDPOINT

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


async def client_identifier(request: Request):
    return request.client.host


async def custom_callback(request: Request, response: Response, pexpire: int):
    expire = ceil(pexpire / 1000)
    raise HTTPException(
        status.HTTP_429_TOO_MANY_REQUESTS,
        f"Too Many Requests. Retry after {expire} seconds.",
        headers={"Retry-After": str(expire)},
    )


@asynccontextmanager
async def lifespan(_: FastAPI):

    qdrant_url= QDRANT_API_ENDPOINT
    logging.info(f"Qdrant url being used: {qdrant_url}")
    qdrant_service=QdrantService(qdrant_url)
    qdrant_service.create_collection("sample_collection")

    redis_connection = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    await FastAPILimiter.init(
        redis=redis_connection,
        identifier=client_identifier,
        http_callback=custom_callback,
    )
    yield
    await FastAPILimiter.close()


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    query_controller,
    prefix="/query",
    tags=["Query router"],
)

app.include_router(data_points, prefix="/train", tags=["Add more contexts"])


@app.get(
    "/health",
    dependencies=[
        Depends(RateLimiter(times=10, seconds=10, identifier=client_identifier))
    ],
)
async def health_check(request: Request):
    ip = request.client.host
    logging.info(f"Request from IP: {ip}")
    return JSONResponse(status_code=200, content={"status": "healthy"})


@app.get("/")
async def server_health_checkup():
    return JSONResponse(
        status_code=200,
        content={"status": "The server is running as expected."},
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    logging.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
