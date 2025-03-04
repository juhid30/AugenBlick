from datetime import datetime, timedelta
from flask import jsonify, request, current_app
from models.attendance_model import Attendance

def check_in():
    """ Add attendance record """
    try:
        app = current_app
        data = request.json

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        user_email = data.get('user_email')
        date = data.get('date')
        check_in_time = data.get('check_in_time')

        if not user_email or not date or not check_in_time:
            return jsonify({"error": "Missing required fields"}), 400

        status = "checked-in"
        check_out_time = ""
        work_hours = ""

        attendance = Attendance.add_attendance(user_email, date, status, check_in_time, check_out_time, work_hours)

        if attendance:
            return jsonify({"message": "Attendance added successfully", "attendance": attendance}), 201
        else:
            return jsonify({"error": "Failed to add attendance"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def check_out():
    """ Update attendance record """
    try:
        app = current_app
        data = request.json

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        user_email = data['user_email']
        date = data.get('date')
        check_out_time = data.get('check_out_time')
        work_hours = data.get('work_hours')

        if not user_email or not date or not check_out_time or not work_hours:
            return jsonify({"error": "Missing required fields"}), 400

        status = "checked-out"

        update_result = Attendance.update_attendance(user_email, date, status=status, check_out_time=check_out_time, work_hours=work_hours)

        if update_result.modified_count > 0:
            return jsonify({"message": "Attendance updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update attendance"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500