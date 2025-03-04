from datetime import datetime
from config import mongo

class Attendance:
    def __init__(self, user_id, date, status, check_in_time, check_out_time, work_hours):
        self.user_id = user_id
        self.date = date
        self.status = status
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.work_hours = work_hours
        self.collection = mongo.db.attendance

    @staticmethod
    def get_attendance_by_user_and_date(user_id, date):
        """ Fetch attendance by user_id and date """
        attendance = mongo.db.attendance.find_one({"user_id": user_id, "date": date})
        if attendance:
            attendance["_id"] = str(attendance["_id"])  # Convert ObjectId to string
        return attendance

    @staticmethod
    def add_attendance(user_id, date, status, check_in_time, check_out_time, work_hours):
        """ Add attendance record """
        attendance = {
            "user_id": user_id,
            "date": date,
            "status": status,
            "check_in_time": check_in_time,
            "check_out_time": check_out_time,
            "work_hours": work_hours,
            "created_at": datetime.now()
        }
        mongo.db.attendance.insert_one(attendance)
        return attendance

    @staticmethod
    def update_attendance(user_id, date, status=None, check_in_time=None, check_out_time=None, work_hours=None):
        """ Update attendance record """
        update_fields = {}
        if status is not None:
            update_fields["status"] = status
        if check_in_time is not None:
            update_fields["check_in_time"] = check_in_time
        if check_out_time is not None:
            update_fields["check_out_time"] = check_out_time
        if work_hours is not None:
            update_fields["work_hours"] = work_hours

        response = mongo.db.attendance.update_one({"user_id": user_id, "date": date}, {"$set": update_fields})
        return response

    @staticmethod
    def delete_attendance(user_id, date):
        """ Delete attendance record """
        response = mongo.db.attendance.delete_one({"user_id": user_id, "date": date})
        return response