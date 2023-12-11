from sqlalchemy.future import select
from app.model import Users
from app.config import db
from app.schema import UpdateProfileSchema
from passlib.context import CryptContext
from app.repository.users import UsersRepository
from fastapi import HTTPException, UploadFile


# Encrypt password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    @staticmethod
    async def get_user_profile(id: str):
        query = select(
            Users.first_name, Users.last_name, Users.email, Users.image
        ).where(Users.id == id)

        return (await db.execute(query)).mappings().one()

    @staticmethod
    async def get_all_users(id: str):
        query = select(
            Users.id, Users.first_name, Users.last_name, Users.image, Users.email
        ).where(Users.id != id)
        return (await db.execute(query)).mappings().all()

    @staticmethod
    async def update_profile_users(id: str, update: UpdateProfileSchema):
        # Checking if the password is empty. If it empty, do not change the password. 
        _users = Users()
        if (update.password == "" or len(update.password)  == 0):
            _users = Users(
                id=id,
                first_name=update.first_name,
                last_name=update.last_name,
                email=update.email
            )
        else:
            _users = Users(
                id=id,
                first_name=update.first_name,
                last_name=update.last_name,
                email=update.email,
                password=pwd_context.hash(update.password),
            )
        # Checking if the user exists
        _user = await UsersRepository.find_by_id(id)
        if _user is None:
            raise HTTPException(status_code=400, detail="User not found.")
        else:
            await UsersRepository.update(id, **_users.dict())
