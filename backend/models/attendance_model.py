from datetime import datetime
from config import mongo

class Attendance:
    def __init__(self, user_email, date, status, check_in_time, check_out_time, work_hours, overtime):
        self.user_email = user_email
        self.date = date
        self.status = status
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.work_hours = work_hours
        self.overtime = overtime
        self.collection = mongo.db.attendance

    @staticmethod
    def get_attendance_by_user_and_date(user_email, date):
        """ Fetch attendance by user_email and date """
        attendance = mongo.db.attendance.find_one({"user_email": user_email, "date": date})
        if attendance:
            attendance["_id"] = str(attendance["_id"])  # Convert ObjectId to string
        return attendance

    @staticmethod
    def add_attendance(user_email, date, status, check_in_time, check_out_time, work_hours):
        """ Add attendance record """
        attendance = {
            "user_email": user_email,
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
    @staticmethod
    def update_attendance(user_email, date, status=None, check_in_time=None, check_out_time=None, work_hours=None):
        """ Update attendance record """
        
        # Build update fields dynamically
        update_fields = {}
        if status is not None:
            update_fields["status"] = status
        if check_in_time is not None:
            update_fields["check_in_time"] = check_in_time
        if check_out_time is not None:
            update_fields["check_out_time"] = check_out_time
        if work_hours is not None:
            update_fields["work_hours"] = work_hours

        # Ensure we are updating something
        if not update_fields:
            return {"error": "No fields to update", "modified_count": 0}

        # Perform update
        response = mongo.db.attendance.update_one(
            {"user_email": user_email, "date": date},
            {"$set": update_fields}
        )

        # Return detailed response
        return {
            "matched_count": response.matched_count,
            "modified_count": response.modified_count,
            "message": "Update successful" if response.modified_count > 0 else "No changes made"
        }


    @staticmethod
    def delete_attendance(user_email, date):

        """ Delete attendance record """
        response = mongo.db.attendance.delete_one({"user_email": user_email, "date": date})
        return response
    
    @staticmethod
    def get_attendance_by_user(user_email):
        """ Fetch attendance by user_email """
        attendance = mongo.db.attendance.find({"user_email": user_email})
        return list(attendance)