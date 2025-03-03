from flask_pymongo import PyMongo
from werkzeug.security import check_password_hash

class User:
    def __init__(self, user_id, fullname, email, password):
        self.user_id = user_id
        self.fullname = fullname
        self.email = email
        self.password = password
        self.collection = PyMongo().db.users

    @staticmethod
    def get_user_by_email(email):
        """ Fetch a user by email """
        user = PyMongo().db.users.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user

    @staticmethod
    def verify_password(password_hash, password):
        """ Verify if password matches the stored hash """
        return check_password_hash(password_hash, password)
