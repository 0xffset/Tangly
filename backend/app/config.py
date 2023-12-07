from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

DB_CONFIG_DEV = f"postgresql+asyncpg://postgres:3301:postgres@localhost:5433/tangly"
DB_CONFIG_DEPLOY = f"postgresql+asyncpg://csacrdydphgnpr:f28fe4c8a0029d8ddca59cb922176a3d5c7610a1325f5b4776180586b9e11e52@ec2-44-213-228-107.compute-1.amazonaws.com:5432/ddn84o9rkbqlha"
DB_CONFIG_DEPLOY_AZURE = f"postgresql+asyncpg://tangly:OvBOUB1jZ%Ixr^dU@tangly-db.postgres.database.azure.com:5432/postgres"



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
        self.engine = create_async_engine(DB_CONFIG_DEPLOY_AZURE, future=True, echo=True)
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
