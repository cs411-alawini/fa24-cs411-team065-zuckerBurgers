from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from dotenv import load_dotenv
from flask_cors import CORS

import os

# Initialize SQLAlchemy, Migrate, and SocketIO
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()

def create_app():
    # Load environment variables from .env file
    load_dotenv()
    app = Flask(__name__)
    CORS(app)
    # Load configuration settings
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize Flask extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)

    # Register Blueprints for routing (we will create these later)
    # from app.routes import auth_routes
    # app.register_blueprint(auth_routes.bp)
    # Register all blueprints from routes/__init__.py
    from app.routes import blueprints
    for bp in blueprints:
        app.register_blueprint(bp)

    return app
