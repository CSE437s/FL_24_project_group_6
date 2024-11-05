from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, DateTime, func
from sqlalchemy.orm import relationship

from .database import Base


# Association table to represent the many-to-many "friends" relationship
followers_association = Table(
    "followers_association",
    Base.metadata,
    Column("follower_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("followee_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    disabled = Column(Boolean, default=False)

    comments = relationship("Comment", back_populates="owner")

        # Define self-referential relationship for friends
    followers = relationship(
        "User",
        secondary=followers_association,
        primaryjoin=id == followers_association.c.followee_id,
        secondaryjoin=id == followers_association.c.follower_id,
        backref="following",
    )

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    text = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, index=True)
    css_selector = Column(String)
    selected_text = Column(String)
    text_offset_start = Column(Integer)
    text_offset_end = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())



    owner = relationship("User", back_populates="comments")