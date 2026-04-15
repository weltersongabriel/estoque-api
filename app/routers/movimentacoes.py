from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.movimentacao import MovimentacaoCreate, MovimentacaoResponsse
from app.crud import movimentacao as crud

router = APIRouter(prefix="/movimentacoes", tags=["Movimentacoes"])

@router.get("/", response_model=list[MovimentacaoResponsse])
def listar_movimentacoes(db: Session = Depends(get_db)):
    return crud.get_movimentacoes(db)


@router.get("/{movimentacao_id}", response_model=MovimentacaoResponsse)
def buscar_movimentacao(movimentacao_id: int, db: Session = Depends(get_db)):
    movimentacao = crud.get_movimentacao(db, movimentacao_id)
    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentacao não encontrada")
    return movimentacao

@router.post("/", response_model=MovimentacaoResponsse)
def criar_movimentacao(movimentacao: MovimentacaoCreate, db: Session = Depends(get_db)):
    return crud.create_movimentacao(db, movimentacao)

@router.delete("/{movimentacao_id}")
def deletar_movimentacao(movimentacao_id: int, db: Session = Depends(get_db)):
    movimentacao = crud.delete_movimentacao(db, movimentacao_id)
    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentacao não encontrada")
    return {"mensagem": "Movimentacao deletada com sucesso"}