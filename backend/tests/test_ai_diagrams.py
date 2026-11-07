from types import SimpleNamespace

import pytest

from app.core.config import get_settings
from app.services import diagram_generation_service, ollama_client
from app.services.ollama_client import OllamaUnavailable

URL = "/api/v1/ai/diagrams"

VALID = {
    "is_biology": True,
    "kind": "structure",
    "title": "Human Respiratory System",
    "parts": [
        {"name": name, "description": f"{name} description."}
        for name in ["Trachea", "Bronchi", "Alveoli", "Diaphragm"]
    ],
}
TOO_FEW_PARTS = {**VALID, "parts": []}


@pytest.fixture(autouse=True)
def reset_generation_state():
    diagram_generation_service._state["busy"] = False


@pytest.fixture
def fake_model(monkeypatch):
    state = SimpleNamespace(responses=[VALID], calls=[])

    async def generate_json(messages, schema):
        state.calls.append(messages)
        response = state.responses[min(len(state.calls) - 1, len(state.responses) - 1)]

        if isinstance(response, Exception):
            raise response

        return response

    monkeypatch.setattr(ollama_client, "generate_json", generate_json)
    return state


def generate(client, headers, prompt="human respiratory system"):
    return client.post(URL, json={"prompt": prompt}, headers=headers)


def test_generation_requires_login(db_client, fake_model):
    assert db_client.post(URL, json={"prompt": "human heart"}).status_code == 401


def test_generated_diagram_comes_with_a_layout_and_is_saved(db_client, make_user, fake_model):
    headers = make_user()

    response = generate(db_client, headers)
    listed = db_client.get(URL, headers=headers).json()["items"]

    assert response.status_code == 201
    body = response.json()
    assert body["kind"] == "structure"
    assert len(body["scene"]["nodes"]) == 4
    assert body["scene"]["body"] is not None
    assert [item["title"] for item in listed] == ["Human Respiratory System"]


def test_a_saved_diagram_can_be_opened_and_deleted(db_client, make_user, fake_model):
    headers = make_user()
    diagram_id = generate(db_client, headers).json()["id"]

    opened = db_client.get(f"{URL}/{diagram_id}", headers=headers)
    deleted = db_client.delete(f"{URL}/{diagram_id}", headers=headers)
    missing = db_client.get(f"{URL}/{diagram_id}", headers=headers)
    bad_id = db_client.get(f"{URL}/not-an-id", headers=headers)

    assert opened.json()["prompt"] == "human respiratory system"
    assert deleted.status_code == 204
    assert missing.status_code == 404
    assert bad_id.json()["error"]["code"] == "generated_diagram_not_found"


def test_users_cannot_see_or_delete_each_others_diagrams(db_client, make_user, fake_model):
    owner = make_user()
    other = make_user()
    diagram_id = generate(db_client, owner).json()["id"]

    assert db_client.get(URL, headers=other).json()["items"] == []
    assert db_client.get(f"{URL}/{diagram_id}", headers=other).status_code == 404
    assert db_client.delete(f"{URL}/{diagram_id}", headers=other).status_code == 404
    assert db_client.get(f"{URL}/{diagram_id}", headers=owner).status_code == 200


def test_non_biology_requests_are_refused_and_not_saved(db_client, make_user, fake_model):
    headers = make_user()
    fake_model.responses = [{"is_biology": False, "kind": "structure", "title": "", "parts": []}]

    response = generate(db_client, headers, "a diagram of a car engine")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "not_biology"
    assert db_client.get(URL, headers=headers).json()["items"] == []


def test_an_unusable_answer_is_retried(db_client, make_user, fake_model):
    fake_model.responses = [TOO_FEW_PARTS, VALID]

    response = generate(db_client, make_user())

    assert response.status_code == 201
    assert len(fake_model.calls) == 2


def test_it_gives_up_after_the_allowed_attempts(db_client, make_user, fake_model):
    headers = make_user()
    fake_model.responses = [TOO_FEW_PARTS]

    response = generate(db_client, headers)

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "diagram_unusable"
    assert len(fake_model.calls) == get_settings().diagram_max_attempts
    assert db_client.get(URL, headers=headers).json()["items"] == []


def test_ollama_being_down_is_reported(db_client, make_user, fake_model):
    fake_model.responses = [OllamaUnavailable("down")]

    response = generate(db_client, make_user())

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "ai_unavailable"


def test_a_second_generation_is_refused_while_one_is_running(db_client, make_user, fake_model):
    diagram_generation_service._state["busy"] = True

    response = generate(db_client, make_user())

    assert response.status_code == 429
    assert response.json()["error"]["code"] == "generation_busy"
    assert fake_model.calls == []


def test_the_saved_diagram_limit_is_enforced_before_calling_the_model(
    db_client, make_user, fake_model, monkeypatch
):
    monkeypatch.setattr(get_settings(), "saved_diagram_limit", 1)
    headers = make_user()
    generate(db_client, headers)

    response = generate(db_client, headers)

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "diagram_limit"
    assert len(fake_model.calls) == 1


def test_short_and_oversized_prompts_are_rejected(db_client, make_user, fake_model):
    headers = make_user()

    assert generate(db_client, headers, "ab").status_code == 422
    assert generate(db_client, headers, "   ").status_code == 422
    assert generate(db_client, headers, "a" * 301).status_code == 422


def test_the_prompt_reaches_the_model_as_data(db_client, make_user, fake_model):
    generate(db_client, make_user(), "human heart")

    system, user_message = fake_model.calls[0]
    assert "diagram planner" in system["content"]
    assert user_message["content"] == "Diagram request: human heart"