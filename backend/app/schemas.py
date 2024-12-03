from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime



class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class Comment(BaseModel):
    text: str
    url: str
    css_selector: str
    selected_text: str
    text_offset_start: int
    text_offset_end: int

class CommentCreate(Comment):
    pass

class CommentEdit(BaseModel):
    text: str

class CommentInDB(Comment):
    id: int
    owner_id: int
    created_at: datetime 
    class Config:
        orm_mode = True

class User(BaseModel):
    username: str
    email: str | None = None

class UserCreate(User):
    password: str

class UserInDB(User):
    id: int
    hashed_password: str
    disabled: bool | None = None
    comments: List[Comment] = []
    followers: List["User"] = []       # Users following this user
    following: List["User"] = []       # Users this user is following

    class Config:
        orm_mode = True

class PasswordResetRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    email: str
    token: str
    new_password: str

class CommentWithUserName(CommentInDB):
    username: str



