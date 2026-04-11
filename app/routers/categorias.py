from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.categoria import CategoriaCreate, CategoriaResponse
from app.crud import categoria as crud

router = APIRouter(prefix="/categorais", tags=["Categorias"])

@router.get("/", response_model=list[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    return crud.get_categoria(db)


@router.get("/{categoria_id}", response_model=CategoriaResponse)
def buscar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = crud.get_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return categoria

@router.post("/", response_model=CategoriaResponse)
def criar_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    return crud.create_categoria(db, categoria)

@router.delete("/{categoria_id}")
def deletar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = crud.delete_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return {"mensagem": "Categoria deletada com sucesso"}