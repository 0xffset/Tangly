from sqlalchemy.future import select
from app.model import Users
from app.config import db


class UserService:
    @staticmethod
    async def get_user_profile(email: str):
        query = select(
            Users.first_name, Users.last_name, Users.email, Users.image
        ).where(Users.email == email)

        return (await db.execute(query)).mappings().one()
