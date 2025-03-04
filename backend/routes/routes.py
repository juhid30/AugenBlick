from flask import jsonify, request

def initialize_routes(app):
    from controllers.auth_controller import register, login  # Import register and login functions
    from controllers.leave_controller import add_leave, approve_leave, reject_leave  # Import add_leave function
    from controllers.attendance_controller import check_in, check_out  # Import check_in function
    from middlewares.auth_middleware import token_required 

    # print("HI")

    @app.route("/", methods=["GET"])
    def home_route():
        print("HELLLLLLOOOO")
        return "helloo"
    
    @app.route('/register', methods=['POST'])
    def register_route():
        return register()

    @app.route('/login', methods=['POST'])
    def login_route():
        return login()



    @app.route('/add-leave', methods=['POST'])
    @token_required
    def add_leave_route():
        return add_leave(request.user)
    
    @app.route('/approve-leave', methods=['POST'])
    @token_required 
    def approve_leave_route():
        return approve_leave(request.user)
    
    @app.route('/reject-leave', methods=['POST'])
    @token_required 
    def reject_leave_route():
        return reject_leave(request.user)
    
    @app.route('/check-in', methods=['POST'])
    def check_in_route():
        return check_in() 

    @app.route('/check-out', methods=['POST'])
    def check_out_route():
        return check_out()   

    @app.route('/protected', methods=['GET'])
    @token_required
    def protected_route():
        return jsonify({"message": "This is a protected route", "user": request.user}), 200
