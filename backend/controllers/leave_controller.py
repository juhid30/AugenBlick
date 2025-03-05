from authlib.jose import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request, current_app
from models.leave_model import Leave
from config import mongo

def add_leave(user):
    """Add a leave from user"""
    try:
        app = current_app 
        data = request.json
        print(user)
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        user_email = user['email']
        leave_type = data.get('leave_type')
        reason = data.get('reason')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        pdf_uploaded = data.get('pdf_uploaded') or None
        manager_id = data.get('manager_id' , "abc")

        if not all([leave_type, reason, start_date, end_date]):
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
    


def get_leaves_for_manager(user):
    try:
        # Extract manager_id from the authenticated user
        manager_id = user.get('manager_id')
        print("HELLO")
        if not manager_id:
            return jsonify({"error": "Manager ID not found"}), 403

        # Query the database for leaves assigned to this manager
        
        # Fetch all leaves assigned to this manager using PyMongo
        leaves = Leave.get_leaves_by_manager_id({"manager_id": manager_id})
        print(leaves)
        # Convert the leave documents to a JSON-friendly format
        leave_list = [
            {
                "_id": str(leave.id),
                "user_id": str(leave.user_id),
                "leave_type": leave.leave_type,
                "reason": leave.reason,
                "start_date": leave.start_date,
                "end_date": leave.end_date,
                "status": leave.status,
                "pdf_uploaded": leave.pdf_uploaded,
                "manager_id": leave.manager_id,
                "created_at": leave.created_at
            }
            for leave in leaves
        ]
        print(leave_list)
        return jsonify({"leaves": leave_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500