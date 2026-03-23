from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

# Organizational Tables
class Campus(SQLModel, table=True):
    __tablename__ = "campuses"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    address: Optional[str] = None
    is_active: bool = Field(default=True)

class College(SQLModel, table=True):
    __tablename__ = "colleges"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    campus_id: UUID = Field(foreign_key="campuses.id")

class Department(SQLModel, table=True):
    __tablename__ = "departments"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    college_id: UUID = Field(foreign_key="colleges.id")

# User Table
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    department_id: Optional[UUID] = Field(default=None, foreign_key="departments.id")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)