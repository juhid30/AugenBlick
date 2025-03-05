from flask import jsonify, request
import os
# import cloudinary
# import cloudinary.uploader

from dotenv import load_dotenv

def initialize_routes(app):
    from controllers.auth_controller import register, login  # Import register and login functions
    from controllers.leave_controller import add_leave, approve_leave, reject_leave, get_leaves_for_manager  # Import add_leave function
    from controllers.attendance_controller import check_in, check_out  # Import check_in function
    from middlewares.auth_middleware import token_required 
    from controllers.user_controller import get_attendance_details, get_leave_details, get_user_by_email
    from face_recog import face_recog_bp
    # from pdf_parser import pdf_parser_bp
    from app import cloudinary
    app.register_blueprint(face_recog_bp, url_prefix='/face-recog')  # Face recognition routes
    try:
        from pdf_parser import pdf_parser_bp  
        app.register_blueprint(pdf_parser_bp, url_prefix='/pdf')  
    except ImportError as e:
        print(f"Warning: Could not import pdf_parser_bp due to circular import: {e}")

    # print("HI")

     

    @app.route('/upload-pdf', methods=['POST'])
    def upload_pdf():
        try:
            if 'file' not in request.files:
                return jsonify({"error": "No file provided"}), 400

            file = request.files['file']
            
            # Upload the PDF to Cloudinary
            upload_result = cloudinary.uploader.upload(file, resource_type="auto")

            if not upload_result:
                return jsonify({"error": "Cloudinary upload failed"}), 500

            pdf_url = upload_result['secure_url']
            return jsonify({"pdf_url": pdf_url}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
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
    
    @app.route('/get-user', methods=['GET'])
    @token_required
    def get_user():
        return get_user_by_email(request.user['email'])

# LEAVE MANAGEMENT ROUTES
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

    # ATTENDANCE MANAGEMENT ROUTES
    @app.route('/check-in', methods=['POST'])
    def check_in_route():
        return check_in() 

    @app.route('/check-out', methods=['POST'])
    def check_out_route():
        return check_out()   

    @app.route('/get-attendance', methods=['GET'])
    @token_required
    def get_attendance_route():
        return get_attendance_details(request.user)

    @app.route('/get-leaves', methods=['GET'])
    @token_required
    def get_leave_route():
        return get_leave_details(request.user)
    @app.route('/get-manager-leaves', methods=['GET'])
    @token_required
    def get_man_leaves_route():
        print("Fetching manager leaves route triggered")
        return get_leaves_for_manager(request.user)



    @app.route('/protected', methods=['GET'])
    @token_required
    def protected_route():
        return jsonify({"message": "This is a protected route", "user": request.user}), 200
