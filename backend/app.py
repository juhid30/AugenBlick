from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from routes.routes import initialize_routes
import datetime

app = Flask(__name__)

# Secret key for encoding and decoding JWT
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure key in production
app.config['JWT_COOKIE_NAME'] = 'access_token_cookie'  # Cookie name for the JWT

# Initialize MongoDB
mongo = PyMongo(app)

# Initialize Routes
initialize_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
