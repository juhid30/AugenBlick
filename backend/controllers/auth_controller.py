from authlib.jose import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request, current_app
from models.user_model import User

def register():
    """Handle user registration"""
    app = current_app 
    data = request.json
    print(data.get("email"))
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.get_user_by_email(data["email"])
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    
    user_response = User.add_user(data["email"], hashed_password, data.get("name", ""))

    return jsonify({"message": "User registered successfully", "user_id": user_response}), 201

def login():
    app = current_app
    """Login and return JWT token in the response"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(data)

    # Fetch user from DB
    user = User.get_user_by_email(email)
    print(user)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create JWT token
    payload = {
        "user_id": user['_id'],
        "email": user['email'],
        "exp": datetime.utcnow() + timedelta(hours=1)  # Expiry in 1 hour
    }
    token = jwt.encode({'alg': 'HS256'}, payload, app.config['SECRET_KEY'])
    token = token.decode('utf-8')


    return jsonify({"message": "Login successful", "access_token": token}), 200
