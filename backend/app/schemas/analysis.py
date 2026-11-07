from typing import Literal

from pydantic import BaseModel


class VisionStatus(BaseModel):
    ollama: Literal["up", "down"]
    vision_model: str
    vision_model_installed: bool