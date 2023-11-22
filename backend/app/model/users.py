from typing import Optional
from sqlalchemy import Column, String
from app.model.mixins import TimeMixin
from sqlmodel import SQLModel, Field



class Users(SQLModel, TimeMixin, table=True):
    __tablename__="users"
    
    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    first_name: str = Field(sa_column=Column("first_name", String, unique=False))
    last_name: str = Field(sa_column=Column("last_name", String, unique=False))
    email: str = Field(sa_column=Column("email", String, unique=True))
    password: str
    image: str
    
    