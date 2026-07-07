from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Bank, Offer


def get_banks(db: Session) -> list[Bank]:
    return list(db.scalars(select(Bank).order_by(Bank.name)))


def get_cities(db: Session) -> list[str]:
    cities: set[str] = set()
    for offer in db.scalars(select(Offer)):
        cities.update(offer.cities)
    return sorted(cities)


def _all_offers(db: Session) -> list[Offer]:
    return list(db.scalars(select(Offer)))


def get_offers(
    db: Session,
    *,
    bank_id: str | None = None,
    network: str | None = None,
    tier: str | None = None,
    city: str | None = None,
    vertical: str | None = None,
    search: str | None = None,
) -> list[Offer]:
    """Filter offers. JSON list fields are matched in Python — fine for the
    current dataset; pushed into SQL when we move to Postgres at scale."""
    results = []
    q = search.lower().strip() if search else None
    for offer in _all_offers(db):
        if bank_id and offer.bank_id != bank_id:
            continue
        if network and network not in offer.eligible_networks:
            continue
        if tier and tier not in offer.eligible_tiers:
            continue
        if city and city not in offer.cities:
            continue
        if vertical and offer.merchant.vertical != vertical:
            continue
        if q:
            haystack = (
                f"{offer.merchant.name} {offer.merchant.category} {offer.title}"
            ).lower()
            if q not in haystack:
                continue
        results.append(offer)
    return results


def get_featured_offers(db: Session, limit: int = 6) -> list[Offer]:
    active = [o for o in _all_offers(db) if o.status == "active"]
    active.sort(key=lambda o: o.discount_value, reverse=True)
    return active[:limit]


def get_offer(db: Session, offer_id: str) -> Offer | None:
    return db.get(Offer, offer_id)
