import base64
from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import get_settings
from app.core.errors import AppError

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
JPEG_QUALITY = 88


def _invalid_image(message: str) -> AppError:
    return AppError(message, 422, "invalid_image")


def _to_rgb(image: Image.Image) -> Image.Image:
    has_transparency = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )

    if not has_transparency:
        return image.convert("RGB")

    rgba = image.convert("RGBA")
    background = Image.new("RGB", rgba.size, "white")
    background.paste(rgba, mask=rgba.getchannel("A"))
    return background


def prepare_image(data: bytes) -> str:
    settings = get_settings()

    try:
        with Image.open(BytesIO(data)) as image:
            if image.format not in ALLOWED_FORMATS:
                raise _invalid_image("Upload a PNG, JPEG or WEBP image.")

            width, height = image.size
            if width * height > settings.max_image_pixels:
                raise AppError(
                    "That image has too many pixels. Upload a smaller one.",
                    422,
                    "image_too_large",
                )

            prepared = _to_rgb(ImageOps.exif_transpose(image))
            prepared.thumbnail((settings.image_max_side, settings.image_max_side))

            buffer = BytesIO()
            prepared.save(buffer, format="JPEG", quality=JPEG_QUALITY)
    except AppError:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as error:
        raise _invalid_image("That file is not a readable image.") from error

    return base64.b64encode(buffer.getvalue()).decode("ascii")