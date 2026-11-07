from datetime import datetime

from bson import ObjectId

from app.database.mongodb import get_database

NO_MESSAGES = {"messages": 0}


def _conversations():
    return get_database()["conversations"]


async def create_indexes() -> None:
    await _conversations().create_index([("user_id", 1), ("updated_at", -1)])


async def list_for_user(user_id: ObjectId, limit: int) -> list[dict]:
    cursor = (
        _conversations()
        .find({"user_id": user_id}, NO_MESSAGES)
        .sort("updated_at", -1)
        .limit(limit)
    )
    return await cursor.to_list()


async def find_for_user(user_id: ObjectId, conversation_id: ObjectId) -> dict | None:
    return await _conversations().find_one(
        {"_id": conversation_id, "user_id": user_id}
    )


async def insert(document: dict) -> None:
    await _conversations().insert_one(document)


async def append_messages(
    user_id: ObjectId,
    conversation_id: ObjectId,
    messages: list[dict],
    updated_at: datetime,
) -> bool:
    result = await _conversations().update_one(
        {"_id": conversation_id, "user_id": user_id},
        {"$push": {"messages": {"$each": messages}}, "$set": {"updated_at": updated_at}},
    )
    return result.matched_count == 1


async def delete(user_id: ObjectId, conversation_id: ObjectId) -> bool:
    result = await _conversations().delete_one(
        {"_id": conversation_id, "user_id": user_id}
    )
    return result.deleted_count == 1