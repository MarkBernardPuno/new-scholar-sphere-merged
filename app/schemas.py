from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# College Schemas
class CollegeBase(BaseModel):
    college_name: str
    college_campus: str


class CollegeCreate(CollegeBase):
    pass


class CollegeUpdate(BaseModel):
    college_name: Optional[str] = None
    college_campus: Optional[str] = None


class College(CollegeBase):
    college_id: int
    
    class Config:
        from_attributes = True


# Department Schemas
class DepartmentBase(BaseModel):
    dept_name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    dept_name: Optional[str] = None


class Department(DepartmentBase):
    dept_id: int
    
    class Config:
        from_attributes = True


# Role Schemas
class RoleBase(BaseModel):
    role_name: str


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    role_name: Optional[str] = None


class Role(RoleBase):
    role_id: int
    
    class Config:
        from_attributes = True


# Campus Schemas
class CampusBase(BaseModel):
    campus_name: str


class CampusCreate(CampusBase):
    pass


class CampusUpdate(BaseModel):
    campus_name: Optional[str] = None


class Campus(CampusBase):
    campus_id: int
    
    class Config:
        from_attributes = True


# Registration Schemas
class RegistrationBase(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    college_id: int
    dept_id: int
    role_id: int
    campus_id: int


class RegistrationCreate(RegistrationBase):
    pass


class RegistrationUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    college_id: Optional[int] = None
    dept_id: Optional[int] = None
    role_id: Optional[int] = None
    campus_id: Optional[int] = None


class RegistrationResponse(RegistrationBase):
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Login Schemas
class LoginBase(BaseModel):
    user_id: int
    password: str


class LoginCreate(LoginBase):
    pass


class LoginResponse(BaseModel):
    login_id: int
    user_id: int
    last_login: datetime
    
    class Config:
        from_attributes = True
