from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy import and_
from enum import Enum
from fastapi import HTTPException, status

import models, schemas

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

def delete_comment(db: Session, comment_id: int, user_id: int):
    # Retrieve the comment by ID
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    
    # Check if the comment exists
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    # Check if the user owns the comment
    if comment.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")
    
    # Delete the comment
    db.delete(comment)
    db.commit()
    
    return {"message": "Comment deleted successfully"}

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
            created_at=comment.created_at,
            owner_id=comment.owner_id,
            username=username
        ))
    return joined_comments


def get_all_url_comments(db: Session, url: str):
    comments_with_username = db.query(models.Comment, models.User.username)\
             .join(models.User, models.Comment.owner_id == models.User.id)\
             .filter(models.Comment.url == url).all()
    return [
        schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            created_at=comment.created_at,
            owner_id=comment.owner_id,
            username=username
        )
        for comment, username in comments_with_username
    ]

def get_self_url_comments(db: Session, url: str, user_id: int):
    comments_with_username = db.query(models.Comment, models.User.username)\
             .join(models.User, models.Comment.owner_id == models.User.id)\
             .filter(models.Comment.url == url, models.Comment.owner_id == user_id).all()
    return [
        schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            created_at=comment.created_at,
            owner_id=comment.owner_id,
            username=username
        )
        for comment, username in comments_with_username
    ]

def get_self_and_following_url_comments(db: Session, url: str, user_id: int):
    followers = get_following(db=db, user_id=user_id)
    follower_ids = [user.id for user in followers]
    print(follower_ids)
    comments_with_username = db.query(models.Comment, models.User.username)\
             .join(models.User, models.Comment.owner_id == models.User.id)\
             .filter(models.Comment.url == url, models.Comment.owner_id.in_(follower_ids)).all()
    return [
        schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            created_at=comment.created_at,
            owner_id=comment.owner_id,
            username=username
        )
        for comment, username in comments_with_username
    ]



def update_password(db: Session, user: models.User, new_password: str):
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user

# Follower utilities

def get_followers(db: Session, user_id: int):
    """Get all followers of a user."""
    return db.query(models.User).filter(models.User.id.in_(
        db.query(models.followers_association.c.follower_id)
          .filter(models.followers_association.c.followee_id == user_id)
    )).all()

def follow_user_by_username(db: Session, follower_id: int, followee_username: str):
    """Follow a user by their username."""
    user = get_user_by_username(db=db, username=followee_username)
    if not user: 
        raise HTTPException(status_code=400, detail="User does not exist")
    follow_user(db=db, follower_id=follower_id, followee_id=user.id)

def follow_user(db: Session, follower_id: int, followee_id: int):
    """Follow a user."""
    if follower_id == followee_id:
        return None  # Prevent self-following

    # Check if already following
    if db.query(models.followers_association).filter(
        and_(
            models.followers_association.c.follower_id == follower_id,
            models.followers_association.c.followee_id == followee_id
        )
    ).first():
        return None  # Already following

    # Create follow relationship
    db.execute(models.followers_association.insert().values(follower_id=follower_id, followee_id=followee_id))
    db.commit()

def unfollow_user(db: Session, follower_id: int, followee_id: int):
    """Unfollow a user."""
    db.query(models.followers_association).filter(
        and_(
            models.followers_association.c.follower_id == follower_id,
            models.followers_association.c.followee_id == followee_id
        )
    ).delete()
    db.commit()

def get_following(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id.in_(
        db.query(models.followers_association.c.followee_id)
          .filter(models.followers_association.c.follower_id == user_id)
    )).all()

def get_comments_from_following(db: Session, user_id: int):
    """Get all comments made by users that the current user follows."""
    following_ids = db.query(models.followers_association.c.followee_id).filter(
        models.followers_association.c.follower_id == user_id
    ).subquery()

    comments_with_username = db.query(models.Comment, models.User.username)\
        .join(models.User, models.Comment.owner_id == models.User.id)\
        .filter(models.Comment.owner_id.in_(following_ids)).all()

    joined_comments = []
    for comment, username in comments_with_username:
        joined_comments.append(schemas.CommentWithUserName(
            id=comment.id,
            text=comment.text,
            url=comment.url,
            css_selector=comment.css_selector,
            selected_text=comment.selected_text,
            text_offset_start=comment.text_offset_start,
            text_offset_end=comment.text_offset_end,
            created_at=comment.created_at,
            owner_id=comment.owner_id,
            username=username
        ))
    return joined_comments