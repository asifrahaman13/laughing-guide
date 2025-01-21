from fastapi import APIRouter, Depends, Response

from ....exports.exports import get_sqlite_query_database_service
from src.internal.entities.router_models import TrainData
from src.internal.use_cases.query_service import QueryService
import logging 

logging.basicConfig(level=logging.INFO)

data_points = APIRouter()


@data_points.post("/data")
async def train_model(
    train_data: TrainData,
    query_service: QueryService = Depends(get_sqlite_query_database_service),
):
    logging.info("Adding data to vector database")
    logging.info(f"User Query: {train_data}")
    try:
        response = query_service.add_data_to_vector_db(
            train_data.user_query, train_data.sql_query, train_data.source
        )
        if response is True:
            return Response(status_code=200, content="Data added successfully")
    except Exception:
        return Response(status_code=500, content="Internal Server Error")
