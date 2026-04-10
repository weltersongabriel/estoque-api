from sqlalchemy.orm import Session
from app.models.produtos import Produto #app.models.produto
from app.schemas.produto import ProdutoCreate

def get_produtos(db: Session):
    return db.query(Produto).all()

def get_produto(db: Session, produto_id: int):
    return db.query(Produto).filter(Produto.id == produto_id).first()

def create_produto(db: Session, produto: ProdutoCreate):
    novo = Produto(**produto.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def delete_produto(db: Session, produto_id: int):
    produto = get_produto(db, produto_id)
    if produto:
        db.delete(produto)
        db.commit()
    return produto