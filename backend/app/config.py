import os

class Config:
    SQLALCHEMY_DATABASE_URI: str = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'mysecretkey')
    UPLOAD_FOLDER = 'static/images/'
    ALLOWED_EXTENSIONS: set[str] = {'png', 'jpg', 'jpeg', 'gif'}
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB


    def __init__(self) -> None:
        os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)