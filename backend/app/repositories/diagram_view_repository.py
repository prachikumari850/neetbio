from datetime import datetime

from bson import ObjectId

from app.database.mongodb import get_database


def _views():
    return get_database()["diagram_views"]


async def create_indexes() -> None:
    await _views().create_index([("user_id", 1), ("viewed_at", -1)])
    await _views().create_index([("user_id", 1), ("diagram_id", 1), ("viewed_at", -1)])


async def latest_view(user_id: ObjectId, diagram_id: str) -> dict | None:
    return await _views().find_one(
        {"user_id": user_id, "diagram_id": diagram_id}, sort=[("viewed_at", -1)]
    )


async def insert(document: dict) -> None:
    await _views().insert_one(document)


async def events_since(user_id: ObjectId, since: datetime) -> list[dict]:
    cursor = (
        _views()
        .find(
            {"user_id": user_id, "viewed_at": {"$gte": since}},
            {"_id": 0, "diagram_id": 1, "viewed_at": 1},
        )
        .sort("viewed_at", -1)
    )
    return await cursor.to_list()


async def summary(user_id: ObjectId) -> list[dict]:
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": "$diagram_id",
                "views": {"$sum": 1},
                "last_viewed": {"$max": "$viewed_at"},
            }
        },
    ]
    cursor = await _views().aggregate(pipeline)
    return await cursor.to_list()