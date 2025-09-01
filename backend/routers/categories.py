from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
try:
    from ..db import get_db
    from ..models import Category, User
    from ..schemas import CategoryCreate, CategoryOut
except ImportError:
    from db import get_db
    from models import Category, User
    from schemas import CategoryCreate, CategoryOut
from typing import List


router = APIRouter(prefix="/categories", tags=["categories"])


def get_current_user(db: Session, clerk_sub: str, email: str | None = None) -> User:
    user = db.query(User).filter(User.clerk_sub == clerk_sub).one_or_none()
    if user is None:
        user = User(clerk_sub=clerk_sub, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/", response_model=List[CategoryOut])
def list_categories(request: Request, db: Session = Depends(get_db)):
    # payload is injected by main.verify_token via Depends
    payload = getattr(request.state, "payload", {})
    clerk_sub = payload.get("sub")
    email = payload.get("email") or payload.get("claims", {}).get("email")
    user = get_current_user(db, clerk_sub, email)
    # Seed defaults if none exist
    existing = db.query(Category).filter(Category.user_id == user.id).count()
    if existing == 0:
        seeds = [
            "Food", "Transport", "Groceries", "Rent", "Entertainment",
            "Utilities", "Health", "Shopping", "Travel", "Misc",
        ]
        for name in seeds:
            db.add(Category(user_id=user.id, name=name, is_default=1))
        db.commit()
    return db.query(Category).filter(Category.user_id == user.id).order_by(Category.name).all()


@router.post("/", response_model=CategoryOut, status_code=201)
def create_category(body: CategoryCreate, request: Request, db: Session = Depends(get_db)):
    payload = getattr(request.state, "payload", {})
    clerk_sub = payload.get("sub")
    email = payload.get("email") or payload.get("claims", {}).get("email")
    user = get_current_user(db, clerk_sub, email)
    exists = db.query(Category).filter(Category.user_id == user.id, Category.name.ilike(body.name)).first()
    if exists:
        raise HTTPException(status_code=409, detail="Category name already exists")
    cat = Category(user_id=user.id, name=body.name.strip(), icon=body.icon or None)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

