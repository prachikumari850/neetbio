from fastapi import APIRouter, Response, status

from app.api.deps import CurrentUser
from app.schemas.generated_diagram import (
    GeneratedDiagramDetail,
    GeneratedDiagramList,
    GenerateRequest,
)
from app.services import diagram_generation_service

router = APIRouter(prefix="/ai/diagrams", tags=["ai-diagrams"])


@router.post("", response_model=GeneratedDiagramDetail, status_code=status.HTTP_201_CREATED)
async def generate_diagram(data: GenerateRequest, user: CurrentUser) -> GeneratedDiagramDetail:
    return await diagram_generation_service.generate_diagram(user, data.prompt)


@router.get("", response_model=GeneratedDiagramList)
async def list_diagrams(user: CurrentUser) -> GeneratedDiagramList:
    return await diagram_generation_service.list_diagrams(user)


@router.get("/{diagram_id}", response_model=GeneratedDiagramDetail)
async def get_diagram(diagram_id: str, user: CurrentUser) -> GeneratedDiagramDetail:
    return await diagram_generation_service.get_diagram(user, diagram_id)


@router.delete("/{diagram_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagram(diagram_id: str, user: CurrentUser) -> Response:
    await diagram_generation_service.delete_diagram(user, diagram_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)