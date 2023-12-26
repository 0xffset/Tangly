from fastapi import APIRouter, Depends, Security, UploadFile
from jose import ExpiredSignatureError
from app.tangle.tangle import Tangle
from app.schema import (
    ResponseSchema,
    TangleGetNodeDetailsSchema,
    TangleGetAllPeerTransactionsSchema,
    TangleNewTransactionSchema,
)
from app.repository.auth_repository import JWTBearer, JWTRepo
from fastapi.security import HTTPAuthorizationCredentials
from app.service.tangle_service import TangleService

router = APIRouter(
    prefix="/tangle", tags=["tangle"], dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_tangle():
    try:
        tangle = TangleService()
        result = await tangle.get_tangle()
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to the the tangle"}
        )


@router.get("/nodes", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_nodes():
    try:
        tangle = TangleService()
        result = await tangle.get_nodes()
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(detail="error", result={"error": "Unable to the nodes"})


@router.get("/peers", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_peers():
    try:
        tangle = TangleService()
        result = await tangle.get_peers()
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get ther peers"}
        )


@router.post("/peers/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_all_transactions_by_peer(
    request_body: TangleGetAllPeerTransactionsSchema,
):
    try:
        tangle = TangleService()
        result = await tangle.get_all_transactions_by_sender(request_body.sender)
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to the all user transactions"}
        )


@router.get(
    "/transactions/peers",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def get_all_transactions_by_id(
    crendentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(crendentials)
        tangle = TangleService()
        result = await tangle.get_all_files_by_id(token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error",
            result={"error": "Unable to get all authenticate user transactions"},
        )


@router.get(
    "/transaction/user", response_model=ResponseSchema, response_model_exclude_none=True
)
async def get_all_transactions_by_user_logged(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(credentials)
        result = await TangleService.get_five_most_recent_transactions_user(token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get all transactions logged"}
        )


@router.get(
    "/transcation/user/all",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def get_all_transactions(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(credentials)
        tangle = TangleService()
        result = await tangle.get_all_user_transactions(token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error", "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get all transactions"}
        )


@router.post(
    "/transaction/new", response_model=ResponseSchema, response_model_exclude_none=True
)
async def new_transaction(
    file: UploadFile,
    recipient,
    creds: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(creds)
        tangle = TangleService()
        tangle.resolve_conflicts()
        result = await tangle.make_new_transaction(token["id"], recipient, file)
        return ResponseSchema(detail="success", result={"success": result})
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to the send transaction"}
        )


@router.post(
    "/transaction/decrypt",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def decrypt_file_by_signature(
    signature, creds: HTTPAuthorizationCredentials = Security(JWTBearer())
):
    try:
        token = JWTRepo.extract_token(creds)
        tangle = TangleService()
        result = await tangle.decrypt_file_by_signature(signature, token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to decrypt file"}
        )


@router.get(
    "/transactions/graph",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def get_graph(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(credentials)
        tangle = TangleService()
        result = await tangle.get_graphs(token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(detail="error", result={"error": "Unable to graph"})


@router.get(
    "/transaction/statistics",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def get_statistics_by_user(
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(credentials)
        tangle = TangleService()
        result = await tangle.get_user_statistics(token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get user statistics"}
        )


@router.post(
    "/nodes/details", response_model=ResponseSchema, response_model_exclude_none=True
)
async def get_node_details(request_body: TangleGetNodeDetailsSchema):
    try:
        tangle = TangleService()
        result = await tangle.get_node_detail(request_body.index)
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get node details"}
        )


@router.post(
    "/transactions/file/details",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
)
async def get_file_detail(
    request_body: TangleGetNodeDetailsSchema,
    credentials: HTTPAuthorizationCredentials = Security(JWTBearer()),
):
    try:
        token = JWTRepo.extract_token(credentials)
        tangle = TangleService()
        result = await tangle.get_file_detail(request_body.index, token["id"])
        return ResponseSchema(detail="success", result=result)
    except ExpiredSignatureError:
        return ResponseSchema(
            detail="error", result={"error": "Token has been expired"}
        )
    except:
        return ResponseSchema(
            detail="error", result={"error": "Unable to get file details"}
        )
