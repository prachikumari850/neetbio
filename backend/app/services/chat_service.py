import logging
import uuid
from collections.abc import AsyncIterator
from dataclasses import dataclass
from datetime import datetime, timezone
from functools import lru_cache

from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError

from app.core.config import get_settings
from app.core.errors import AppError
from app.repositories import conversation_repository, knowledge_repository
from app.schemas.chat import (
    AiStatus,
    ChatRequest,
    ConversationDetail,
    ConversationList,
    ConversationSummary,
)
from app.services import ollama_client, rag_service
from app.services.ollama_client import OllamaError, model_installed

logger = logging.getLogger(__name__)

MAX_MESSAGES_PER_CONVERSATION = 60
TITLE_MAX_LENGTH = 60
CONVERSATION_LIST_LIMIT = 20


@dataclass
class PreparedChat:
    user: dict
    conversation_id: ObjectId
    is_new: bool
    history: list[dict]
    question: str
    focused_context: list[dict] | None


@lru_cache
def load_system_prompt() -> str:
    path = get_settings().prompts_dir / "tutor_system.txt"
    return path.read_text(encoding="utf-8").strip()


def _not_found() -> AppError:
    return AppError("Chat not found.", 404, "conversation_not_found")


def _parse_conversation_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise _not_found() from None


def _make_title(question: str) -> str:
    title = " ".join(question.split())

    if len(title) <= TITLE_MAX_LENGTH:
        return title

    return title[: TITLE_MAX_LENGTH - 1].rstrip() + "…"


def build_messages(question: str, history: list[dict], context: list[dict]) -> list[dict]:
    system = load_system_prompt()

    if context:
        references = "\n".join(
            f"[{number}] {chunk['text']}" for number, chunk in enumerate(context, start=1)
        )
        system += f"\n\nReference material from NEETBIO diagrams:\n{references}"

    recent = history[-get_settings().chat_history_messages :]

    return [
        {"role": "system", "content": system},
        *({"role": message["role"], "content": message["content"]} for message in recent),
        {"role": "user", "content": question},
    ]


async def prepare_chat(user: dict, request: ChatRequest) -> PreparedChat:
    history: list[dict] = []
    is_new = request.conversation_id is None

    if is_new:
        conversation_id = ObjectId()
    else:
        conversation_id = _parse_conversation_id(request.conversation_id)
        conversation = await conversation_repository.find_for_user(
            user["_id"], conversation_id
        )

        if conversation is None:
            raise _not_found()

        if len(conversation["messages"]) >= MAX_MESSAGES_PER_CONVERSATION:
            raise AppError(
                "This chat is full. Start a new chat to continue.",
                409,
                "conversation_full",
            )

        history = conversation["messages"]

    focused_context = None
    if request.diagram_id:
        focused_context = await rag_service.chunks_for_diagram(request.diagram_id)

        if focused_context is None:
            raise AppError("Diagram not found.", 404, "diagram_not_found")

    return PreparedChat(
        user=user,
        conversation_id=conversation_id,
        is_new=is_new,
        history=history,
        question=request.message,
        focused_context=focused_context,
    )


async def _retrieve_context(question: str) -> list[dict]:
    try:
        return await rag_service.retrieve(question)
    except (OllamaError, PyMongoError) as error:
        logger.warning("Answering without Biology notes: %s", error)
        return []


async def _save_exchange(prepared: PreparedChat, answer: str, sources: list[dict]) -> None:
    now = datetime.now(timezone.utc)
    messages = [
        {
            "id": uuid.uuid4().hex,
            "role": "user",
            "content": prepared.question,
            "sources": [],
            "created_at": now,
        },
        {
            "id": uuid.uuid4().hex,
            "role": "assistant",
            "content": answer,
            "sources": sources,
            "created_at": now,
        },
    ]
    user_id = prepared.user["_id"]

    if prepared.is_new:
        await conversation_repository.insert(
            {
                "_id": prepared.conversation_id,
                "user_id": user_id,
                "title": _make_title(prepared.question),
                "messages": messages,
                "created_at": now,
                "updated_at": now,
            }
        )
        return

    saved = await conversation_repository.append_messages(
        user_id, prepared.conversation_id, messages, now
    )

    if not saved:
        raise AppError("This chat no longer exists.", 404, "conversation_not_found")


async def stream_chat(prepared: PreparedChat) -> AsyncIterator[dict]:
    context = prepared.focused_context
    if context is None:
        context = await _retrieve_context(prepared.question)

    sources = rag_service.to_sources(context)
    yield {
        "type": "meta",
        "conversation_id": str(prepared.conversation_id),
        "sources": sources,
    }

    messages = build_messages(prepared.question, prepared.history, context)
    parts: list[str] = []

    try:
        async for text in ollama_client.stream_chat(messages):
            parts.append(text)
            yield {"type": "token", "text": text}
    except OllamaError as error:
        yield {"type": "error", "message": error.message}
        return

    answer = "".join(parts).strip()

    if not answer:
        yield {"type": "error", "message": "The model returned an empty reply. Please try again."}
        return

    try:
        await _save_exchange(prepared, answer, sources)
    except AppError as error:
        yield {"type": "error", "message": error.message}
        return
    except PyMongoError:
        logger.exception("Could not save a chat reply")
        yield {"type": "error", "message": "Your reply could not be saved. Please try again."}
        return

    yield {"type": "done"}


async def list_conversations(user: dict) -> ConversationList:
    documents = await conversation_repository.list_for_user(
        user["_id"], CONVERSATION_LIST_LIMIT
    )
    return ConversationList(
        items=[ConversationSummary.from_document(document) for document in documents]
    )


async def get_conversation(user: dict, conversation_id: str) -> ConversationDetail:
    document = await conversation_repository.find_for_user(
        user["_id"], _parse_conversation_id(conversation_id)
    )

    if document is None:
        raise _not_found()

    return ConversationDetail.from_document(document)


async def delete_conversation(user: dict, conversation_id: str) -> None:
    deleted = await conversation_repository.delete(
        user["_id"], _parse_conversation_id(conversation_id)
    )

    if not deleted:
        raise _not_found()


async def get_status() -> AiStatus:
    settings = get_settings()

    try:
        installed = await ollama_client.list_models()
        is_up = True
    except OllamaError:
        installed = []
        is_up = False

    return AiStatus(
        ollama="up" if is_up else "down",
        chat_model=settings.ollama_chat_model,
        chat_model_installed=model_installed(settings.ollama_chat_model, installed),
        embed_model=settings.ollama_embed_model,
        embed_model_installed=model_installed(settings.ollama_embed_model, installed),
        knowledge_chunks=await knowledge_repository.count(),
    )