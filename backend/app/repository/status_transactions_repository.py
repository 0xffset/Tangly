from typing import List
from sqlalchemy.future import select

from app.config import db, commit_rollback
from app.model.status_transactions import StatusTransactions
from app.repository.base_repository import BaseRepository


class StatusTransactionsReposity(BaseRepository):
    model = StatusTransactions

    @staticmethod
    async def find_status_transations(status_transaction: List[int]):
        query = select(StatusTransactions).where(
            StatusTransactions.status_code.in_(status_transaction)
        )
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def create_list(status_transations: List[StatusTransactions]):
        db.add_all(status_transations)
        await commit_rollback()
