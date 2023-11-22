"""empty message

Revision ID: 49d3bb714e82
Revises: f8995988a4f3
Create Date: 2023-11-22 16:31:02.995075

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49d3bb714e82'
down_revision: Union[str, None] = 'f8995988a4f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
