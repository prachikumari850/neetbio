from datetime import datetime, timezone

from bson import ObjectId
from pymongo import ReturnDocument

from app.database.mongodb import get_database


def _goals():
    return get_database()["daily_goals"]


async def create_indexes() -> None:
    await _goals().create_index("user_id", unique=True)


async def find(user_id: ObjectId) -> dict | None:
    return await _goals().find_one({"user_id": user_id})


async def upsert(user_id: ObjectId, targets: dict) -> dict:
    return await _goals().find_one_and_update(
        {"user_id": user_id},
        {"$set": {**targets, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )