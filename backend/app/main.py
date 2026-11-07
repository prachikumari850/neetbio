import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import setup_logging
from app.database.indexes import ensure_indexes
from app.database.mongodb import close_mongo_connection, connect_to_mongo, ping_database

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()

    if await ping_database():
        await ensure_indexes()
        logger.info("Connected to MongoDB.")
    else:
        logger.warning(
            "MongoDB is not reachable. The API will start, but /health reports 'degraded'."
        )

    yield

    await close_mongo_connection()


def create_app() -> FastAPI:
    settings = get_settings()
    setup_logging(settings.debug)

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()