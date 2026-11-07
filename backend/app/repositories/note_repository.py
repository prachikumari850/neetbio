from bson import ObjectId
from pymongo import ReturnDocument

from app.database.mongodb import get_database


def _notes():
    return get_database()["notes"]


async def create_indexes() -> None:
    await _notes().create_index([("user_id", 1), ("updated_at", -1)])


async def list_for_user(user_id: ObjectId, limit: int) -> list[dict]:
    cursor = _notes().find({"user_id": user_id}).sort("updated_at", -1).limit(limit)
    return await cursor.to_list()


async def count_for_user(user_id: ObjectId) -> int:
    return await _notes().count_documents({"user_id": user_id})


async def insert(document: dict) -> None:
    await _notes().insert_one(document)


async def update(user_id: ObjectId, note_id: ObjectId, changes: dict) -> dict | None:
    return await _notes().find_one_and_update(
        {"_id": note_id, "user_id": user_id},
        {"$set": changes},
        return_document=ReturnDocument.AFTER,
    )


async def delete(user_id: ObjectId, note_id: ObjectId) -> bool:
    result = await _notes().delete_one({"_id": note_id, "user_id": user_id})
    return result.deleted_count == 1