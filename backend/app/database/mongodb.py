import logging

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import PyMongoError

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class MongoState:
    client: AsyncMongoClient | None = None


mongo = MongoState()


async def connect_to_mongo() -> None:
    settings = get_settings()
    mongo.client = AsyncMongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_timeout_ms,
        tz_aware=True,
    )


async def close_mongo_connection() -> None:
    if mongo.client is not None:
        await mongo.client.close()
        mongo.client = None


async def ping_database() -> bool:
    if mongo.client is None:
        return False

    try:
        await mongo.client.admin.command("ping")
    except PyMongoError:
        return False

    return True


def get_database() -> AsyncDatabase:
    if mongo.client is None:
        raise RuntimeError("MongoDB client is not initialised.")

    return mongo.client[get_settings().mongodb_db_name]