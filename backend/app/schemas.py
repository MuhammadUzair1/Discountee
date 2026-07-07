from datetime import date

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base schema: snake_case in Python, camelCase in JSON (matches the
    frontend TypeScript types so the API is a drop-in for the mock layer)."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class BankOut(CamelModel):
    id: str
    name: str
    monogram: str
    color: str


class MerchantOut(CamelModel):
    id: str
    name: str
    category: str
    vertical: str


class OfferOut(CamelModel):
    id: str
    bank_id: str
    merchant: MerchantOut
    title: str
    description: str
    discount_type: str
    discount_value: float
    max_discount_cap: int | None = None
    min_spend: int | None = None
    applicable_days: list[str]
    time_window: str | None = None
    cities: list[str]
    eligible_networks: list[str]
    eligible_tiers: list[str]
    valid_to: date
    scope_note: str | None = None
    exclusions: str | None = None
    terms_url: str
    source_url: str
    last_verified: date
    status: str
