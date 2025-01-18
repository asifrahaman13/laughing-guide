import json
import psycopg2

class SqliteQueryRepository:
    def __init__(self) -> None:
        pass

    def query_database(self, user_query: str, connection_string: str):
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
            # Convert the list of dictionaries to JSON
            json_data = json.dumps(data)
            print(json_data)
            return json_data, headers

        except Exception as e:
            print(f"Error connecting to database: {e}")
            return
        finally:
            cursor.close()
            conn.close()