from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr


class Config:
    from_attributes = True


class AnalyzeRequest(BaseModel):

    project_path: str
