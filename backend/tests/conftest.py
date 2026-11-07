import os
from types import SimpleNamespace

os.environ["MONGODB_DB_NAME"] = "neetbio_test"
os.environ["MONGODB_TIMEOUT_MS"] = "500"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-1234567890"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from pymongo import MongoClient  # noqa: E402
from pymongo.errors import PyMongoError  # noqa: E402

from app.core.config import get_settings  # noqa: E402
from app.database.seed import load_seed_diagrams  # noqa: E402
from app.main import app  # noqa: E402
from app.services import analysis_service, ollama_client, rag_service  # noqa: E402
from app.services.ollama_client import OllamaError  # noqa: E402


def keyword_vector(text: str) -> list[float]:
    lowered = text.lower()
    return [
        1.0 if "chloroplast" in lowered else 0.0,
        1.0 if "nephron" in lowered else 0.0,
        0.0,
    ]


@pytest.fixture(autouse=True)
def reset_analysis_state():
    analysis_service._state["busy"] = False


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_database():
    settings = get_settings()
    assert settings.mongodb_db_name.endswith("_test")

    sync_client = MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=1000)

    try:
        sync_client.admin.command("ping")
    except PyMongoError:
        sync_client.close()
        pytest.skip("MongoDB is not running.")

    sync_client.drop_database(settings.mongodb_db_name)

    yield sync_client[settings.mongodb_db_name]

    sync_client.drop_database(settings.mongodb_db_name)
    sync_client.close()


@pytest.fixture
def db_client(test_database):
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def seeded_client(db_client, test_database):
    test_database["diagrams"].insert_many(load_seed_diagrams())
    return db_client


@pytest.fixture
def make_user(db_client):
    created = {"count": 0}

    def create() -> dict:
        created["count"] += 1
        response = db_client.post(
            "/api/v1/auth/signup",
            json={
                "full_name": "Test Student",
                "email": f"student{created['count']}@example.com",
                "mobile": "9876543210",
                "password": "neetbio123",
            },
        )
        return {"Authorization": f"Bearer {response.json()['access_token']}"}

    return create


@pytest.fixture
def fake_ollama(monkeypatch):
    state = SimpleNamespace(
        replies=["Hello ", "student."],
        vision_replies=["Plant ", "cell."],
        error=None,
        calls=[],
        vision_calls=[],
    )

    async def stream_chat(messages):
        state.calls.append(messages)

        if state.error:
            raise OllamaError(state.error)

        for part in state.replies:
            yield part

    async def stream_vision(messages):
        state.vision_calls.append(messages)

        if state.error:
            raise OllamaError(state.error)

        for part in state.vision_replies:
            yield part

    async def embed(texts):
        return [keyword_vector(text) for text in texts]

    monkeypatch.setattr(ollama_client, "stream_chat", stream_chat)
    monkeypatch.setattr(ollama_client, "stream_vision", stream_vision)
    monkeypatch.setattr(ollama_client, "embed", embed)
    return state


@pytest.fixture
def indexed_knowledge(seeded_client, test_database):
    chunks = [
        chunk
        for diagram in load_seed_diagrams()
        for chunk in rag_service.build_chunks(diagram)
    ]
    model = get_settings().ollama_embed_model
    test_database["knowledge_chunks"].insert_many(
        [
            {**chunk, "embedding": keyword_vector(chunk["text"]), "model": model}
            for chunk in chunks
        ]
    )
    return seeded_client