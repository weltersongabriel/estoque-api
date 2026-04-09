from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class Movimentacao(Base):
    __tablename__ = "movimentacoes"

    id = Column (Integer, primary_key=True, index=False)
    produto_id = Column(Integer, nullable=False)
    tipo = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)
    motivo = Column(String, nullable=True)
    criado_em = Column(DateTime, default=datetime.now)