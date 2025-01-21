from abc import ABC, abstractmethod


class AuthenticationInterface(ABC):
    @abstractmethod
    def verify_token(token: str) -> bool:
        pass
