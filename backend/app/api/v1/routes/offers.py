from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.session import get_db
from app.schemas import OfferOut

router = APIRouter()


# Declared before "/offers/{offer_id}" so it isn't captured as an id.
@router.get("/offers/featured", response_model=list[OfferOut])
def featured_offers(limit: int = 6, db: Session = Depends(get_db)) -> list[OfferOut]:
    return crud.get_featured_offers(db, limit=limit)


@router.get("/offers", response_model=list[OfferOut])
def list_offers(
    bank: str | None = None,
    network: str | None = None,
    tier: str | None = None,
    city: str | None = None,
    vertical: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
) -> list[OfferOut]:
    return crud.get_offers(
        db,
        bank_id=bank,
        network=network,
        tier=tier,
        city=city,
        vertical=vertical,
        search=q,
    )


@router.get("/offers/{offer_id}", response_model=OfferOut)
def get_offer(offer_id: str, db: Session = Depends(get_db)) -> OfferOut:
    offer = crud.get_offer(db, offer_id)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer
