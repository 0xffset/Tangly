import uvicorn
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.config import db
from app.service.auth_service import generate_status_transactions

origins = ["http://localhost:3000"]


def init_app():
    db.init()
    app = FastAPI(title="Tangly", description="PoC Tangle Networking", version="1")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup():
        await db.create_all()
        await generate_status_transactions()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()

    from app.controller import authentication, users

    app.include_router(authentication.router)
    app.include_router(users.router)

    return app


app = init_app()


def start():
    """Launched with 'poetry run start' at root level"""
    uvicorn.run("app.main:app", host="localhost", port=4444, reload=True)