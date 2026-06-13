"""SQLAlchemy declarative base.

Models import ``Base`` from here. Keeping it in its own module avoids circular
imports between models, the session, and Alembic's migration env.
"""

from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
