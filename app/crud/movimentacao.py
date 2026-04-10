from sqlalchemy.orm import Session
from app.models.movimentacao import Movimentacao
from app.schemas.movimentacao import MovimentacaoCreate

def get_movimentacoes(db: Session):
    return db.query(Movimentacao).all()

def get_movimentacao(db: Session, movimentacao_id: int):
    return db.query(Movimentacao).filter(Movimentacao.id == movimentacao_id).first()

def create_movimentacao(db: Session, movimentacao: MovimentacaoCreate):
    nova = Movimentacao(**movimentacao.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

def delete_movimentacao(db: Session, movimentacao_id: int):
    movimentacao = get_movimentacao(db, movimentacao_id)
    if movimentacao:
        db.delete(movimentacao)
        db.commit()
    return movimentacao