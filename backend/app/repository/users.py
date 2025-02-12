from multiprocessing import synchronize
from sqlalchemy import update as sql_update
from sqlalchemy.future import select
from app.config import db, commit_rollback
from app.model.users import Users
from app.repository.base_repository import BaseRepository


class UsersRepository(BaseRepository):
    model = Users

    @staticmethod
    async def find_by_email(email: str):
        query = select(Users).where(Users.email == email)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def find_by_id(id: str):
        query = select(Users).where(Users.id == id)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def update_password(email: str, password: str):
        query = (
            sql_update(Users)
            .where(Users.email == email)
            .values(password=password)
            .execution_options(synchronize_session="fetch")
        )
        await db.execute(query)
        await commit_rollback()
