import asyncio
import logging
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from src.internal.use_cases.query_service import QueryService
from ....exports.exports import (
    get_sqlite_query_database_service,
    websocket_manager as manager,
)
from src.internal.use_cases.authentication_service import AuthenticationService
from ....exports.exports import get_auth_service

logging.basicConfig(level=logging.INFO)

query_controller = APIRouter()


@query_controller.websocket("/sqlite-query/{client_id}")
async def query_sqlite(
    websocket: WebSocket,
    client_id: str,
    auth_service: AuthenticationService = Depends(get_auth_service),
    query_service: QueryService = Depends(get_sqlite_query_database_service),
):
    await manager.connect(websocket, client_id)
    logging.info(f"Client {client_id} connected")

    verfify = auth_service.verify_token(client_id)
    if verfify is None:
        await manager.disconnect(websocket)
        return

    try:
        while True:
            user_input = await websocket.receive_json()
            query = user_input["query"]
            if query != "" and query is not None:
                async for response in query_service.query_db(query, verfify["email"]):
                    await asyncio.sleep(0)
                    await manager.send_personal_message(
                        response.model_dump(), websocket
                    )
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
