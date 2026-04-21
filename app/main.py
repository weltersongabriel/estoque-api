from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import categorias, produtos, movimentacoes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Estoque API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categorias.router, prefix="/api")
app.include_router(produtos.router, prefix="/api")
app.include_router(movimentacoes.router, prefix="/api")

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")