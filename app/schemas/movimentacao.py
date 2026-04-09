from datetime import datetime
from pydantic import BaseModel

class MovimentacaoCreate(BaseModel):
    produto_id: int
    tipo: str
    quantidade: int
    motivo: str | None = None

class MovimentacaoResponsse(BaseModel):
    id: int
    produto_id: int
    tipo: str
    quantidade: int
    motivo: str | None = None
    criado_em: datetime


class Config:
    from_attributes = True