import asyncio
from collections.abc import AsyncIterator
from dataclasses import dataclass
from functools import lru_cache

from fastapi import UploadFile

from app.core.config import get_settings
from app.core.errors import AppError
from app.schemas.analysis import VisionStatus
from app.services import image_service, ollama_client
from app.services.ollama_client import OllamaError, model_installed

DEFAULT_QUESTION = "Explain this image in detail."

# One analysis at a time: two vision runs would slow each other badly on a CPU.
_state = {"busy": False}


@dataclass
class PreparedAnalysis:
    image_base64: str
    question: str


@lru_cache
def load_prompt() -> str:
    path = get_settings().prompts_dir / "image_analysis.txt"
    return path.read_text(encoding="utf-8").strip()


def _busy_error() -> AppError:
    return AppError(
        "Another image is being analyzed. Please wait a moment and try again.",
        429,
        "analysis_busy",
    )


async def prepare_analysis(upload: UploadFile, question: str) -> PreparedAnalysis:
    max_bytes = get_settings().max_upload_bytes

    if _state["busy"]:
        raise _busy_error()

    data = await upload.read(max_bytes + 1)

    if not data:
        raise AppError("The uploaded file is empty.", 422, "empty_upload")

    if len(data) > max_bytes:
        raise AppError(
            f"The image is larger than {max_bytes // (1024 * 1024)} MB.",
            413,
            "file_too_large",
        )

    image_base64 = await asyncio.to_thread(image_service.prepare_image, data)

    return PreparedAnalysis(
        image_base64=image_base64,
        question=question.strip() or DEFAULT_QUESTION,
    )


async def stream_analysis(prepared: PreparedAnalysis) -> AsyncIterator[dict]:
    if _state["busy"]:
        yield {"type": "error", "message": _busy_error().message}
        return

    _state["busy"] = True

    try:
        messages = [
            {"role": "system", "content": load_prompt()},
            {
                "role": "user",
                "content": prepared.question,
                "images": [prepared.image_base64],
            },
        ]
        produced_text = False

        async for text in ollama_client.stream_vision(messages):
            produced_text = produced_text or bool(text.strip())
            yield {"type": "token", "text": text}

        if not produced_text:
            yield {
                "type": "error",
                "message": "The model returned an empty reply. Please try again.",
            }
            return

        yield {"type": "done"}
    except OllamaError as error:
        yield {"type": "error", "message": error.message}
    finally:
        _state["busy"] = False


async def get_vision_status() -> VisionStatus:
    settings = get_settings()

    try:
        installed = await ollama_client.list_models()
        is_up = True
    except OllamaError:
        installed = []
        is_up = False

    return VisionStatus(
        ollama="up" if is_up else "down",
        vision_model=settings.ollama_vision_model,
        vision_model_installed=model_installed(settings.ollama_vision_model, installed),
    )