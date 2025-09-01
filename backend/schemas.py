from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    icon: Optional[str] = None


class CategoryOut(BaseModel):
    id: int
    name: str
    icon: Optional[str]
    is_default: int
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    amount: float
    categoryId: int
    date: date
    paymentMethod: Optional[str] = None
    merchant: Optional[str] = None
    note: Optional[str] = None
    tags: Optional[List[str]] = []


class ExpenseOut(BaseModel):
    id: int
    amount_cents: int
    currency_code: str
    expense_date: date
    category_id: int
    payment_method: Optional[str]
    merchant: Optional[str]
    note: Optional[str]
    tags: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class SummaryOut(BaseModel):
    totalThisMonthCents: int
    totalLast7dCents: int
