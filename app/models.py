from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.database import Base


class College(Base):
    __tablename__ = "colleges"
    
    college_id = Column(Integer, primary_key=True, index=True)
    college_name = Column(String(255), nullable=False)
    college_campus = Column(String(255), nullable=False)
    
    registrations = relationship("Registration", back_populates="college")


class Department(Base):
    __tablename__ = "departments"
    
    dept_id = Column(Integer, primary_key=True, index=True)
    dept_name = Column(String(255), nullable=False)
    
    registrations = relationship("Registration", back_populates="department")


class Role(Base):
    __tablename__ = "roles"
    
    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(100), nullable=False, unique=True)
    
    registrations = relationship("Registration", back_populates="role")


class Campus(Base):
    __tablename__ = "campuses"
    
    campus_id = Column(Integer, primary_key=True, index=True)
    campus_name = Column(String(255), nullable=False)
    
    registrations = relationship("Registration", back_populates="campus")


class Registration(Base):
    __tablename__ = "registrations"
    
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.college_id"), nullable=False)
    dept_id = Column(Integer, ForeignKey("departments.dept_id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    campus_id = Column(Integer, ForeignKey("campuses.campus_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    college = relationship("College", back_populates="registrations")
    department = relationship("Department", back_populates="registrations")
    role = relationship("Role", back_populates="registrations")
    campus = relationship("Campus", back_populates="registrations")


class Login(Base):
    __tablename__ = "logins"
    
    login_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("registrations.user_id"), nullable=False)
    password = Column(String(255), nullable=False)
    last_login = Column(DateTime(timezone=True), server_default=func.now())
