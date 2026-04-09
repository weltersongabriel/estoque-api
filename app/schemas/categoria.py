from pydantic import BaseModel

class CategoriaCreate(BaseModel):
    nome: str
    descricao: str | None = None

class CategoriaResponse(BaseModel):
    id: int
    nome: str
    descricao: str | None = None

class Config:
    from_attributes = True