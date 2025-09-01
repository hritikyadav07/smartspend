from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

# IMPORTANT: load .env BEFORE importing db/models so DATABASE_URL is available
_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=False)

try:
    from .db import get_db, engine, Base
    from .models import User, Category
    from .routers import categories as categories_router
    from .routers import expenses as expenses_router
except ImportError:
    from db import get_db, engine, Base
    from models import User, Category
    from routers import categories as categories_router
    from routers import expenses as expenses_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
if not CLERK_ISSUER:
    # Start but warn; requests will fail on first protected call.
    print("[WARN] CLERK_ISSUER not set. Protected routes will reject requests.")

JWKS_URL: Optional[str] = (
    f"{CLERK_ISSUER}/.well-known/jwks.json" if CLERK_ISSUER else None
)
_JWKS_CACHE: Optional[Dict[str, Any]] = None

ALLOWED_ALGS = ["RS256"]

def _fetch_jwks() -> Dict[str, Any]:
    global _JWKS_CACHE
    if JWKS_URL is None:
        raise HTTPException(status_code=500, detail="Server auth not configured (issuer)")
    try:
        res = requests.get(JWKS_URL, timeout=5)
        res.raise_for_status()
        _JWKS_CACHE = res.json()
        return _JWKS_CACHE
    except Exception:
        if _JWKS_CACHE:
            # Use stale cache if available
            return _JWKS_CACHE
        raise HTTPException(status_code=503, detail="Auth keys unavailable")

def get_public_key(token: str) -> Dict[str, Any]:
    headers = jwt.get_unverified_header(token)
    kid = headers.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="Invalid token header")
    jwks = _JWKS_CACHE or _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    # Cache miss; refresh once and retry
    jwks = _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise HTTPException(status_code=401, detail="Public key not found")

def verify_token(request: Request):
    if not CLERK_ISSUER:
        raise HTTPException(status_code=500, detail="Server auth misconfigured")
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth.split("Bearer ", 1)[1]
    key = get_public_key(token)
    alg = key.get("alg", "RS256")
    if alg not in ALLOWED_ALGS:
        raise HTTPException(status_code=401, detail="Unsupported token algorithm")
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=[alg],
            audience=None,  # Set if you use audience
            issuer=CLERK_ISSUER,
        )
        # Attach payload to request.state for downstream
        try:
            request.state.payload = payload
        except Exception:
            pass
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def answer():
    return {"message": "Yo Buddy"}

@app.get("/dashboard")
def protected(user_data: dict = Depends(verify_token)):
    return {"message": f"Hello, {user_data.get('sub', 'user')}!"}


# Initialize DB metadata if engine is available (dev convenience; use Alembic for real migrations)
try:
    if engine is not None:
        Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[WARN] Could not create tables automatically: {e}")


def seed_categories_if_needed(db: Session, user: User):
    exists = db.query(Category).filter(Category.user_id == user.id).first()
    if exists:
        return
    seeds = [
        "Food", "Transport", "Groceries", "Rent", "Entertainment",
        "Utilities", "Health", "Shopping", "Travel", "Misc",
    ]
    for name in seeds:
        db.add(Category(user_id=user.id, name=name, is_default=1))
    db.commit()


@app.middleware("http")
async def ensure_user_and_seed(request: Request, call_next):
    # After auth, if we have payload we can upsert user and seed categories on first access
    response = None
    if hasattr(request.state, "payload"):
        try:
            db = next(get_db())
            payload = request.state.payload
            clerk_sub = payload.get("sub")
            email = payload.get("email") or payload.get("claims", {}).get("email")
            user = db.query(User).filter(User.clerk_sub == clerk_sub).one_or_none()
            if user is None:
                user = User(clerk_sub=clerk_sub, email=email)
                db.add(user)
                db.commit()
                db.refresh(user)
                # Seed on first creation
                seed_categories_if_needed(db, user)
        except Exception:
            # Don’t block request; errors will surface on actual API usage
            pass
        finally:
            try:
                db.close()
            except Exception:
                pass
    response = await call_next(request)
    return response


# Expose routers with auth dependency so "payload" is available to route functions
def auth_dependency(request: Request):
    return verify_token(request)

app.include_router(categories_router.router, dependencies=[Depends(auth_dependency)])
app.include_router(expenses_router.router, dependencies=[Depends(auth_dependency)])
