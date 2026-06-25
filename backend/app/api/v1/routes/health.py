from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
def ping() -> dict[str, str]:
    """Simple readiness check under the versioned API prefix."""
    return {"ping": "pong"}
