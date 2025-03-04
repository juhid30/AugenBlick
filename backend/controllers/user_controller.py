from models.user_model import User
from models.attendance_model import Attendance
from models.leave_model import Leave

def get_attendance_details(user):
    """Fetch attendance details for the user"""
    try:
        attendance_details = Attendance.get_attendance_by_user(user['email'])
        return attendance_details
    except Exception as e:
        raise Exception(str(e))
    
def get_leave_details(user):
    """Fetch leave details for the user"""
    try:
        leave_details = Leave.get_leaves_by_email(user['email'])
        return leave_details
    except Exception as e:
        raise Exception(str(e))