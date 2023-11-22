"""empty message

Revision ID: f8995988a4f3
Revises: 17e7c7f66dae, d7c46d4ac87c
Create Date: 2023-11-22 16:30:53.182301

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8995988a4f3'
down_revision: Union[str, None] = ('17e7c7f66dae', 'd7c46d4ac87c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
