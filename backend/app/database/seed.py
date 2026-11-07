import asyncio
import json
from pathlib import Path

from app.database.mongodb import close_mongo_connection, connect_to_mongo, ping_database
from app.repositories import diagram_repository

SEED_FILE = Path(__file__).parent / "seed_data" / "diagrams.json"


def load_seed_diagrams() -> list[dict]:
    entries = json.loads(SEED_FILE.read_text(encoding="utf-8"))

    return [
        {
            "_id": entry["id"],
            **{key: value for key, value in entry.items() if key != "id"},
            "order": position,
        }
        for position, entry in enumerate(entries)
    ]


async def seed_diagrams() -> int:
    await connect_to_mongo()

    try:
        if not await ping_database():
            raise SystemExit(
                "MongoDB is not reachable. Start the MongoDB service and try again."
            )

        await diagram_repository.create_indexes()
        return await diagram_repository.upsert_many(load_seed_diagrams())
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    seeded_count = asyncio.run(seed_diagrams())
    print(f"Seeded {seeded_count} diagrams.")