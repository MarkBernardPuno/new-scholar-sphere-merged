from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app import models, schemas

router = APIRouter(prefix="/logins", tags=["Logins"])


@router.post("/", response_model=schemas.LoginResponse)
def create_login(login: schemas.LoginCreate, db: Session = Depends(get_db)):
    """Record a user login"""
    # Verify user exists
    user = db.query(models.Registration).filter(models.Registration.user_id == login.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_login = models.Login(**login.dict())
    db.add(db_login)
    db.commit()
    db.refresh(db_login)
    return db_login


@router.get("/", response_model=List[schemas.LoginResponse])
def read_logins(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all logins with pagination"""
    logins = db.query(models.Login).offset(skip).limit(limit).all()
    return logins


@router.get("/{login_id}", response_model=schemas.LoginResponse)
def read_login(login_id: int, db: Session = Depends(get_db)):
    """Get a specific login by ID"""
    login = db.query(models.Login).filter(models.Login.login_id == login_id).first()
    if not login:
        raise HTTPException(status_code=404, detail="Login record not found")
    return login


@router.delete("/{login_id}", status_code=204)
def delete_login(login_id: int, db: Session = Depends(get_db)):
    """Delete a login record"""
    db_login = db.query(models.Login).filter(models.Login.login_id == login_id).first()
    if not db_login:
        raise HTTPException(status_code=404, detail="Login record not found")
    
    db.delete(db_login)
    db.commit()
    return None
