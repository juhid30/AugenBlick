import jwt
from flask import request, jsonify
from app import app

def token_required(f):
    """Middleware to require a valid JWT token for access"""
    def decorator(*args, **kwargs):
        token = request.cookies.get(app.config['JWT_COOKIE_NAME'])

        if not token:
            return jsonify({"error": "Token is missing!"}), 403

        try:
            # Decode the token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            request.user = payload  # Attach the user data to the request
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 403

        return f(*args, **kwargs)

    return decorator
