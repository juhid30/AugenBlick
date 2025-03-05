from flask import Flask
from flask_cors import CORS  
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from config import mongo  # Import the mongo instance from config

load_dotenv()

"""Create and configure the Flask app."""
app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["MONGO_URI"] = os.getenv('MONGO_URI')

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)
# Initialize MongoDB
mongo.init_app(app)

CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGIN", "*")}})

# Import routes AFTER app is created

from routes.routes import initialize_routes
initialize_routes(app)

print("Flask App Initialized 🚀")  # Better logging

if __name__ == "__main__":
    app.run(debug=True)
