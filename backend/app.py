from flask import Flask
from flask_cors import CORS  
import os
from dotenv import load_dotenv
from config import mongo  # Import the mongo instance from config

load_dotenv()

"""Create and configure the Flask app."""
app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["MONGO_URI"] = os.getenv('MONGO_URI')

# Initialize MongoDB
mongo.init_app(app)

# Import routes AFTER app is created

from routes.routes import initialize_routes
initialize_routes(app)

print("Flask App Initialized 🚀")  # Better logging

if __name__ == "__main__":
    app.run(debug=True)
