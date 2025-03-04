from datetime import datetime
from config import mongo  

class Leave:
    def __init__(self, user_id, leave_id, leave_type, reason, start_date, end_date, status, pdf_uploaded, manager_id, remarks):
        self.user_id = user_id
        self.leave_id = leave_id
        self.leave_type = leave_type
        self.reason = reason
        self.start_date = start_date
        self.end_date = end_date
        self.status = status
        self.pdf_uploaded = pdf_uploaded
        self.manager_id = manager_id
        self.remarks = remarks
        self.collection = mongo.db.users

    @staticmethod
    def get_leave_by_id(leave_id):
        """ Fetch a user by email """
        leave = mongo.db.leaves.find_one({"_id": leave_id})
        print(leave)
        if leave:
            leave["_id"] = str(leave["_id"])  # Convert ObjectId to string
        return leave


    @staticmethod
    def add_leave_by_user(user_id, leave_type, reason, start_date, end_date, pdf_uploaded, manager_id):
        """ Add a leave by user """
        leave = {
            "user_id": user_id,
            "leave_type": leave_type,
            "reason": reason,
            "start_date": start_date,
            "end_date": end_date,
            "status": "pending",
            "pdf_uploaded": pdf_uploaded,
            "manager_id": manager_id,
            "created_at": datetime.now()
        }
        mongo.db.leaves.insert_one(leave)
        return leave
    
    @staticmethod
    def approve_leave(leave_id):
        """ Approve a leave """
        response = mongo.db.leaves.update_one({"leave_id": leave_id}, {"$set": {"status": "approved"}})
        return response
    
    @staticmethod
    def reject_leave(leave_id, remark):
        """ Reject a leave """
        response = mongo.db.leaves.update_one({"leave_id": leave_id}, {"$set": {"status": "rejected"}, "remarks": remark})
        return response
    

    @staticmethod
    def get_leaves_by_email(user_email):
        """ Fetch all leaves by user_email """
        leaves = mongo.db.leaves.find({"user_email": user_email})
        for leave in leaves:
            leave["_id"] = str(leave["_id"])
        return list(leaves)
