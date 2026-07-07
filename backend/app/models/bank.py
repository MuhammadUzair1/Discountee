from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Bank(Base):
    __tablename__ = "banks"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    monogram: Mapped[str]
    color: Mapped[str]
