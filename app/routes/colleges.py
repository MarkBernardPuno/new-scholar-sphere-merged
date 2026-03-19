from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app import models, schemas

router = APIRouter(prefix="/colleges", tags=["Colleges"])


@router.post("/", response_model=schemas.College)
def create_college(college: schemas.CollegeCreate, db: Session = Depends(get_db)):
    """Create a new college"""
    db_college = models.College(**college.dict())
    db.add(db_college)
    db.commit()
    db.refresh(db_college)
    return db_college


@router.get("/", response_model=List[schemas.College])
def read_colleges(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all colleges with pagination"""
    colleges = db.query(models.College).offset(skip).limit(limit).all()
    return colleges


@router.get("/{college_id}", response_model=schemas.College)
def read_college(college_id: int, db: Session = Depends(get_db)):
    """Get a specific college by ID"""
    college = db.query(models.College).filter(models.College.college_id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    return college


@router.put("/{college_id}", response_model=schemas.College)
def update_college(college_id: int, college: schemas.CollegeUpdate, db: Session = Depends(get_db)):
    """Update a college"""
    db_college = db.query(models.College).filter(models.College.college_id == college_id).first()
    if not db_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    update_data = college.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_college, key, value)
    
    db.commit()
    db.refresh(db_college)
    return db_college


@router.delete("/{college_id}", status_code=204)
def delete_college(college_id: int, db: Session = Depends(get_db)):
    """Delete a college"""
    db_college = db.query(models.College).filter(models.College.college_id == college_id).first()
    if not db_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    db.delete(db_college)
    db.commit()
    return None
