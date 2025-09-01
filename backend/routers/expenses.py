from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
try:
    from ..db import get_db
    from ..models import Expense, ExpenseTag, Category, User
    from ..schemas import ExpenseCreate, ExpenseOut, SummaryOut
except ImportError:
    # Fallback when running without package context
    from db import get_db
    from models import Expense, ExpenseTag, Category, User
    from schemas import ExpenseCreate, ExpenseOut, SummaryOut


router = APIRouter(prefix="/expenses", tags=["expenses"])


def get_current_user(db: Session, clerk_sub: str, email: str | None = None) -> User:
    user = db.query(User).filter(User.clerk_sub == clerk_sub).one_or_none()
    if user is None:
        user = User(clerk_sub=clerk_sub, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/", response_model=List[ExpenseOut])
def list_expenses(
    request: Request,
    db: Session = Depends(get_db),
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    categoryId: Optional[int] = None,
    tag: Optional[str] = None,
    merchant: Optional[str] = None,
    paymentMethod: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    payload = getattr(request.state, "payload", {})
    clerk_sub = payload.get("sub")
    email = payload.get("email") or payload.get("claims", {}).get("email")
    user = get_current_user(db, clerk_sub, email)

    q = db.query(Expense).filter(Expense.user_id == user.id)
    if from_date:
        q = q.filter(Expense.expense_date >= from_date)
    if to_date:
        q = q.filter(Expense.expense_date <= to_date)
    if categoryId:
        q = q.filter(Expense.category_id == categoryId)
    if merchant:
        q = q.filter(Expense.merchant.ilike(f"%{merchant}%"))
    if paymentMethod:
        q = q.filter(Expense.payment_method == paymentMethod)
    if tag:
        q = q.join(ExpenseTag).filter(ExpenseTag.tag == tag)

    items = (
        q.order_by(Expense.expense_date.desc(), Expense.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    # Attach tags list manually
    for e in items:
        e.tags  # ensure relationship loaded
    return [
        ExpenseOut(
            id=e.id,
            amount_cents=e.amount_cents,
            currency_code=e.currency_code,
            expense_date=e.expense_date,
            category_id=e.category_id,
            payment_method=e.payment_method,
            merchant=e.merchant,
            note=e.note,
            tags=[t.tag for t in e.tags],
            created_at=e.created_at,
        )
        for e in items
    ]


@router.post("/", response_model=ExpenseOut, status_code=201)
def create_expense(body: ExpenseCreate, request: Request, db: Session = Depends(get_db)):
    payload = getattr(request.state, "payload", {})
    clerk_sub = payload.get("sub")
    email = payload.get("email") or payload.get("claims", {}).get("email")
    user = get_current_user(db, clerk_sub, email)

    cat = db.query(Category).filter(Category.id == body.categoryId, Category.user_id == user.id).one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    # Convert amount to minor units safely
    try:
        amount_cents = int(round(float(body.amount) * 100))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid amount")

    exp = Expense(
        user_id=user.id,
        category_id=cat.id,
        amount_cents=amount_cents,
        currency_code=user.currency_code,
        expense_date=body.date,
        payment_method=body.paymentMethod,
        merchant=body.merchant,
        note=body.note,
    )
    db.add(exp)
    db.flush()
    # Tags
    if body.tags:
        for tag in body.tags:
            if tag and tag.strip():
                db.add(ExpenseTag(expense_id=exp.id, tag=tag.strip()))
    db.commit()
    db.refresh(exp)
    return ExpenseOut(
        id=exp.id,
        amount_cents=exp.amount_cents,
        currency_code=exp.currency_code,
        expense_date=exp.expense_date,
        category_id=exp.category_id,
        payment_method=exp.payment_method,
        merchant=exp.merchant,
        note=exp.note,
        tags=[t.tag for t in exp.tags],
        created_at=exp.created_at,
    )


@router.get("/summary", response_model=SummaryOut)
def summary(request: Request, db: Session = Depends(get_db)):
    payload = getattr(request.state, "payload", {})
    clerk_sub = payload.get("sub")
    email = payload.get("email") or payload.get("claims", {}).get("email")
    user = get_current_user(db, clerk_sub, email)

    today = date.today()
    month_start = today.replace(day=1)
    last7 = today - timedelta(days=6)

    total_month = (
        db.query(func.coalesce(func.sum(Expense.amount_cents), 0))
        .filter(Expense.user_id == user.id, Expense.expense_date >= month_start, Expense.expense_date <= today)
        .scalar()
        or 0
    )
    total_week = (
        db.query(func.coalesce(func.sum(Expense.amount_cents), 0))
        .filter(Expense.user_id == user.id, Expense.expense_date >= last7, Expense.expense_date <= today)
        .scalar()
        or 0
    )

    return SummaryOut(totalThisMonthCents=total_month, totalLast7dCents=total_week)
