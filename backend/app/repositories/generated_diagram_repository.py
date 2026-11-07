from bson import ObjectId

from app.database.mongodb import get_database

NO_PARTS = {"parts": 0}


def _diagrams():
    return get_database()["generated_diagrams"]


async def create_indexes() -> None:
    await _diagrams().create_index([("user_id", 1), ("created_at", -1)])


async def count_for_user(user_id: ObjectId) -> int:
    return await _diagrams().count_documents({"user_id": user_id})


async def list_for_user(user_id: ObjectId, limit: int) -> list[dict]:
    cursor = (
        _diagrams()
        .find({"user_id": user_id}, NO_PARTS)
        .sort("created_at", -1)
        .limit(limit)
    )
    return await cursor.to_list()


async def find_for_user(user_id: ObjectId, diagram_id: ObjectId) -> dict | None:
    return await _diagrams().find_one({"_id": diagram_id, "user_id": user_id})


async def insert(document: dict) -> None:
    await _diagrams().insert_one(document)


async def delete(user_id: ObjectId, diagram_id: ObjectId) -> bool:
    result = await _diagrams().delete_one({"_id": diagram_id, "user_id": user_id})
    return result.deleted_count == 1