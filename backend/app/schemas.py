from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None

class UserCreate(User):
    password: str

class UserInDB(User):
    id: int
    hashed_password: str
    disabled: bool | None = None
    class Config:
        orm_mode = True