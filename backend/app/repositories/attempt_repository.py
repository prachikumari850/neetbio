from datetime import datetime

from bson import ObjectId
from pymongo import ReturnDocument

from app.database.mongodb import get_database


def _attempts():
    return get_database()["test_attempts"]


async def create_indexes() -> None:
    await _attempts().create_index([("user_id", 1), ("started_at", -1)])
    await _attempts().create_index([("user_id", 1), ("status", 1), ("submitted_at", -1)])


async def insert(document: dict) -> None:
    await _attempts().insert_one(document)


async def find_for_user(user_id: ObjectId, attempt_id: ObjectId) -> dict | None:
    return await _attempts().find_one({"_id": attempt_id, "user_id": user_id})


async def mark_submitted(
    user_id: ObjectId, attempt_id: ObjectId, changes: dict
) -> dict | None:
    return await _attempts().find_one_and_update(
        {"_id": attempt_id, "user_id": user_id, "status": "in_progress"},
        {"$set": changes},
        return_document=ReturnDocument.AFTER,
    )


async def list_submitted(user_id: ObjectId, limit: int) -> list[dict]:
    cursor = (
        _attempts()
        .find({"user_id": user_id, "status": "submitted"}, {"answers": 0})
        .sort("submitted_at", -1)
        .limit(limit)
    )
    return await cursor.to_list()


async def delete_stale(user_id: ObjectId, before: datetime) -> None:
    await _attempts().delete_many(
        {"user_id": user_id, "status": "in_progress", "started_at": {"$lt": before}}
    )


async def totals(user_id: ObjectId) -> dict | None:
    pipeline = [
        {"$match": {"user_id": user_id, "status": "submitted"}},
        {
            "$group": {
                "_id": None,
                "tests": {"$sum": 1},
                "attempted": {"$sum": "$attempted"},
                "correct": {"$sum": "$correct"},
                "wrong": {"$sum": "$wrong"},
                "botany_attempted": {"$sum": "$by_subject.botany.attempted"},
                "botany_correct": {"$sum": "$by_subject.botany.correct"},
                "zoology_attempted": {"$sum": "$by_subject.zoology.attempted"},
                "zoology_correct": {"$sum": "$by_subject.zoology.correct"},
            }
        },
    ]
    cursor = await _attempts().aggregate(pipeline)
    groups = await cursor.to_list()
    return groups[0] if groups else None