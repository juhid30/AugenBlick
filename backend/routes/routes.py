from controllers.auth_controller import login, logout
from middlewares.auth_middleware import token_required

def initialize_routes(app):
    """Initialize routes and middleware"""
    
    @app.route('/login', methods=['POST'])
    def login_route():
        return login()

    @app.route('/logout', methods=['POST'])
    def logout_route():
        return logout()

    # Protected route that requires JWT authentication
    @app.route('/protected', methods=['GET'])
    @token_required
    def protected_route():
        # The user data is now attached to the request object by the token_required middleware
        return jsonify({"message": "This is a protected route", "user": request.user}), 200
