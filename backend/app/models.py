from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    disabled = Column(Boolean, default=False)

    comments = relationship("Comment", back_populates="owner")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    text = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, index=True)
    location_on_page = Column(String, index=True)

    owner = relationship("User", back_populates="comments")