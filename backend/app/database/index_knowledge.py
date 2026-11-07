import asyncio

from app.database.mongodb import close_mongo_connection, connect_to_mongo, ping_database
from app.repositories import knowledge_repository
from app.services import rag_service
from app.services.ollama_client import OllamaError


async def build_knowledge_index() -> int:
    await connect_to_mongo()

    try:
        if not await ping_database():
            raise SystemExit(
                "MongoDB is not reachable. Start the MongoDB service and try again."
            )

        await knowledge_repository.create_indexes()

        try:
            return await rag_service.index_diagrams()
        except OllamaError as error:
            raise SystemExit(error.message) from error
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    indexed_count = asyncio.run(build_knowledge_index())

    if indexed_count == 0:
        print("No diagrams found. Run: python -m app.database.seed")
    else:
        print(f"Indexed {indexed_count} knowledge chunks.")