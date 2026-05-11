from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    commit_hash = Column(String, index=True)
    commit_message = Column(Text)
    author = Column(String)
    documentation = Column(Text)
    markdown_path = Column(String)
    pdf_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
