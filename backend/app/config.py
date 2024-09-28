from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import find_dotenv

class Settings(BaseSettings):
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    SECRET_KEY: str
    model_config = SettingsConfigDict(env_file=find_dotenv('.env'))
    