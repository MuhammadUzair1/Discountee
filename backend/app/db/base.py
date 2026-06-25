from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base class for all ORM models.

    Models defined in app/models/ should inherit from this so Alembic
    autogenerate can discover them via Base.metadata.
    """
