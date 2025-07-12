#requirements.txt 
"""
fastapi==0.111.*
uvicorn[standard]==0.30.*
SQLAlchemy==2.0.*
asyncpg==0.29.*             # swap for aiosqlite if using SQLite
pydantic[email]==2.*
python-jose[cryptography]==3.*
passlib[bcrypt]==1.7.*
alembic==1.13.*
aiosmtplib==3.0.*
"""

#Dockerfile 
"""
FROM python:3.12-slim as base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

#app/__init__.py 

#(empty file to mark package)

#app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Security
    SECRET_KEY: str = "change-me-super-secret"
    ACCESS_TOKEN_EXPIRE: int = 60 * 24  # 1 day in minutes

    # Database
    POSTGRES_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/stackit"

settings = Settings()

#app/core/security.py 
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Optional
from app.core.config import settings

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)


def create_access_token(sub: str, expires: int = settings.ACCESS_TOKEN_EXPIRE):
    exp = datetime.utcnow() + timedelta(minutes=expires)
    return jwt.encode({"sub": sub, "exp": exp}, settings.SECRET_KEY, algorithm="HS256")


def parse_token(token: str) -> Optional[str]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"]) ["sub"]
    except JWTError:
        return None


#app/db/base.py 
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from contextlib import asynccontextmanager
from app.core.config import settings

engine = create_async_engine(settings.POSTGRES_URL, echo=False)
SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

@asynccontextmanager
after_session = asynccontextmanager

def get_db():
    async def _get_db():
        async with SessionLocal() as session:
            yield session
    return _get_db

#app/db/seed.py
import asyncio
from sqlalchemy import insert
from app.db.base import engine
from app.models.user import User
from app.core.security import hash_password

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(insert(User).values([
            {"username": "admin", "email": "admin@example.com", "hashed_password": hash_password("admin"), "role": "ADMIN"}
        ]))

if __name__ == "__main__":
    asyncio.run(seed())

#app/models/user.py
from sqlalchemy import String, Integer, Enum, Column
from sqlalchemy.orm import relationship, Mapped, mapped_column
from enum import Enum as PyEnum
from app.db.base import Base

class Role(PyEnum):
    GUEST = "GUEST"
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.USER)

    questions = relationship("Question", back_populates="author")
    answers = relationship("Answer", back_populates="author")

#app/models/question.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base

question_tags = Table(
    "question_tags",
    Base.metadata,
    Column("question_id", ForeignKey("questions.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)

class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(140))
    body: Mapped[str] = mapped_column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all,delete")
    tags = relationship("Tag", secondary=question_tags, back_populates="questions")

#app/models/answer.py
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base

class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column(Text)
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))

    author = relationship("User", back_populates="answers")
    question = relationship("Question", back_populates="answers")

#app/models/tag.py
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    questions = relationship("Question", secondary="question_tags", back_populates="tags")

#app/models/vote.py
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (UniqueConstraint("user_id", "question_id", name="uq_user_question"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    value: Mapped[int] = mapped_column(Integer)  # +1 or -1

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))

    voter = relationship("User")
    question = relationship("Question", back_populates="votes")

#app/schemas/token.py
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

#app/schemas/user.py
from pydantic import BaseModel, EmailStr
from enum import Enum

class Role(str, Enum):
    GUEST = "GUEST"
    USER = "USER"
    ADMIN = "ADMIN"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Role

    class Config:
        orm_mode = True

#app/schemas/question.py
from pydantic import BaseModel
from typing import list, Optional

class QuestionCreate(BaseModel):
    title: str
    body: str
    tags: list[str] = []

class QuestionOut(BaseModel):
    id: int
    title: str
    body: str
    author_id: int
    tags: list[str] = []

    class Config:
        orm_mode = True

#app/schemas/answer.py
from pydantic import BaseModel

class AnswerCreate(BaseModel):
    body: str

class AnswerOut(BaseModel):
    id: int
    body: str
    accepted: bool
    author_id: int
    question_id: int

    class Config:
        orm_mode = True

#app/routers/auth.py 
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, parse_token
from app.schemas.token import Token

router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(User).where(User.username == form.username))
    user = q.scalar_one_or_none()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    sub = parse_token(token)
    if not sub:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    q = await db.execute(select(User).where(User.id == int(sub)))
    user = q.scalar_one_or
