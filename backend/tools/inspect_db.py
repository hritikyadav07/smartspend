import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import make_url
from dotenv import load_dotenv
from pathlib import Path

# Load .env next to backend if present
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise SystemExit("DATABASE_URL not set. Put it in backend/.env or the environment.")

# Normalize Postgres driver to psycopg3 if generic form provided
try:
    url = make_url(DATABASE_URL)
    if url.get_backend_name() == "postgresql" and url.drivername == "postgresql":
        # Switch to psycopg3 driver if none specified
        url = url.set(drivername="postgresql+psycopg")
        DATABASE_URL = str(url)
except Exception:
    pass

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    insp = inspect(conn)
    tables = insp.get_table_names()
    print("Tables:")
    for t in tables:
        cnt = conn.execute(text(f"SELECT COUNT(*) FROM {t}"))
        n = cnt.scalar_one()
        print(f"- {t}: {n} rows")

    # Optional: show first few users/categories
    def preview(table):
        print(f"\nPreview {table}:")
        res = conn.execute(text(f"SELECT * FROM {table} ORDER BY 1 DESC LIMIT 5"))
        for row in res.mappings():
            print(dict(row))

    if 'users' in tables:
        preview('users')
    if 'categories' in tables:
        preview('categories')
    if 'expenses' in tables:
        preview('expenses')
