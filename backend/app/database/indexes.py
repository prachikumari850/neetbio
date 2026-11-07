from app.repositories import (
    attempt_repository,
    bookmark_repository,
    conversation_repository,
    diagram_repository,
    diagram_view_repository,
    generated_diagram_repository,
    goal_repository,
    knowledge_repository,
    note_repository,
    question_repository,
    user_repository,
)


async def ensure_indexes() -> None:
    await user_repository.create_indexes()
    await diagram_repository.create_indexes()
    await bookmark_repository.create_indexes()
    await conversation_repository.create_indexes()
    await knowledge_repository.create_indexes()
    await generated_diagram_repository.create_indexes()
    await question_repository.create_indexes()
    await attempt_repository.create_indexes()
    await note_repository.create_indexes()
    await goal_repository.create_indexes()
    await diagram_view_repository.create_indexes()