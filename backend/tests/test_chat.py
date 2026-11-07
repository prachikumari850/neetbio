import json

from app.services import ollama_client
from app.services.ollama_client import OllamaUnavailable

CHAT_URL = "/api/v1/ai/chat"
CONVERSATIONS_URL = "/api/v1/ai/conversations"
STATUS_URL = "/api/v1/ai/status"


def chat(client, headers, message="What is a nucleus?", **extra):
    return client.post(CHAT_URL, json={"message": message, **extra}, headers=headers)


def read_events(response):
    return [json.loads(line) for line in response.text.splitlines() if line]


def test_chat_requires_login(db_client):
    assert db_client.post(CHAT_URL, json={"message": "hi"}).status_code == 401


def test_chat_streams_meta_tokens_and_done(db_client, make_user, fake_ollama):
    response = chat(db_client, make_user())
    events = read_events(response)

    assert response.status_code == 200
    assert [event["type"] for event in events] == ["meta", "token", "token", "done"]
    assert "".join(e["text"] for e in events if e["type"] == "token") == "Hello student."


def test_reply_is_saved_as_a_conversation(db_client, make_user, fake_ollama):
    headers = make_user()
    events = read_events(chat(db_client, headers))
    conversation_id = events[0]["conversation_id"]

    listed = db_client.get(CONVERSATIONS_URL, headers=headers).json()["items"]
    detail = db_client.get(f"{CONVERSATIONS_URL}/{conversation_id}", headers=headers).json()

    assert [item["title"] for item in listed] == ["What is a nucleus?"]
    assert [message["role"] for message in detail["messages"]] == ["user", "assistant"]
    assert detail["messages"][1]["content"] == "Hello student."


def test_follow_up_sends_the_earlier_messages_to_the_model(db_client, make_user, fake_ollama):
    headers = make_user()
    conversation_id = read_events(chat(db_client, headers))[0]["conversation_id"]

    chat(db_client, headers, "And the nucleolus?", conversation_id=conversation_id)

    follow_up = fake_ollama.calls[1]
    assert [message["role"] for message in follow_up] == ["system", "user", "assistant", "user"]
    assert follow_up[-1]["content"] == "And the nucleolus?"


def test_failed_generation_saves_nothing(db_client, make_user, fake_ollama):
    headers = make_user()
    fake_ollama.error = "model exploded"

    events = read_events(chat(db_client, headers))

    assert [event["type"] for event in events] == ["meta", "error"]
    assert events[1]["message"] == "model exploded"
    assert db_client.get(CONVERSATIONS_URL, headers=headers).json()["items"] == []


def test_users_cannot_read_continue_or_delete_each_others_chats(db_client, make_user, fake_ollama):
    owner = make_user()
    other = make_user()
    conversation_id = read_events(chat(db_client, owner))[0]["conversation_id"]
    url = f"{CONVERSATIONS_URL}/{conversation_id}"

    assert db_client.get(url, headers=other).status_code == 404
    assert db_client.delete(url, headers=other).status_code == 404
    assert chat(db_client, other, conversation_id=conversation_id).status_code == 404
    assert db_client.get(url, headers=owner).status_code == 200


def test_a_chat_can_be_deleted(db_client, make_user, fake_ollama):
    headers = make_user()
    conversation_id = read_events(chat(db_client, headers))[0]["conversation_id"]
    url = f"{CONVERSATIONS_URL}/{conversation_id}"

    assert db_client.delete(url, headers=headers).status_code == 204
    assert db_client.get(url, headers=headers).status_code == 404


def test_focusing_on_a_diagram_puts_it_in_the_prompt(seeded_client, make_user, fake_ollama):
    events = read_events(chat(seeded_client, make_user(), diagram_id="plant-cell"))

    system_prompt = fake_ollama.calls[0][0]["content"]
    assert "Plant Cell" in system_prompt
    assert events[0]["sources"] == [
        {"diagram_id": "plant-cell", "title": "Plant Cell", "score": None}
    ]


def test_focusing_on_an_unknown_diagram_fails(seeded_client, make_user, fake_ollama):
    response = chat(seeded_client, make_user(), diagram_id="nothing-here")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "diagram_not_found"


def test_retrieval_adds_matching_diagrams_as_sources(indexed_knowledge, make_user, fake_ollama):
    events = read_events(
        chat(indexed_knowledge, make_user(), "What does the chloroplast do?")
    )

    source_ids = {source["diagram_id"] for source in events[0]["sources"]}
    assert "chloroplast" in source_ids
    assert "nephron" not in source_ids
    assert "Reference material" in fake_ollama.calls[0][0]["content"]


def test_unrelated_questions_get_no_sources(indexed_knowledge, make_user, fake_ollama):
    events = read_events(chat(indexed_knowledge, make_user(), "Explain photosynthesis"))

    assert events[0]["sources"] == []
    assert "Reference material" not in fake_ollama.calls[0][0]["content"]


def test_blank_and_oversized_messages_are_rejected(db_client, make_user, fake_ollama):
    headers = make_user()

    assert chat(db_client, headers, "   ").status_code == 422
    assert chat(db_client, headers, "a" * 2001).status_code == 422


def test_status_reports_installed_models(db_client, make_user, monkeypatch):
    async def list_models():
        return ["llama3.2:3b"]

    monkeypatch.setattr(ollama_client, "list_models", list_models)

    body = db_client.get(STATUS_URL, headers=make_user()).json()

    assert body["ollama"] == "up"
    assert body["chat_model_installed"] is True
    assert body["embed_model_installed"] is False


def test_status_reports_ollama_down(db_client, make_user, monkeypatch):
    async def list_models():
        raise OllamaUnavailable("down")

    monkeypatch.setattr(ollama_client, "list_models", list_models)

    body = db_client.get(STATUS_URL, headers=make_user()).json()

    assert body["ollama"] == "down"
    assert body["chat_model_installed"] is False