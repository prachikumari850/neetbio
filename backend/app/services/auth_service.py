import asyncio
import re
from datetime import datetime, timezone

from pymongo.errors import DuplicateKeyError

from app.core.errors import AppError
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    hash_password,
    verify_password,
)
from app.repositories import user_repository
from app.schemas.user import LoginRequest, ProfileUpdate, SignupRequest, TokenResponse, UserPublic


def _email_taken_error() -> AppError:
    return AppError(
        "An account with this email already exists.", 409, "email_taken"
    )


def _build_token_response(user: dict) -> TokenResponse:
    token = create_access_token(str(user["_id"]), user["token_version"])
    return TokenResponse(access_token=token, user=UserPublic.from_document(user))


async def _generate_username(email: str) -> str:
    base = re.sub(r"[^a-z0-9_.]", "", email.split("@")[0]) or "user"
    candidate = base
    suffix = 1

    while await user_repository.find_by_username(candidate):
        suffix += 1
        candidate = f"{base}{suffix}"

    return candidate


async def signup(data: SignupRequest) -> TokenResponse:
    if await user_repository.find_by_email(data.email):
        raise _email_taken_error()

    password_hash = await asyncio.to_thread(hash_password, data.password)
    now = datetime.now(timezone.utc)

    document = {
        "name": data.full_name,
        "email": data.email,
        "username": await _generate_username(data.email),
        "mobile": data.mobile,
        "password_hash": password_hash,
        "token_version": 0,
        "created_at": now,
        "updated_at": now,
    }

    try:
        user = await user_repository.insert_user(document)
    except DuplicateKeyError as error:
        if "email" in (error.details or {}).get("keyPattern", {}):
            raise _email_taken_error() from error
        raise AppError("Could not create the account. Please try again.", 409, "conflict") from error

    return _build_token_response(user)


async def login(data: LoginRequest) -> TokenResponse:
    identifier = data.identifier.strip().lower()

    if "@" in identifier:
        user = await user_repository.find_by_email(identifier)
    else:
        user = await user_repository.find_by_username(identifier)

    password_hash = user["password_hash"] if user else DUMMY_PASSWORD_HASH
    is_valid = await asyncio.to_thread(verify_password, data.password, password_hash)

    if user is None or not is_valid:
        raise AppError(
            "Incorrect email/username or password.", 401, "invalid_credentials"
        )

    return _build_token_response(user)


async def logout(user: dict) -> None:
    await user_repository.increment_token_version(user["_id"])


async def update_profile(user: dict, data: ProfileUpdate) -> dict:
    changes = data.model_dump(exclude_none=True)

    if not changes:
        return user

    new_email = changes.get("email")
    if new_email and new_email != user["email"]:
        if await user_repository.find_by_email(new_email):
            raise _email_taken_error()

    changes["updated_at"] = datetime.now(timezone.utc)

    try:
        updated_user = await user_repository.update_user(user["_id"], changes)
    except DuplicateKeyError as error:
        raise _email_taken_error() from error

    return updated_user