import json
import logging
from collections.abc import AsyncIterator

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

STATUS_TIMEOUT_S = 3


class OllamaError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class OllamaUnavailable(OllamaError):
    pass


def _timeout(read_seconds: float | None = None) -> httpx.Timeout:
    settings = get_settings()
    return httpx.Timeout(
        connect=settings.ollama_connect_timeout_s,
        read=read_seconds or settings.ollama_read_timeout_s,
        write=10,
        pool=10,
    )


def _unavailable() -> OllamaUnavailable:
    return OllamaUnavailable(
        "The AI engine (Ollama) is not running. Start Ollama and try again."
    )


def describe_failure(status_code: int, body: bytes, model: str) -> str:
    if status_code == 404:
        return f"The model '{model}' is not installed. Run: ollama pull {model}"

    try:
        detail = json.loads(body).get("error")
    except (ValueError, AttributeError):
        detail = None

    return detail or f"Ollama returned an error (HTTP {status_code})."


def model_installed(configured: str, installed: list[str]) -> bool:
    return configured in installed or f"{configured}:latest" in installed


async def list_models() -> list[str]:
    settings = get_settings()

    try:
        async with httpx.AsyncClient(
            base_url=settings.ollama_base_url, timeout=STATUS_TIMEOUT_S
        ) as client:
            response = await client.get("/api/tags")
            response.raise_for_status()
    except (httpx.ConnectError, httpx.TimeoutException) as error:
        raise _unavailable() from error
    except httpx.HTTPError as error:
        raise OllamaError("Could not read the model list from Ollama.") from error

    return [model["name"] for model in response.json().get("models", [])]


async def embed(texts: list[str]) -> list[list[float]]:
    settings = get_settings()
    payload = {
        "model": settings.ollama_embed_model,
        "input": texts,
        "keep_alive": settings.ollama_keep_alive,
    }

    try:
        async with httpx.AsyncClient(
            base_url=settings.ollama_base_url, timeout=_timeout()
        ) as client:
            response = await client.post("/api/embed", json=payload)
    except httpx.ConnectError as error:
        raise _unavailable() from error
    except httpx.TimeoutException as error:
        raise OllamaError("The embedding model took too long to respond.") from error
    except httpx.HTTPError as error:
        raise OllamaError("Could not reach Ollama.") from error

    if response.status_code != 200:
        raise OllamaError(
            describe_failure(
                response.status_code, response.content, settings.ollama_embed_model
            )
        )

    return response.json()["embeddings"]


async def _stream_model(
    model: str,
    messages: list[dict],
    options: dict,
    keep_alive: str,
    read_seconds: float,
) -> AsyncIterator[str]:
    settings = get_settings()
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "keep_alive": keep_alive,
        "options": options,
    }

    try:
        async with httpx.AsyncClient(
            base_url=settings.ollama_base_url, timeout=_timeout(read_seconds)
        ) as client:
            async with client.stream("POST", "/api/chat", json=payload) as response:
                if response.status_code != 200:
                    body = await response.aread()
                    raise OllamaError(
                        describe_failure(response.status_code, body, model)
                    )

                async for line in response.aiter_lines():
                    if not line:
                        continue

                    chunk = json.loads(line)

                    if "error" in chunk:
                        raise OllamaError(chunk["error"])

                    text = chunk.get("message", {}).get("content", "")
                    if text:
                        yield text

                    if chunk.get("done"):
                        return
    except httpx.ConnectError as error:
        raise _unavailable() from error
    except httpx.TimeoutException as error:
        raise OllamaError(
            "The model took too long to respond. Try a smaller model or a simpler request."
        ) from error
    except httpx.HTTPError as error:
        raise OllamaError("The connection to Ollama was interrupted.") from error


async def stream_chat(messages: list[dict]) -> AsyncIterator[str]:
    settings = get_settings()
    options = {
        "num_ctx": settings.chat_context_tokens,
        "num_predict": settings.chat_max_new_tokens,
        "temperature": settings.chat_temperature,
    }

    async for text in _stream_model(
        settings.ollama_chat_model,
        messages,
        options,
        settings.ollama_keep_alive,
        settings.ollama_read_timeout_s,
    ):
        yield text


async def stream_vision(messages: list[dict]) -> AsyncIterator[str]:
    settings = get_settings()
    options = {
        "num_ctx": settings.vision_context_tokens,
        "num_predict": settings.vision_max_new_tokens,
        "temperature": settings.chat_temperature,
    }

    async for text in _stream_model(
        settings.ollama_vision_model,
        messages,
        options,
        settings.vision_keep_alive,
        settings.vision_read_timeout_s,
    ):
        yield text