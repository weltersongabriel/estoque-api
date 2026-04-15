from fastapi import FastAPI
from app.database import engine, Base
from app.routers import categorias, produtos, movimentacoes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Estoque API")

app.include_router(categorias.router)
app.include_router(produtos.router)
app.include_router(movimentacoes.router)