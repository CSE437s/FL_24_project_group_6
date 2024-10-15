from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import find_dotenv

class Settings(BaseSettings):
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    SECRET_KEY: str
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    EMAIL_FROM: str = "caret.reset@gmail.com"
    EMAIL_PASSWORD: str
    EMAIL_FROM_NAME: str = "Caret" 
    model_config = SettingsConfigDict(env_file=find_dotenv('.env'))
    