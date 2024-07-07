from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger
from dotenv import load_dotenv
from app.config import Config
import os

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()
config = Config()

def create_app() -> Flask:
    app = Flask(__name__,static_folder='static')
    app.config.from_object('app.config.Config')

    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    from app.views import bp
    app.register_blueprint(bp, url_prefix='/api') 
    
    swagger = Swagger(app, config=swagger_config)

    return app
