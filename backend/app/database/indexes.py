from app.repositories import bookmark_repository, diagram_repository, user_repository


async def ensure_indexes() -> None:
    await user_repository.create_indexes()
    await diagram_repository.create_indexes()
    await bookmark_repository.create_indexes()