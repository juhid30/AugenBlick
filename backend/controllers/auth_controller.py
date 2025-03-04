import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash 
from flask import jsonify, request, make_response, current_app
from models.user_model import User
from werkzeug.security import check_password_hash
# from app import app
def register():
    """Handle user registration"""
    app=current_app
    data = request.json
    print(data)
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.find_one({"email": data["email"]})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    
    user_id = User.insert_one({
        "email": data["email"],
        "password": hashed_password,
        "name": data.get("name", ""),
        "created_at": request.date,
    }).inserted_id

    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

def login():
    app=current_app
    """Login and return JWT token in the cookies"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Fetch user from DB
    user = User.get_user_by_email(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create JWT token
    payload = {
        "user_id": user['user_id'],
        "email": user['email'],
        "exp": datetime.utcnow() + timedelta(hours=1)  # Expiry in 1 hour
    }

    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

    # Set JWT token in cookies (HttpOnly, Secure flag is for production)
    resp = make_response(jsonify({"message": "Login successful"}))
    resp.set_cookie(app.config['JWT_COOKIE_NAME'], token, httponly=True, secure=False, samesite='Strict')  # Secure should be True in production

    return resp


def logout():
    """Logout by clearing the JWT cookie"""
    resp = make_response(jsonify({"message": "Logged out successfully"}))
    resp.delete_cookie(app.config['JWT_COOKIE_NAME'])
    return resp
