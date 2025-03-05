from flask import request, jsonify, current_app as app
from functools import wraps
from authlib.jose import jwt
from authlib.jose.errors import DecodeError, InvalidClaimError, ExpiredTokenError

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
            print(token)
            decoded = jwt.decode(token, app.config['SECRET_KEY'])
            print(f"Decoded token: {decoded}")

            # Attach the decoded user data to the request
            request.user = decoded

        except ExpiredTokenError:
            return jsonify({"error": "Token has expired!"}), 401  # Token expired error
        except DecodeError:
            return jsonify({"error": "Token decoding failed!"}), 403
        except InvalidClaimError as e:
            return jsonify({"error": f"Invalid claim: {str(e)}"}), 403
        except Exception as e:
            # Catch any other unexpected errors
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 403

        return f(*args, **kwargs)

    return decorator
