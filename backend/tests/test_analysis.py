import json
from io import BytesIO

from PIL import Image

from app.core.config import get_settings
from app.services import analysis_service, ollama_client
from app.services.ollama_client import OllamaUnavailable

ANALYZE_URL = "/api/v1/ai/analyze"
VISION_STATUS_URL = "/api/v1/ai/vision-status"


def png_bytes() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (40, 30), "green").save(buffer, format="PNG")
    return buffer.getvalue()


def analyze(client, headers=None, data=None, question=None):
    form = {"question": question} if question is not None else None

    return client.post(
        ANALYZE_URL,
        files={"image": ("cell.png", png_bytes() if data is None else data, "image/png")},
        data=form,
        headers=headers or {},
    )


def read_events(response):
    return [json.loads(line) for line in response.text.splitlines() if line]


def test_analysis_requires_login(db_client):
    assert analyze(db_client).status_code == 401


def test_analysis_streams_tokens_and_sends_one_jpeg_to_the_model(
    db_client, make_user, fake_ollama
):
    response = analyze(db_client, make_user())
    events = read_events(response)

    assert response.status_code == 200
    assert [event["type"] for event in events] == ["token", "token", "done"]

    user_message = fake_ollama.vision_calls[0][-1]
    assert len(user_message["images"]) == 1
    assert user_message["content"] == analysis_service.DEFAULT_QUESTION


def test_the_students_question_is_passed_to_the_model(db_client, make_user, fake_ollama):
    analyze(db_client, make_user(), question="What is the green part?")

    assert fake_ollama.vision_calls[0][-1]["content"] == "What is the green part?"


def test_system_prompt_comes_from_the_prompt_file(db_client, make_user, fake_ollama):
    analyze(db_client, make_user())

    assert "NEETBIO's Biology tutor" in fake_ollama.vision_calls[0][0]["content"]


def test_files_that_are_not_images_are_rejected(db_client, make_user, fake_ollama):
    response = analyze(db_client, make_user(), data=b"just some text")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_image"
    assert fake_ollama.vision_calls == []


def test_empty_uploads_are_rejected(db_client, make_user, fake_ollama):
    response = analyze(db_client, make_user(), data=b"")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "empty_upload"


def test_oversized_uploads_are_rejected(db_client, make_user, fake_ollama, monkeypatch):
    monkeypatch.setattr(get_settings(), "max_upload_bytes", 10)

    response = analyze(db_client, make_user())

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "file_too_large"


def test_a_second_analysis_is_refused_while_one_is_running(
    db_client, make_user, fake_ollama
):
    analysis_service._state["busy"] = True

    response = analyze(db_client, make_user())

    assert response.status_code == 429
    assert response.json()["error"]["code"] == "analysis_busy"


def test_model_failures_become_an_error_event(db_client, make_user, fake_ollama):
    fake_ollama.error = "vision exploded"

    events = read_events(analyze(db_client, make_user()))

    assert [event["type"] for event in events] == ["error"]
    assert events[0]["message"] == "vision exploded"
    assert analysis_service._state["busy"] is False


def test_vision_status_reports_the_installed_model(db_client, make_user, monkeypatch):
    async def list_models():
        return ["qwen2.5vl:3b"]

    monkeypatch.setattr(ollama_client, "list_models", list_models)

    body = db_client.get(VISION_STATUS_URL, headers=make_user()).json()

    assert body["ollama"] == "up"
    assert body["vision_model_installed"] is True


def test_vision_status_reports_ollama_down(db_client, make_user, monkeypatch):
    async def list_models():
        raise OllamaUnavailable("down")

    monkeypatch.setattr(ollama_client, "list_models", list_models)

    body = db_client.get(VISION_STATUS_URL, headers=make_user()).json()

    assert body["ollama"] == "down"
    assert body["vision_model_installed"] is False