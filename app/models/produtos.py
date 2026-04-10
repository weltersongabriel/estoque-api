from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    sku = Column(String, nullable=False, unique=True)
    preco_custo = Column(Float, nullable=False)
    quantidade = Column(Integer, nullable=False, default=0)
    estoque_min = Column(Integer, default=0)
    categoria_id = Column(Integer, nullable=False)