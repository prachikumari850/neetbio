from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.errors import AppError
from app.core.security import decode_access_token
from app.repositories import user_repository

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> dict:
    unauthorized = AppError("Please log in again.", 401, "not_authenticated")

    if credentials is None:
        raise unauthorized

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise unauthorized

    user = await user_repository.find_by_id(payload.get("sub", ""))
    if user is None or user.get("token_version") != payload.get("ver"):
        raise unauthorized

    return user


CurrentUser = Annotated[dict, Depends(get_current_user)]