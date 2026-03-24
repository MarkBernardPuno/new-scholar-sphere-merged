from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.orm import sessionmaker

# Change 'postgres' and 'your_password' to your actual PostgreSQL credentials
DATABASE_URL = "postgresql://postgres:pass123@localhost:5432/tip_scholarsphere_db"

# The engine is the "bridge" to your DB
engine = create_engine(DATABASE_URL, echo=True)

# This function provides a database session for every request
def get_session():
    with Session(engine) as session:
        yield session

# This function will create the tables based on your models
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)