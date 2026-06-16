import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# If Render provides a DATABASE_URL environment variable, use it. 
# Otherwise, fall back to a local SQLite file for offline development.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local_dev.db")

# Quick fix for modern SQLAlchemy compatibility with Render/Heroku PostgreSQL URLs
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL, 
    # connect_args is ONLY needed for SQLite. We disable it if using Postgres.
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
