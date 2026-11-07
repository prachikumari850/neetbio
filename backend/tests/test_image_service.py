import base64
from io import BytesIO

import pytest
from PIL import Image

from app.core.config import get_settings
from app.core.errors import AppError
from app.services.image_service import prepare_image


def make_image(size=(40, 30), mode="RGB", image_format="PNG", color="green") -> bytes:
    buffer = BytesIO()
    Image.new(mode, size, color).save(buffer, format=image_format)
    return buffer.getvalue()


def decode(prepared: str) -> Image.Image:
    return Image.open(BytesIO(base64.b64decode(prepared)))


def test_png_is_converted_to_jpeg():
    result = decode(prepare_image(make_image()))

    assert result.format == "JPEG"
    assert result.size == (40, 30)


def test_large_images_are_scaled_down_keeping_their_shape():
    result = decode(prepare_image(make_image(size=(3000, 2000))))

    assert max(result.size) == 1024
    assert result.size == (1024, 683)


def test_transparent_areas_become_white():
    result = decode(prepare_image(make_image(size=(10, 10), mode="RGBA", color=(0, 0, 0, 0))))

    assert all(channel > 240 for channel in result.convert("RGB").getpixel((0, 0)))


def test_files_that_are_not_images_are_rejected():
    with pytest.raises(AppError) as error:
        prepare_image(b"this is definitely not an image")

    assert error.value.code == "invalid_image"


def test_formats_outside_the_allow_list_are_rejected():
    with pytest.raises(AppError) as error:
        prepare_image(make_image(image_format="GIF"))

    assert error.value.code == "invalid_image"


def test_images_with_too_many_pixels_are_rejected(monkeypatch):
    monkeypatch.setattr(get_settings(), "max_image_pixels", 100)

    with pytest.raises(AppError) as error:
        prepare_image(make_image(size=(20, 20)))

    assert error.value.code == "image_too_large"