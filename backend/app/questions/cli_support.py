from contextlib import asynccontextmanager

from app.database.mongodb import close_mongo_connection, connect_to_mongo, ping_database
from app.repositories import question_repository


@asynccontextmanager
async def database_session():
    await connect_to_mongo()

    try:
        if not await ping_database():
            raise SystemExit(
                "MongoDB is not reachable. Start the MongoDB service and try again."
            )

        await question_repository.create_indexes()
        yield
    finally:
        await close_mongo_connection()