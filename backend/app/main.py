from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlalchemy.orm import Session
from . import config
from functools import lru_cache
from fastapi.middleware.cors import CORSMiddleware



import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from . import models, schemas, db_utils
from .database import SessionLocal, engine
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from fastapi import BackgroundTasks





# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@lru_cache
def get_settings():
    return config.Settings()




models.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def send_email(to_email: str, subject: str, body: str, settings: config.Settings):
    """
    Sends an email using SMTP with the provided subject and body.
    Replace with a third-party service like SendGrid or Mailgun for production.
    """
    msg = MIMEMultipart()
    msg['From'] = formataddr(('Caret', settings.EMAIL_FROM))
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_FROM, settings.EMAIL_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())

def create_access_token(settings: Annotated[config.Settings, Depends(get_settings)], data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.algorithm)
    return encoded_jwt


async def get_current_user(settings: Annotated[config.Settings, Depends(get_settings)], db: Annotated[Session, Depends(get_db)], token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = db_utils.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[schemas.User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)],settings: Annotated[config.Settings, Depends(get_settings)]
) -> schemas.Token:
    user = db_utils.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        settings=settings, data={"sub": user.username}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)],
):
    return current_user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db_utils.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return db_utils.create_user(db=db, user=user)

@app.post("/create_comment", response_model=schemas.Comment)
def create_comment_for_current_user(
    current_user: Annotated[schemas.User, Depends(get_current_active_user)], comment: schemas.CommentCreate, db: Session = Depends(get_db)
):
    return db_utils.create_user_comment(db=db, comment=comment, user_id=current_user.id)

@app.get("/users/{user_id}/comments/", response_model=list[schemas.Comment])
def get_comments_for_user(
    user_id: int, db: Session = Depends(get_db)
):
    return db_utils.get_user_comments(db=db, user_id=user_id)

@app.get("/comments/", response_model=list[schemas.Comment])
def get_all_url_comments(
    url: str, db: Session = Depends(get_db)
):
    return db_utils.get_comments_by_url(db=db, url=url)

@app.post("/password_reset_request/")
def password_reset_request(
    data: schemas.PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), settings: config.Settings = Depends(get_settings), 
    
):
    """
    Generates a password reset token and emails it to the user.
    """
    user = db_utils.get_user_by_email(db, email=data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Email not found")

    # Generate a password reset token (valid for 30 minutes)
    reset_token = create_access_token(settings,  data={"sub": data.email}, expires_delta=timedelta(minutes=30))

    # Send the token via email
    subject = "Password Reset Request"
    body = f"Please copy and paste the following token to reset your password: {reset_token}"
    
    # Send email asynchronously using background tasks
    background_tasks.add_task(send_email, user.email, subject, body, settings)

    return {"message": "Password reset token sent via email."}

@app.post("/reset_password/")
def reset_password(data: schemas.PasswordReset, db: Session = Depends(get_db), settings: config.Settings = Depends(get_settings)):
    """
    Resets the password using the provided email, token, and new password.
    """
    # Verify the token
    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    if email != data.email:
        raise HTTPException(status_code=400, detail="Invalid token or email")

    # Fetch the user from the database
    user = db_utils.get_user_by_email(db, email=data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Email not found")

    # Hash the new password and update it in the database
    db_utils.update_password(db, user, data.new_password)

    # Generate a new access token for login after password reset
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        settings=settings, data={"sub": user.username}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")