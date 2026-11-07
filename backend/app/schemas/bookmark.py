from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

BookmarkType = Literal["diagram", "note", "question", "test"]

ITEM_ID_PATTERN = r"^[a-z]+-[A-Za-z0-9._-]{1,80}$"
FOLDER_NAME_MAX_LENGTH = 30


def check_internal_path(value: str | None) -> str | None:
    if value is None:
        return None

    if not value.startswith("/") or value.startswith("//") or "\\" in value:
        raise ValueError("Must be a path inside the app, such as /diagrams.")

    return value


class BookmarkCreate(BaseModel):
    item_id: str = Field(pattern=ITEM_ID_PATTERN)
    type: BookmarkType
    title: str = Field(min_length=1, max_length=200)
    subtitle: str = Field(default="", max_length=200)
    folder: str = Field(default="Others", max_length=FOLDER_NAME_MAX_LENGTH)
    image: str | None = Field(default=None, max_length=200)
    link: str = Field(min_length=1, max_length=200)

    @field_validator("image", "link")
    @classmethod
    def validate_internal_path(cls, value: str | None) -> str | None:
        return check_internal_path(value)

    @model_validator(mode="after")
    def check_item_id_matches_type(self) -> "BookmarkCreate":
        if not self.item_id.startswith(f"{self.type}-"):
            raise ValueError(f"item_id must start with '{self.type}-'.")

        return self


class BookmarkMove(BaseModel):
    folder: str = Field(min_length=1, max_length=FOLDER_NAME_MAX_LENGTH)


class FolderCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        name = " ".join(value.split())

        if not 1 <= len(name) <= FOLDER_NAME_MAX_LENGTH:
            raise ValueError(
                f"Folder name must be 1 to {FOLDER_NAME_MAX_LENGTH} characters."
            )

        return name


class BookmarkPublic(BaseModel):
    id: str
    type: BookmarkType
    title: str
    subtitle: str
    folder: str
    image: str | None
    link: str
    saved_at: datetime

    @classmethod
    def from_document(cls, document: dict) -> "BookmarkPublic":
        return cls(
            id=document["item_id"],
            type=document["type"],
            title=document["title"],
            subtitle=document["subtitle"],
            folder=document["folder"],
            image=document.get("image"),
            link=document["link"],
            saved_at=document["saved_at"],
        )


class BookmarkCollection(BaseModel):
    items: list[BookmarkPublic]
    folders: list[str]
    limit: int


class FolderList(BaseModel):
    folders: list[str]