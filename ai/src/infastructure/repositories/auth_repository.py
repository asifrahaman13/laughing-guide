from jose import jwt
from ...config.config import SECRET_KEY
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class AuthRepository:
    def __init__(self):
        pass

    def verify_token(self, token: str) -> bool:
        try:
            claims = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print(claims)
            return claims
        except Exception as e:
            logging.info(f"Invalid token: {e}")
