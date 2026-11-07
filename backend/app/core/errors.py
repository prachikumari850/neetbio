import logging
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class AppError(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "app_error",
        details: Any = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details


def build_error_response(
    status_code: int,
    code: str,
    message: str,
    details: Any = None,
) -> JSONResponse:
    body = {"error": {"code": code, "message": message, "details": details}}
    return JSONResponse(status_code=status_code, content=body)


async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    return build_error_response(exc.status_code, exc.code, exc.message, exc.details)


async def handle_http_exception(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    return build_error_response(
        exc.status_code, f"http_{exc.status_code}", str(exc.detail)
    )


async def handle_validation_error(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return build_error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "validation_error",
        "The request data is invalid.",
        jsonable_encoder(exc.errors()),
    )


async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return build_error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "internal_error",
        "Something went wrong on our side.",
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, handle_app_error)
    app.add_exception_handler(StarletteHTTPException, handle_http_exception)
    app.add_exception_handler(RequestValidationError, handle_validation_error)
    app.add_exception_handler(Exception, handle_unexpected_error)