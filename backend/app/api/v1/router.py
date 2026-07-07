from fastapi import APIRouter

from app.api.v1.routes import banks, health, offers

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(banks.router, tags=["banks"])
api_router.include_router(offers.router, tags=["offers"])
