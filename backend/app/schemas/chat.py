from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

MESSAGE_MAX_LENGTH = 2000


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=MESSAGE_MAX_LENGTH)
    conversation_id: str | None = Field(default=None, max_length=40)
    diagram_id: str | None = Field(default=None, max_length=80)

    @field_validator("message")
    @classmethod
    def clean_message(cls, value: str) -> str:
        message = value.strip()

        if not message:
            raise ValueError("Type a question first.")

        return message


class SourcePublic(BaseModel):
    diagram_id: str
    title: str
    score: float | None = None


class MessagePublic(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    sources: list[SourcePublic] = []
    created_at: datetime


class ConversationSummary(BaseModel):
    id: str
    title: str
    updated_at: datetime

    @classmethod
    def from_document(cls, document: dict) -> "ConversationSummary":
        return cls(
            id=str(document["_id"]),
            title=document["title"],
            updated_at=document["updated_at"],
        )


class ConversationDetail(ConversationSummary):
    messages: list[MessagePublic]

    @classmethod
    def from_document(cls, document: dict) -> "ConversationDetail":
        return cls(
            id=str(document["_id"]),
            title=document["title"],
            updated_at=document["updated_at"],
            messages=[
                MessagePublic.model_validate(message)
                for message in document["messages"]
            ],
        )


class ConversationList(BaseModel):
    items: list[ConversationSummary]


class AiStatus(BaseModel):
    ollama: Literal["up", "down"]
    chat_model: str
    chat_model_installed: bool
    embed_model: str
    embed_model_installed: bool
    knowledge_chunks: int