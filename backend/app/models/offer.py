from datetime import date

from sqlalchemy import Date, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.bank import Bank
from app.models.merchant import Merchant


class Offer(Base):
    __tablename__ = "offers"

    id: Mapped[str] = mapped_column(primary_key=True)
    bank_id: Mapped[str] = mapped_column(ForeignKey("banks.id"), index=True)
    merchant_id: Mapped[str] = mapped_column(ForeignKey("merchants.id"), index=True)

    title: Mapped[str]
    description: Mapped[str] = mapped_column(Text)

    discount_type: Mapped[str]  # percentage | flat | bogo | cashback
    discount_value: Mapped[float] = mapped_column(Float)
    max_discount_cap: Mapped[int | None] = mapped_column(default=None)
    min_spend: Mapped[int | None] = mapped_column(default=None)

    # List fields stored as JSON — DB-agnostic now; normalized into association
    # tables during the geo / normalization phase (see docs/04-data-model.md).
    applicable_days: Mapped[list[str]] = mapped_column(JSON)
    time_window: Mapped[str | None] = mapped_column(default=None)
    cities: Mapped[list[str]] = mapped_column(JSON)
    eligible_networks: Mapped[list[str]] = mapped_column(JSON)
    eligible_tiers: Mapped[list[str]] = mapped_column(JSON)

    valid_to: Mapped[date] = mapped_column(Date)
    scope_note: Mapped[str | None] = mapped_column(default=None)
    exclusions: Mapped[str | None] = mapped_column(default=None)

    terms_url: Mapped[str]
    source_url: Mapped[str]
    last_verified: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[str] = mapped_column(index=True)  # active | expired | unverified

    bank: Mapped[Bank] = relationship(lazy="joined")
    merchant: Mapped[Merchant] = relationship(lazy="joined")
