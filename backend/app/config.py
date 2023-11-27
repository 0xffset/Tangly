from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

DB_CONFIG_DEV = f"postgresql+asyncpg://postgres:3301:postgres@localhost:5433/tangly"
DB_CONFIG_DEPLOY = f"postgresql+asyncpg://ringxqzpvehcke:cb2658792e66350418be840699a481ed9dc15fe04d8c9dfb55fc6b89ac2ce1da@ec2-3-210-173-88.compute-1.amazonaws.com:5432/d20o9huq2ra7ja"

SECRET_KEY = "hHQE8&R<+lbQ:y}"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXIPIRE_MINUTES = 10080


class AsyncDatabaseSession:
    def __int__(self) -> None:
        self.session = None
        self.engine = None

    def __getattr__(self, name):
        return getattr(self.session, name)

    def init(self):
        self.engine = create_async_engine(DB_CONFIG_DEPLOY, future=True, echo=True)
        self.session = sessionmaker(
            self.engine, expire_on_commit=False, class_=AsyncSession
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
