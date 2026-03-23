from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr

from app.database import create_db_and_tables, get_session
from app.models import User
from app.security import hash_password, verify_password, create_access_token
from fastapi.middleware.cors import CORSMiddleware # 1. Import it

app = FastAPI(title="TIP ScholarSphere API")

# 2. Add the Middleware RIGHT HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    department_id: Optional[UUID] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Startup ---
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- Registration ---
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_data.email)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        department_id=user_data.department_id
    )
    session.add(new_user)
    session.commit()
    return {"message": "User created successfully"}

# --- Login ---
@app.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == data.email)
    user = session.exec(statement).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"message": "Welcome to TIP ScholarSphere API"}