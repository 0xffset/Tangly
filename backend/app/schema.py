from fastapi import HTTPException
import logging
import re
from typing import TypeVar, Optional

from pydantic import BaseModel, validator
from sqlalchemy import false


T = TypeVar("T")

# get root logger
logger = logging.getLogger(__name__)


class RegisterSchema(BaseModel):
    first_name: str
    last_name: str
    password: str
    email: str

    @validator("email")
    def email_validation(cls, v):
        logger.debug(f"email in 2 validatior: {v}")

        # regex phone number
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if v and not re.search(regex, v, re.I):
            raise HTTPException(status_code=400, detail="Correo invalido.")
        return v

class LoginSchema(BaseModel):
    email: str
    password: str


class ForgotPasswordSchema(BaseModel):
    email: str
    new_password: str


class DetailSchema(BaseModel):
    status: str
    message: str
    result: Optional[T] = None


class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None
