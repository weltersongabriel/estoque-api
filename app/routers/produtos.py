from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.produto import ProdutoCreate, ProdutoResponse
from app.crud import produto as crud

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    return crud.get_produtos(db)


@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = crud.get_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrada")
    return produto

@router.post("/", response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    return crud.create_produto(db, produto)

@router.delete("/{produto_id}")
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = crud.delete_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrada")
    return {"mensagem": "Produto deletado com sucesso"}