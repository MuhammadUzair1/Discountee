from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Merchant(Base):
    __tablename__ = "merchants"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    category: Mapped[str]
    vertical: Mapped[str]
