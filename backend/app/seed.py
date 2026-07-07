"""Seed the database with sample data (mirrors the frontend mock layer).

Run from the backend/ directory:  python -m app.seed
"""

from datetime import date

from app.db.session import SessionLocal
from app.models import Bank, Merchant, Offer

BANKS = [
    {"id": "meezan", "name": "Meezan Bank", "monogram": "MZN", "color": "#0a7d4d"},
    {"id": "hbl", "name": "HBL", "monogram": "HBL", "color": "#00855b"},
    {"id": "ubl", "name": "UBL", "monogram": "UBL", "color": "#1763a6"},
    {"id": "alfalah", "name": "Bank Alfalah", "monogram": "BAF", "color": "#9b1b30"},
    {"id": "scb", "name": "Standard Chartered", "monogram": "SC", "color": "#0473ea"},
    {"id": "faysal", "name": "Faysal Bank", "monogram": "FSL", "color": "#1f7a52"},
    {"id": "mcb", "name": "MCB Bank", "monogram": "MCB", "color": "#16794c"},
]

OFFERS = [
    {
        "id": "ofr-001",
        "bank_id": "meezan",
        "merchant": {"id": "m-kolachi", "name": "Kolachi", "category": "BBQ & Pakistani", "vertical": "restaurant"},
        "title": "15% off the total bill at Kolachi",
        "description": "Get 15% off your total bill at Kolachi when you pay with an eligible Meezan card. Valid on dine-in and takeaway.",
        "discount_type": "percentage",
        "discount_value": 15,
        "max_discount_cap": 3000,
        "applicable_days": ["All"],
        "cities": ["Karachi"],
        "eligible_networks": ["Visa", "Mastercard"],
        "eligible_tiers": ["Gold", "Platinum", "Signature"],
        "valid_to": "2026-12-31",
        "terms_url": "https://www.meezanbank.com/offers",
        "source_url": "https://www.meezanbank.com/discounts",
        "last_verified": "2026-06-22",
        "status": "active",
    },
    {
        "id": "ofr-002",
        "bank_id": "hbl",
        "merchant": {"id": "m-kababjees", "name": "Kababjees", "category": "BBQ & Grill", "vertical": "restaurant"},
        "title": "20% off on Tuesdays at Kababjees",
        "description": "Enjoy 20% off your bill every Tuesday with HBL credit cards. The perfect midweek treat.",
        "discount_type": "percentage",
        "discount_value": 20,
        "min_spend": 2000,
        "applicable_days": ["Tue"],
        "cities": ["Karachi", "Lahore"],
        "eligible_networks": ["Visa", "Mastercard", "UnionPay"],
        "eligible_tiers": ["Platinum", "World", "World Elite"],
        "valid_to": "2026-09-30",
        "exclusions": "Not valid on public holidays.",
        "terms_url": "https://www.hbl.com/offers/kababjees",
        "source_url": "https://www.hbl.com/personal/cards/discounts",
        "last_verified": "2026-06-18",
        "status": "active",
    },
    {
        "id": "ofr-003",
        "bank_id": "ubl",
        "merchant": {"id": "m-aylanto", "name": "Café Aylanto", "category": "Continental & Fine Dining", "vertical": "restaurant"},
        "title": "Buy 1 Get 1 on main courses",
        "description": "Buy one main course and get the second free at Café Aylanto, exclusively for UBL Signature cardholders.",
        "discount_type": "bogo",
        "discount_value": 0,
        "applicable_days": ["Mon", "Tue", "Wed", "Thu"],
        "time_window": "Dinner · 7pm–11pm",
        "cities": ["Lahore", "Karachi"],
        "eligible_networks": ["Visa", "Mastercard"],
        "eligible_tiers": ["Signature", "Infinite"],
        "valid_to": "2026-08-15",
        "scope_note": "Valid on à la carte main courses only.",
        "exclusions": "Not valid on weekends & public holidays.",
        "terms_url": "https://www.ubldigital.com/offers/aylanto",
        "source_url": "https://www.ubldigital.com/Personal/Cards/Discounts",
        "last_verified": "2026-06-24",
        "status": "active",
    },
    {
        "id": "ofr-004",
        "bank_id": "alfalah",
        "merchant": {"id": "m-howdy", "name": "Howdy", "category": "American & Burgers", "vertical": "restaurant"},
        "title": "Rs 500 off on orders above Rs 2,500",
        "description": "Flat Rs 500 off when you spend Rs 2,500 or more at Howdy with Bank Alfalah cards.",
        "discount_type": "flat",
        "discount_value": 500,
        "min_spend": 2500,
        "applicable_days": ["All"],
        "cities": ["Islamabad", "Rawalpindi"],
        "eligible_networks": ["Visa", "Mastercard", "UnionPay"],
        "eligible_tiers": ["Gold", "Platinum", "Titanium"],
        "valid_to": "2026-07-20",
        "terms_url": "https://www.bankalfalah.com/offers/howdy",
        "source_url": "https://www.bankalfalah.com/personal-banking/cards/offers",
        "last_verified": "2026-06-21",
        "status": "active",
    },
    {
        "id": "ofr-005",
        "bank_id": "scb",
        "merchant": {"id": "m-okra", "name": "OKRA", "category": "Mediterranean", "vertical": "restaurant"},
        "title": "25% off for Standard Chartered Priority",
        "description": "Standard Chartered Priority cardholders get 25% off the total bill at OKRA. Dine-in only.",
        "discount_type": "percentage",
        "discount_value": 25,
        "max_discount_cap": 5000,
        "applicable_days": ["All"],
        "cities": ["Karachi"],
        "eligible_networks": ["Visa", "Mastercard"],
        "eligible_tiers": ["Infinite", "World Elite"],
        "valid_to": "2026-11-30",
        "scope_note": "Dine-in only.",
        "terms_url": "https://www.sc.com/pk/offers/okra",
        "source_url": "https://www.sc.com/pk/promotions",
        "last_verified": "2026-06-15",
        "status": "active",
    },
    {
        "id": "ofr-006",
        "bank_id": "faysal",
        "merchant": {"id": "m-chaayekhana", "name": "Chaaye Khana", "category": "Café & Desserts", "vertical": "restaurant"},
        "title": "10% off on desserts",
        "description": "Sweeten your day with 10% off the dessert menu at Chaaye Khana using Faysal Bank cards.",
        "discount_type": "percentage",
        "discount_value": 10,
        "applicable_days": ["All"],
        "cities": ["Islamabad", "Lahore"],
        "eligible_networks": ["Visa", "PayPak"],
        "eligible_tiers": ["Debit", "Classic", "Gold"],
        "valid_to": "2026-10-10",
        "scope_note": "Valid on desserts only.",
        "terms_url": "https://www.faysalbank.com/offers/chaaye-khana",
        "source_url": "https://www.faysalbank.com/en/personal/cards/discounts",
        "last_verified": "2026-06-12",
        "status": "active",
    },
    {
        "id": "ofr-007",
        "bank_id": "mcb",
        "merchant": {"id": "m-bundukhan", "name": "Bundu Khan", "category": "BBQ & Pakistani", "vertical": "restaurant"},
        "title": "5% cashback at Bundu Khan",
        "description": "Earn 5% cashback on your bill at Bundu Khan when you pay with MCB cards. Cashback credited within 30 days.",
        "discount_type": "cashback",
        "discount_value": 5,
        "max_discount_cap": 1500,
        "applicable_days": ["All"],
        "cities": ["Lahore", "Karachi", "Islamabad"],
        "eligible_networks": ["Visa", "Mastercard", "PayPak"],
        "eligible_tiers": ["Gold", "Platinum"],
        "valid_to": "2026-12-15",
        "terms_url": "https://www.mcb.com.pk/offers/bundu-khan",
        "source_url": "https://www.mcb.com.pk/personal/cards/discounts",
        "last_verified": "2026-06-23",
        "status": "active",
    },
    {
        "id": "ofr-008",
        "bank_id": "meezan",
        "merchant": {"id": "m-xanders", "name": "Xander's", "category": "Continental", "vertical": "restaurant"},
        "title": "Weekend brunch — 20% off",
        "description": "20% off the weekend brunch menu at Xander's for Meezan Visa Platinum and above.",
        "discount_type": "percentage",
        "discount_value": 20,
        "applicable_days": ["Sat", "Sun"],
        "time_window": "Brunch · 11am–4pm",
        "cities": ["Lahore", "Islamabad"],
        "eligible_networks": ["Visa"],
        "eligible_tiers": ["Platinum", "Signature", "Infinite"],
        "valid_to": "2026-08-31",
        "scope_note": "Valid on the brunch menu only.",
        "terms_url": "https://www.meezanbank.com/offers/xanders",
        "source_url": "https://www.meezanbank.com/discounts",
        "last_verified": "2026-06-19",
        "status": "active",
    },
    {
        "id": "ofr-009",
        "bank_id": "hbl",
        "merchant": {"id": "m-tooso", "name": "Tooso", "category": "Italian & Pizza", "vertical": "restaurant"},
        "title": "15% off at Tooso",
        "description": "15% off the total bill at Tooso with HBL debit and credit cards. Dine-in and delivery.",
        "discount_type": "percentage",
        "discount_value": 15,
        "applicable_days": ["All"],
        "cities": ["Karachi"],
        "eligible_networks": ["Visa", "Mastercard", "PayPak"],
        "eligible_tiers": ["Debit", "Classic", "Gold", "Platinum"],
        "valid_to": "2026-07-05",
        "terms_url": "https://www.hbl.com/offers/tooso",
        "source_url": "https://www.hbl.com/personal/cards/discounts",
        "last_verified": "2026-05-02",
        "status": "active",
    },
    {
        "id": "ofr-010",
        "bank_id": "ubl",
        "merchant": {"id": "m-kfc", "name": "KFC", "category": "Fast Food", "vertical": "restaurant"},
        "title": "Rs 300 off on orders above Rs 1,500",
        "description": "Flat Rs 300 off at KFC nationwide when you spend Rs 1,500 or more with UBL cards.",
        "discount_type": "flat",
        "discount_value": 300,
        "min_spend": 1500,
        "applicable_days": ["All"],
        "cities": ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
        "eligible_networks": ["Visa", "Mastercard", "UnionPay", "PayPak"],
        "eligible_tiers": ["Debit", "Classic", "Gold", "Platinum"],
        "valid_to": "2026-09-01",
        "terms_url": "https://www.ubldigital.com/offers/kfc",
        "source_url": "https://www.ubldigital.com/Personal/Cards/Discounts",
        "last_verified": "2026-06-25",
        "status": "active",
    },
    {
        "id": "ofr-011",
        "bank_id": "scb",
        "merchant": {"id": "m-monal", "name": "Monal", "category": "Pakistani & BBQ", "vertical": "restaurant"},
        "title": "18% off with a view at Monal",
        "description": "18% off your bill at Monal Islamabad for Standard Chartered cardholders.",
        "discount_type": "percentage",
        "discount_value": 18,
        "max_discount_cap": 4000,
        "applicable_days": ["All"],
        "cities": ["Islamabad"],
        "eligible_networks": ["Visa", "Mastercard"],
        "eligible_tiers": ["Platinum", "Signature", "Infinite"],
        "valid_to": "2026-10-31",
        "terms_url": "https://www.sc.com/pk/offers/monal",
        "source_url": "https://www.sc.com/pk/promotions",
        "last_verified": "2026-06-10",
        "status": "unverified",
    },
    {
        "id": "ofr-012",
        "bank_id": "alfalah",
        "merchant": {"id": "m-coliseum", "name": "Coliseum Cinema", "category": "Entertainment", "vertical": "retail"},
        "title": "2 tickets for the price of 1",
        "description": "Buy one cinema ticket and get one free at Coliseum with Bank Alfalah credit cards. Weekdays only.",
        "discount_type": "bogo",
        "discount_value": 0,
        "applicable_days": ["Mon", "Tue", "Wed", "Thu"],
        "cities": ["Lahore"],
        "eligible_networks": ["Visa", "Mastercard"],
        "eligible_tiers": ["Gold", "Platinum", "Titanium"],
        "valid_to": "2026-07-31",
        "exclusions": "Not valid on weekends, public holidays, or premium screenings.",
        "terms_url": "https://www.bankalfalah.com/offers/coliseum",
        "source_url": "https://www.bankalfalah.com/personal-banking/cards/offers",
        "last_verified": "2026-06-20",
        "status": "active",
    },
]

DATE_FIELDS = ("valid_to", "last_verified")


def seed() -> None:
    db = SessionLocal()
    try:
        # Idempotent: clear then re-insert.
        db.query(Offer).delete()
        db.query(Merchant).delete()
        db.query(Bank).delete()
        db.commit()

        for b in BANKS:
            db.add(Bank(**b))

        seen_merchants: dict[str, Merchant] = {}
        for o in OFFERS:
            m = o["merchant"]
            if m["id"] not in seen_merchants:
                seen_merchants[m["id"]] = Merchant(**m)
                db.add(seen_merchants[m["id"]])
        db.flush()

        for o in OFFERS:
            data = {k: v for k, v in o.items() if k != "merchant"}
            data["merchant_id"] = o["merchant"]["id"]
            for f in DATE_FIELDS:
                data[f] = date.fromisoformat(data[f])
            db.add(Offer(**data))

        db.commit()
        print(
            f"Seeded {len(BANKS)} banks, {len(seen_merchants)} merchants, "
            f"{len(OFFERS)} offers."
        )
    finally:
        db.close()


if __name__ == "__main__":
    seed()
