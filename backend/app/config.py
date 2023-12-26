from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG_DEV = os.getenv("DB_CONFIG_DEV")
DB_CONFIG_DEPLOY = os.getenv("DB_CONFIG_DEPLOY")
DB_CONFIG_DEPLOY_AZURE = os.getenv("DB_CONFIG_DEPLOY_AZURE")


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


class AsyncDatabaseSession:
    def __int__(self) -> None:
        self.session = None
        self.engine = None

    def __getattr__(self, name):
        return getattr(self.session, name)

    def init(self):
        self.engine = create_async_engine(
            DB_CONFIG_DEPLOY_AZURE, future=True, echo=True
        )
        self.session = sessionmaker(
            self.engine,
            expire_on_commit=False,
            class_=AsyncSession,
        )()

    async def create_all(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)


db = AsyncDatabaseSession()


async def commit_rollback():
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
