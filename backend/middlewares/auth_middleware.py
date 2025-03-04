from flask import request, jsonify
from flask import current_app as app
from functools import wraps
from flask import request, jsonify, current_app as app
from authlib.jose import jwt

def token_required(f):
    """Middleware to require a valid JWT token for access"""
    @wraps(f)
    def decorator(*args, **kwargs):
        # Get the token from the Authorization header (it should be in the form 'Bearer <token>')
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Token is missing!"}), 403

        # Remove "Bearer " from the token string
        if token.startswith('Bearer '):
            token = token[7:]

        try:
            # Decode the token with the app's SECRET_KEY
            decoded = jwt.decode(token, app.config['SECRET_KEY'])

            # Attach the decoded user data to the request
            request.user = decoded

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 403

        return f(*args, **kwargs)

    return decorator
