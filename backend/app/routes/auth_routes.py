from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin
from app.auth import hash_password, verify_password
from app.utils.token import create_access_token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        hashed = hash_password(user.password)
        new_user = User(
            username=user.username,
            email=user.email,
            password=hashed
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created"}
    except Exception as e:
        db.rollback()
        import traceback
        error_msg = traceback.format_exc()
        print(error_msg)
        return {"error": f"Registration failed: {str(e)}"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return {"error": "User not found"}
    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid password"}
    token = create_access_token(data={"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }