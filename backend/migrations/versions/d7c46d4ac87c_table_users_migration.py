"""Table Users Migration

Revision ID: d7c46d4ac87c
Revises: 55ab6e1e9f99
Create Date: 2023-11-22 15:26:25.433972

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd7c46d4ac87c'
down_revision: Union[str, None] = '55ab6e1e9f99'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
