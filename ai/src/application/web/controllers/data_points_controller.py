from fastapi import APIRouter, Depends, Response, Header
from ....exports.exports import get_sqlite_query_database_service, get_auth_service
from src.internal.entities.router_models import TrainData
from src.internal.use_cases.query_service import QueryService
from src.internal.use_cases.authentication_service import AuthenticationService
import logging

logging.basicConfig(level=logging.INFO)

data_points = APIRouter()


@data_points.post("/data")
async def train_model(
    train_data: TrainData,
    token: str = Header(..., alias="Authorization"),
    query_service: QueryService = Depends(get_sqlite_query_database_service),
    auth_service: AuthenticationService = Depends(get_auth_service),
):
    extracted_token = token.split(" ")[1]
    response = auth_service.verify_token(extracted_token)
    if response is None:
        return Response(status_code=401, content="Unauthorized")
    try:
        response = query_service.add_data_to_vector_db(
            train_data.user_query, train_data.sql_query, response["email"]
        )
        if response is True:
            return Response(status_code=200, content="Data added successfully")
    except Exception:
        return Response(status_code=500, content="Internal Server Error")
