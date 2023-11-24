from fastapi import APIRouter, Depends, Security

from app.schema import ResponseSchema, RegisterSchema, LoginSchema, ForgotPasswordSchema
from app.repository.auth_repository import JWTBearer, JWTRepo
from fastapi.security import HTTPAuthorizationCredentials
from app.service.users_service import UserService

router = APIRouter(prefix="/users", tags=["user"], dependencies=[Depends(JWTBearer())])


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_user_profile(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    token = JWTRepo.extract_token(credentials)
    result = await UserService.get_user_profile(token["email"])
    return ResponseSchema(detail="success", result=result)


@router.get(
    "/all", response_model=ResponseSchema, response_model_exclude_none=True
)
async def get_all_users(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    token = JWTRepo.extract_token(credentials)
    result = await UserService.get_all_users(token["id"])
    return ResponseSchema(detail="success", result=result)
