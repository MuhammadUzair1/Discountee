from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.db.session import get_db
from app.schemas import BankOut

router = APIRouter()


@router.get("/banks", response_model=list[BankOut])
def list_banks(db: Session = Depends(get_db)) -> list[BankOut]:
    return crud.get_banks(db)


@router.get("/cities", response_model=list[str])
def list_cities(db: Session = Depends(get_db)) -> list[str]:
    return crud.get_cities(db)
