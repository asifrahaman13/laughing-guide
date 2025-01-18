from typing import Annotated, Any, Optional
from pydantic import BaseModel, Field


class QueryResponse(BaseModel):
    json_message: Any = Field(None, description="The json message")
    message: Annotated[str, "The response message"] = None
    status: Annotated[Optional[bool], "The status of the response"]
    sql_query: Annotated[Optional[str], "The SQL query"] = None
    answer_type: Annotated[Optional[str], "The type of the answer"] = None


class TrainData(BaseModel):
    user_query: Annotated[str, "Training data of user query"]
    sql_query: Annotated[str, "Training data of sql query"]
    source: Annotated[str, "metadata"]
