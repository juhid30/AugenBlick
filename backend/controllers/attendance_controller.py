from datetime import datetime, timedelta
from flask import jsonify, request, current_app
from models.attendance_model import Attendance

def check_in():
    """ Add attendance record """
    app = current_app
    data = request.json

    user_email = data['user_email']
    date = data.get('date')
    status = "checked-in"
    check_in_time = data.get('check_in_time')
    check_out_time = ""
    work_hours = ""

    attendance = Attendance.add_attendance(user_email, date, status, check_in_time, check_out_time, work_hours)

    if attendance:
        return jsonify({"message": "Attendance added successfully", "attendance": attendance}), 201
    else:
        return jsonify({"error": "Failed to add attendance"}), 500
    

def check_out():
    """ Update attendance record """
    app = current_app
    data = request.json

    user_email = data['user_email']
    date = data.get('date')
    status = "checked-out"
    check_out_time = data.get('check_out_time')
    work_hours = data.get('work_hours')

    update_result = Attendance.update_attendance(user_email, date, status=status, check_out_time=check_out_time, work_hours=work_hours)

    if update_result.modified_count > 0:
        return jsonify({"message": "Attendance updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update attendance"}), 500