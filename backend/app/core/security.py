from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


# Checked when no user matches, so a login attempt takes about the same time
# whether or not the account exists.
DUMMY_PASSWORD_HASH = hash_password("not-a-real-password")


def create_access_token(user_id: str, token_version: int) -> str:
    settings = get_settings()
    issued_at = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "ver": token_version,
        "iat": issued_at,
        "exp": issued_at + timedelta(minutes=settings.access_token_expire_minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict | None:
    settings = get_settings()

    try:
        return jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
    except jwt.PyJWTError:
        return None