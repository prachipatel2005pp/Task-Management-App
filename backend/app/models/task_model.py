from datetime import date, timedelta
from typing import Optional

from pydantic import BaseModel, validator

class Task(BaseModel):
    title: str
    description: str
    priority: str
    status: str
    dueDate: str
    owner_id: Optional[str] = None
    owner_name: Optional[str] = None

    @validator("dueDate")
    def valid_due_date(cls, value):
        try:
            parsed = date.fromisoformat(value)
        except ValueError:
            raise ValueError("Due date must be in YYYY-MM-DD format")

        today = date.today()
        if parsed < today:
            raise ValueError("Due date cannot be in the past")

        if parsed > today + timedelta(days=365 * 50):
            raise ValueError("Due date must be within 50 years")

        return value
