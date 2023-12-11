from fastapi import HTTPException, UploadFile
import logging
import re
from typing import TypeVar, Optional

from pydantic import BaseModel, validator, validate_model
from sqlalchemy import false


T = TypeVar("T")

# get root logger
logger = logging.getLogger(__name__)


class UpdateProfileSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    repeat_password: str

    @validator("repeat_password")
    def passwords_match(cls, v, values, **kwargs):
        if len(v) > 0 or len(values["password"]) > 0:
            if "password" in values and v != values["password"]:
                raise HTTPException(
                    status_code=400,
                    detail="Passwords do not match.",
                )
        return v

    @validator("password")
    # password validator
    def password_validator(cls, v, values, **kwargs):
        # Minimum length of 8 characters
        if len(v) > 0:
            if len(v) < 8:
                raise HTTPException(
                    status_code=400,
                    detail="Password must be at least 8 characters long.",
                )
            # Check for at least one uppercase letter
            if not any(char.isupper() for char in v):
                raise HTTPException(
                    status_code=400,
                    detail="Password must contain at least one uppercase letter.",
                )
            # Check for at least one lowercase letter
            if not any(char.islower() for char in v):
                raise HTTPException(
                    status_code=400,
                    detail="Password must contain at least one lowercase letter.",
                )
            # Check for at least one digit
            if not any(char.isdigit() for char in v):
                raise HTTPException(
                    status_code=400,
                    detail="Password must contain at least one digit.",
                )
            # Check for at least one special character
            if not any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>?/" for char in v):
                raise HTTPException(
                    status_code=400,
                    detail="Password must contain at least one special character.",
                )
        return v

    @validator("email")
    def email_validation(cls, v):
        logger.debug(f"email in 2 validatior: {v}")

        # regex email
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if v and not re.search(regex, v, re.I):
            raise HTTPException(status_code=400, detail="Invalid email.")
        elif len(v) == 0:
            raise HTTPException(status_code=400, detail="The email must be required.")
        return v


class RegisterSchema(BaseModel):
    first_name: str
    last_name: str
    password: str
    email: str

    @validator("first_name")
    def first_name_validator(cls, v):
        logger.debug(f"First Name validator: {v}")

        # First name validator
        if len(v) == 0:
            raise HTTPException(
                status_code=400, detail="The first name must be required."
            )
        return v

    @validator("password")
    # password validator
    def password_validator(cls, v):
        # Minimum length of 8 characters
        if len(v) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters long.",
            )

        # Check for at least one uppercase letter
        if not any(char.isupper() for char in v):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one uppercase letter.",
            )
        # Check for at least one lowercase letter
        if not any(char.islower() for char in v):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one lowercase letter.",
            )
        # Check for at least one digit
        if not any(char.isdigit() for char in v):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one digit.",
            )
        # Check for at least one special character
        if not any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>?/" for char in v):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one special character.",
            )
        return v

    @validator("email")
    def email_validation(cls, v):
        logger.debug(f"email in 2 validatior: {v}")

        # regex email
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if v and not re.search(regex, v, re.I):
            raise HTTPException(status_code=400, detail="Invalid email.")
        elif len(v) == 0:
            raise HTTPException(status_code=400, detail="The email must be required.")
        return v


class LoginSchema(BaseModel):
    email: str
    password: str


class ForgotPasswordSchema(BaseModel):
    email: str
    new_password: str


class TanglePeerSchema(BaseModel):
    index: int
    timestamp: str
    data: Optional[T] = None
    proof: int
    previous_hash: Optional[T] = None
    previous_nodes: Optional[T] = None
    next_nodes: Optional[T] = None
    validity: int
    length: int


class TangleNewTransactionSchema(BaseModel):
    sender: str
    recipient: str


class TangleGetNodeDetailsSchema(BaseModel):
    index: int


class TangleGetAllPeerTransactionsSchema(BaseModel):
    sender: str


class DetailSchema(BaseModel):
    status: str
    message: str
    result: Optional[T] = None


class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None
