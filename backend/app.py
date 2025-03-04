from flask import Flask
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
load_dotenv()

def create_app():
    """Create and configure the Flask app."""
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_COOKIE_NAME'] = os.getenv('JWT_COOKIE_NAME')
    app.config["MONGO_URI"] = os.getenv('MONGO_URI')
    # Initialize MongoDB
    mongo = PyMongo(app)

    # Import routes AFTER app is created
    from routes.routes import initialize_routes
    initialize_routes(app)

    print("Flask App Initialized 🚀")  # Better logging

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
