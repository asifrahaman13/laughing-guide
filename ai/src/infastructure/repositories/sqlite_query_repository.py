import json
import psycopg2
import logging
from typing import Any

logging.basicConfig(level=logging.INFO)

class SqliteQueryRepository:
    def __init__(self) -> None:
        pass

    def query_database(self, user_query: str, connection_string: str) -> Any:
        try:
            conn = psycopg2.connect(connection_string)
            cursor = conn.cursor()
            cursor.execute(user_query)
            results = cursor.fetchall()
            headers = (
                [description[0] for description in cursor.description]
                if cursor.description
                else []
            )
            data = [dict(zip(headers, row)) for row in results]
            json_data = json.dumps(data)
            return json_data, headers

        except Exception as e:
            logging.error(f"Error: {e}")
            return
        finally:
            cursor.close()
            conn.close()
