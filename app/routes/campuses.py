from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app import models, schemas

router = APIRouter(prefix="/campuses", tags=["Campuses"])


@router.post("/", response_model=schemas.Campus)
def create_campus(campus: schemas.CampusCreate, db: Session = Depends(get_db)):
    """Create a new campus"""
    db_campus = models.Campus(**campus.dict())
    db.add(db_campus)
    db.commit()
    db.refresh(db_campus)
    return db_campus


@router.get("/", response_model=List[schemas.Campus])
def read_campuses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all campuses with pagination"""
    campuses = db.query(models.Campus).offset(skip).limit(limit).all()
    return campuses


@router.get("/{campus_id}", response_model=schemas.Campus)
def read_campus(campus_id: int, db: Session = Depends(get_db)):
    """Get a specific campus by ID"""
    campus = db.query(models.Campus).filter(models.Campus.campus_id == campus_id).first()
    if not campus:
        raise HTTPException(status_code=404, detail="Campus not found")
    return campus


@router.put("/{campus_id}", response_model=schemas.Campus)
def update_campus(campus_id: int, campus: schemas.CampusUpdate, db: Session = Depends(get_db)):
    """Update a campus"""
    db_campus = db.query(models.Campus).filter(models.Campus.campus_id == campus_id).first()
    if not db_campus:
        raise HTTPException(status_code=404, detail="Campus not found")
    
    update_data = campus.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campus, key, value)
    
    db.commit()
    db.refresh(db_campus)
    return db_campus


@router.delete("/{campus_id}", status_code=204)
def delete_campus(campus_id: int, db: Session = Depends(get_db)):
    """Delete a campus"""
    db_campus = db.query(models.Campus).filter(models.Campus.campus_id == campus_id).first()
    if not db_campus:
        raise HTTPException(status_code=404, detail="Campus not found")
    
    db.delete(db_campus)
    db.commit()
    return None
