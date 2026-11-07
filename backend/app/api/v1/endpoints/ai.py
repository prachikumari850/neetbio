import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, File, Form, Response, UploadFile, status
from fastapi.responses import StreamingResponse

from app.api.deps import CurrentUser
from app.schemas.analysis import VisionStatus
from app.schemas.chat import (
    AiStatus,
    ChatRequest,
    ConversationDetail,
    ConversationList,
)
from app.services import analysis_service, chat_service

router = APIRouter(prefix="/ai", tags=["ai"])

STREAM_HEADERS = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
QUESTION_MAX_LENGTH = 500


async def _to_ndjson(events: AsyncIterator[dict]) -> AsyncIterator[str]:
    async for event in events:
        yield json.dumps(event, ensure_ascii=False) + "\n"


def _stream_response(events: AsyncIterator[dict]) -> StreamingResponse:
    return StreamingResponse(
        _to_ndjson(events),
        media_type="application/x-ndjson",
        headers=STREAM_HEADERS,
    )


@router.get("/status", response_model=AiStatus)
async def ai_status(_user: CurrentUser) -> AiStatus:
    return await chat_service.get_status()


@router.get("/vision-status", response_model=VisionStatus)
async def vision_status(_user: CurrentUser) -> VisionStatus:
    return await analysis_service.get_vision_status()


@router.post("/chat")
async def chat(data: ChatRequest, user: CurrentUser) -> StreamingResponse:
    prepared = await chat_service.prepare_chat(user, data)
    return _stream_response(chat_service.stream_chat(prepared))


@router.post("/analyze")
async def analyze_image(
    _user: CurrentUser,
    image: Annotated[UploadFile, File()],
    question: Annotated[str, Form(max_length=QUESTION_MAX_LENGTH)] = "",
) -> StreamingResponse:
    prepared = await analysis_service.prepare_analysis(image, question)
    return _stream_response(analysis_service.stream_analysis(prepared))


@router.get("/conversations", response_model=ConversationList)
async def list_conversations(user: CurrentUser) -> ConversationList:
    return await chat_service.list_conversations(user)


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: str, user: CurrentUser) -> ConversationDetail:
    return await chat_service.get_conversation(user, conversation_id)


@router.delete(
    "/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_conversation(conversation_id: str, user: CurrentUser) -> Response:
    await chat_service.delete_conversation(user, conversation_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)