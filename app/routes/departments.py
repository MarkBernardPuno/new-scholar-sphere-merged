from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app import models, schemas

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("/", response_model=schemas.Department)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    """Create a new department"""
    db_dept = models.Department(**department.dict())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept


@router.get("/", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all departments with pagination"""
    departments = db.query(models.Department).offset(skip).limit(limit).all()
    return departments


@router.get("/{dept_id}", response_model=schemas.Department)
def read_department(dept_id: int, db: Session = Depends(get_db)):
    """Get a specific department by ID"""
    department = db.query(models.Department).filter(models.Department.dept_id == dept_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department


@router.put("/{dept_id}", response_model=schemas.Department)
def update_department(dept_id: int, department: schemas.DepartmentUpdate, db: Session = Depends(get_db)):
    """Update a department"""
    db_dept = db.query(models.Department).filter(models.Department.dept_id == dept_id).first()
    if not db_dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    update_data = department.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_dept, key, value)
    
    db.commit()
    db.refresh(db_dept)
    return db_dept


@router.delete("/{dept_id}", status_code=204)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    """Delete a department"""
    db_dept = db.query(models.Department).filter(models.Department.dept_id == dept_id).first()
    if not db_dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    db.delete(db_dept)
    db.commit()
    return None
