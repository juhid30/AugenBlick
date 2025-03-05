from authlib.jose import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request, current_app
from models.leave_model import Leave

def add_leave(user):
    """Add a leave from user"""
    try:
        app = current_app 
        data = request.json

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        user_email = user['email']
        leave_type = data.get('leave_type')
        reason = data.get('reason')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        pdf_uploaded = data.get('pdf_uploaded')
        manager_id = data.get('manager_id')

        if not all([leave_type, reason, start_date, end_date, manager_id]):
            return jsonify({"error": "Missing required fields"}), 400

        leave_response = Leave.add_leave_by_user(user_email, leave_type, reason, start_date, end_date, pdf_uploaded, manager_id)

        if leave_response:
            return jsonify({"message": "Leave added successfully", "leave_info": leave_response}), 201
        else:
            return jsonify({"error": "Failed to add leave"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def approve_leave(user):
    """Approve a leave"""
    try:
        app = current_app
        data = request.json

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        leave_id = data.get('leave_id')

        if not leave_id:
            return jsonify({"error": "Missing leave_id"}), 400

        response = Leave.approve_leave(leave_id)

        if response:
            return jsonify({"message": "Leave approved successfully"}), 200
        else:
            return jsonify({"error": "Failed to approve leave"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def reject_leave(user):
    try:
        app = current_app
        data = request.json

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        leave_id = data.get('leave_id')
        remark = data.get('remark')

        if not leave_id or not remark:
            return jsonify({"error": "Missing leave_id or remark"}), 400

        response = Leave.reject_leave(leave_id, remark)

        if response:    
            return jsonify({"message": "Leave rejected successfully"}), 200
        else:
            return jsonify({"error": "Failed to reject leave"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500