from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class Comment(BaseModel):
    text: str
    url: str
    location_on_page: str

class CommentCreate(Comment):
    pass

class CommentInDB(Comment):
    id: int
    owner_id: int
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
    comments: list[Comment] = []
    class Config:
        orm_mode = True




