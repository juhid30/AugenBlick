from flask import jsonify, request

def initialize_routes(app):
    from controllers.auth_controller import login, logout, register  # Import register function
    from middlewares.auth_middleware import token_required  

    print("HI")

    @app.route("/", methods=["GET"])
    def home_route():
        print("HELLLLLLOOOO")
        return
    # @app.route('/register', methods=['POST'])
    # def register_route():
    #     return register()

    # @app.route('/login', methods=['POST'])
    # def login_route():
    #     return login()

    # @app.route('/logout', methods=['POST'])
    # def logout_route():
    #     return logout()

    # @app.route('/protected', methods=['GET'])
    # @token_required
    # def protected_route():
    #     return jsonify({"message": "This is a protected route", "user": request.user}), 200
