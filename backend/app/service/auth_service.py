import base64
from datetime import datetime
from uuid import uuid4
from fastapi import HTTPException
import requests
from passlib.context import CryptContext
from app.schema import RegisterSchema
from app.model import Users, StatusTransactions
from app.repository.users import UsersRepository
from app.repository.status_transactions_repository import StatusTransactionsReposity
from app.schema import LoginSchema, ForgotPasswordSchema
from app.repository.auth_repository import JWTRepo


# Encrypt password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    async def register_service(register: RegisterSchema):
        # Create uuid
        _users_id = str(uuid4())

        # create a random profile picture
        response_random_image = requests.get(f"https://robohash.org/{register.email}")
        base64_encoded = base64.b64encode(response_random_image.content)
        base64_string = base64_encoded.decode("utf-8")
        # open image profile default to bas64 string
        image_str = "data:image/png;base64," + base64_string
        # mapping request data to class entity table

        _users = Users(
            id=_users_id,
            first_name=register.first_name,
            last_name=register.last_name,
            email=register.email,
            password=pwd_context.hash(register.password),
            image=image_str,
        )

        # Cheking the same email
        _email = await UsersRepository.find_by_email(register.email)
        if _email:
            raise HTTPException(status_code=400, detail="Email already taken")

        else:
            #  insert to tables
            await UsersRepository.create(**_users.dict())

    @staticmethod
    async def logins_service(login: LoginSchema):
        _user = await UsersRepository.find_by_email(login.email)

        if _user is not None:
            if not pwd_context.verify(login.password, _user.password):
                raise HTTPException(status_code=400, detail="Invalid password")
            return JWTRepo(data={"email": _user.email,"id": _user.id}).generate_token()
        raise HTTPException(status_code=404, detail="User not found")

    @staticmethod
    async def forgot_password_service(forgot_password: ForgotPasswordSchema):
        _email = await UsersRepository.find_by_email(forgot_password.email)
        if _email is None:
            raise HTTPException(status_code=404, detail="Email not found")
        await UsersRepository.update_password(
            forgot_password.email, pwd_context.hash(forgot_password.new_password)
        )


"""
Generate the status transactions
"""


async def generate_status_transactions():
    _status = await StatusTransactionsReposity.find_status_transations([101, 202, 303])
    if not _status:
        await StatusTransactionsReposity.create_list(
            [
                StatusTransactions(
                    id=str(1), status_code=101, status_message="Aceptada"
                ),
                StatusTransactions(
                    id=str(2), status_code=202, status_message="En proceso"
                ),
                StatusTransactions(
                    id=str(3), status_code=303, status_message="Rechazada"
                ),
            ]
        )
