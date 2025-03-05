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


def checkin_face(email):
    """ Add attendance record """
    try:
        app = current_app

        user_email = email
        date = datetime.now().strftime("%Y-%m-%d")
        check_in_time = datetime.now().strftime("%H:%M:%S")

        existing_attendance = Attendance.get_attendance_by_user_and_date(user_email, date)

        if existing_attendance:
            return jsonify({"message": "User already checked in"}), 200


        status = "checked-in"
        check_out_time = ""
        work_hours = 0
        overtime = 0

        attendance = Attendance.add_attendance(user_email, date, status, check_in_time, check_out_time, work_hours, overtime)

        if attendance:
            return jsonify({"message": "Attendance added successfully", "attendance": attendance}), 201
        else:
            return jsonify({"error": "Failed to add attendance"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def checkout_face(email):
    """ Update attendance record """
    try:
        app = current_app

        user_email = email
        date = datetime.now().strftime("%Y-%m-%d")
        check_out_time = datetime.now().strftime("%H:%M:%S")

        # Get check-in time from database for this user and date
        attendance = Attendance.get_attendance_by_user_and_date(user_email, date)
        if not attendance:
            return jsonify({"error": "No check-in record found"}), 400
            
        check_in_time = datetime.strptime(attendance['check_in_time'], "%H:%M:%S")
        check_out = datetime.strptime(check_out_time, "%H:%M:%S")
        
        # Calculate time difference in minutes
        time_diff = (check_out - check_in_time).total_seconds() / 60
        
        # Check if at least 30 minutes have passed
        if time_diff < 30:
            return jsonify({"message": "User cannot check out before 30 minutes"}), 200

        work_hours = round(time_diff.total_seconds() / 3600, 2)

        if work_hours > 8:
            overtime = work_hours - 8
        else:
            overtime = 0

        status = "checked-out"

        update_result = Attendance.update_attendance(user_email, date, status=status, check_out_time=check_out_time, work_hours=work_hours, overtime=overtime)

        if update_result.modified_count > 0:
            return jsonify({"message": "Attendance updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update attendance"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500