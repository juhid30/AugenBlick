import jwt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from models.user_model import User
from werkzeug.security import check_password_hash
from app import app

def login():
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
