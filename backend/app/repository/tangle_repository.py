from app.repository.base_repository import BaseRepository
from app.schema import TanglePeerSchema
from app.service.tangle_service import TangleService
from app.repository.auth_repository import JWTBearer, JWTRepo
from app.schema import ResponseSchema


class TangleRespository(BaseRepository):
    model = TanglePeerSchema

    @staticmethod
    async def get_tangle():
        result = await TangleService.get_tangle()
        return ResponseSchema(detail="success", result=result)

    @staticmethod
    async def get_started_tangle_networking():
        # Create the JSON tangle if not exists
        pass

    @staticmethod
    async def get_peer_detail(index: int):
        # Get datail of a index by its index
        pass
