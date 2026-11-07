import os

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