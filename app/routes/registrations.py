from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app import models, schemas

router = APIRouter(prefix="/registrations", tags=["Registrations"])


@router.post("/", response_model=schemas.RegistrationResponse)
def create_registration(registration: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    """Create a new user registration"""
    # Check if email already exists
    existing_user = db.query(models.Registration).filter(models.Registration.email == registration.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_registration = models.Registration(**registration.dict())
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    return db_registration


@router.get("/", response_model=List[schemas.RegistrationResponse])
def read_registrations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all registrations with pagination"""
    registrations = db.query(models.Registration).offset(skip).limit(limit).all()
    return registrations


@router.get("/{user_id}", response_model=schemas.RegistrationResponse)
def read_registration(user_id: int, db: Session = Depends(get_db)):
    """Get a specific registration by user ID"""
    registration = db.query(models.Registration).filter(models.Registration.user_id == user_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="User not found")
    return registration


@router.put("/{user_id}", response_model=schemas.RegistrationResponse)
def update_registration(user_id: int, registration: schemas.RegistrationUpdate, db: Session = Depends(get_db)):
    """Update a user registration"""
    db_registration = db.query(models.Registration).filter(models.Registration.user_id == user_id).first()
    if not db_registration:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if new email already exists (if email is being updated)
    if registration.email and registration.email != db_registration.email:
        existing_user = db.query(models.Registration).filter(models.Registration.email == registration.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    update_data = registration.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_registration, key, value)
    
    db.commit()
    db.refresh(db_registration)
    return db_registration


@router.delete("/{user_id}", status_code=204)
def delete_registration(user_id: int, db: Session = Depends(get_db)):
    """Delete a user registration"""
    db_registration = db.query(models.Registration).filter(models.Registration.user_id == user_id).first()
    if not db_registration:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_registration)
    db.commit()
    return None
