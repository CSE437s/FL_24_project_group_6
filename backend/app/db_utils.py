from sqlalchemy.orm import Session
from passlib.context import CryptContext


from . import models, schemas

## user utils

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

## Comment utils
def create_user_comment(db: Session, comment: schemas.CommentCreate, user_id: int):
    db_comment = models.Comment(**comment.model_dump(), owner_id=user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_user_comments(db: Session, user_id: int):
    comments_with_username = db.query(models.Comment, models.User.username)\
             .join(models.User, models.Comment.owner_id == models.User.id)\
             .filter(models.Comment.owner_id == user_id).all()
    joined_comments = []
    for comment, username in comments_with_username:
        joined_comments.append( schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            username=username
        ))
    return joined_comments

def get_comments_by_url(db: Session, url: str):
    comments_with_username = db.query(models.Comment, models.User.username)\
             .join(models.User, models.Comment.owner_id == models.User.id)\
             .filter(models.Comment.url == url).all()
    joined_comments = []
    for comment, username in comments_with_username:
        joined_comments.append( schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            username=username
        ))
    return joined_comments

def update_password(db: Session, user: models.User, new_password: str):
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user