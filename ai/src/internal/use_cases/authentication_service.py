from typing import Dict, Optional
from src.internal.interfaces.services.authentication_interface import (
    AuthenticationInterface,
)


class AuthenticationService(AuthenticationInterface):
    def __init__(self, auth_repository):
        self.auth_repository = auth_repository

    def verify_token(self, token: str) -> Optional[Dict[str, str]]:
        return self.auth_repository.verify_token(token)
