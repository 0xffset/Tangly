from typing import Optional
from sqlalchemy import Column, String, Integer
from sqlmodel import SQLModel, Field
from app.model.mixins import TimeMixin

class StatusTransactions(SQLModel, TimeMixin, table=True):
    __tablename__="status_transactions"
    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    status_code: int = Field(sa_column=Column("status_code", Integer, unique=True))
    status_message: str = Field(sa_column=Column("status_message", String, unique=False))
    
    