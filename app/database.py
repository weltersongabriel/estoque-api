from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL='sqlite:///./database.db'

# criar conexão com o banco de dados
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # necessário para SQLite
)

# criar sessao de banco
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para os modelos (tabelas)
Base = declarative_base()

# Dependency (usado no FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()