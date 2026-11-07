from fastapi import APIRouter, Response, status

from app.api.deps import CurrentUser
from app.schemas.learning import NoteInput, NoteList, NotePublic
from app.services import note_service

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=NoteList)
async def list_notes(user: CurrentUser) -> NoteList:
    return await note_service.list_notes(user)


@router.post("", response_model=NotePublic, status_code=status.HTTP_201_CREATED)
async def create_note(data: NoteInput, user: CurrentUser) -> NotePublic:
    return await note_service.create_note(user, data)


@router.put("/{note_id}", response_model=NotePublic)
async def update_note(note_id: str, data: NoteInput, user: CurrentUser) -> NotePublic:
    return await note_service.update_note(user, note_id, data)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, user: CurrentUser) -> Response:
    await note_service.delete_note(user, note_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)