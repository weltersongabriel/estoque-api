from pydantic import BaseModel

class ProdutoCreate(BaseModel):
    nome: str
    sku: str
    preco_custo: float
    quantidade: int
    estoque_min: int
    categoria_id: int

class ProdutoResponsse(BaseModel):
    id: int
    nome: str
    sku: str
    preco_unitario: float
    quantidade: int
    estoque_min: int
    categoria_id: int


class Config:
    from_attributes = True