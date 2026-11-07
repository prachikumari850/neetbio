import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, field_validator

MOBILE_PATTERN = re.compile(r"^[6-9]\d{9}$")
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_BYTES = 72
NAME_MAX_LENGTH = 80


def check_name(value: str) -> str:
    name = " ".join(value.split())

    if len(name) < 2:
        raise ValueError("Enter your full name.")

    if len(name) > NAME_MAX_LENGTH:
        raise ValueError(f"Name must be at most {NAME_MAX_LENGTH} characters.")

    return name


def check_mobile(value: str) -> str:
    mobile = value.strip()

    if not MOBILE_PATTERN.match(mobile):
        raise ValueError("Enter a valid 10-digit mobile number.")

    return mobile


def check_password(value: str) -> str:
    if len(value) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters.")

    if len(value.encode("utf-8")) > PASSWORD_MAX_BYTES:
        raise ValueError("Password is too long.")

    if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
        raise ValueError("Use at least one letter and one number.")

    return value


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    password: str

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return check_name(value)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return str(value).lower()

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, value: str) -> str:
        return check_mobile(value)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return check_password(value)


class LoginRequest(BaseModel):
    identifier: str
    password: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    mobile: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        return None if value is None else check_name(value)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str | None) -> str | None:
        return None if value is None else str(value).lower()

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, value: str | None) -> str | None:
        return None if value is None else check_mobile(value)


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    username: str
    mobile: str
    created_at: datetime

    @classmethod
    def from_document(cls, document: dict) -> "UserPublic":
        return cls(
            id=str(document["_id"]),
            name=document["name"],
            email=document["email"],
            username=document["username"],
            mobile=document["mobile"],
            created_at=document["created_at"],
        )


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserPublic