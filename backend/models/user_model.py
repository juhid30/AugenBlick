from datetime import datetime
from werkzeug.security import check_password_hash
from config import mongo  

class User:
    def __init__(self, user_id, fullname, email, password, manager_id, role, team, urls):
        self.user_id = user_id
        self.fullname = fullname
        self.email = email
        self.role = role
        self.team = team
        self.password = password
        self.manager_id = manager_id
        self.urls = urls  # Fixed missing assignment
        self.collection = mongo.db.users

    @staticmethod
    def get_user_by_email(email):
        """ Fetch a user by email """
        user = mongo.db.users.find_one({"email": email})
        print(user)
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user

    @staticmethod
    def verify_password(password_hash, password):
        """ Verify if password matches the stored hash """
        return check_password_hash(password_hash, password)

    @staticmethod
    def add_user(email, hashed_password, fullname, role, team, manager_id):
        """ Adds a new user to the database """
        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return {"error": "Email already exists."}

        new_user = {
            "role": role,
            "team": team,
            "manager_id": "" if role == "manager" else manager_id,
            "email": email,
            "password": hashed_password,
            "fullname": fullname,
            "urls": [],  # Initialize with an empty array
            "created_at": datetime.utcnow()
        }

        result = mongo.db.users.insert_one(new_user)
        user_data = new_user
        user_data["_id"] = str(result.inserted_id)
        return user_data

    @staticmethod
    def get_user_by_manager(manager_id):
        """ Fetch all users by manager_id """
        try:
            users = list(mongo.db.users.find({"manager_id": manager_id}))
            return users
        except Exception as e:
            raise Exception(f"An error occurred: {str(e)}")

    @staticmethod
    def get_leaves_by_manager(manager_id):
        """ Fetch all leaves by manager_id """
        try:
            leaves = list(mongo.db.leaves.find({"manager_id": manager_id}))
            return leaves
        except Exception as e:
            raise Exception(f"An error occurred: {str(e)}")

    @staticmethod
    def add_url(email, url):
        """ Append a URL to the user's urls array """
        try:
            result = mongo.db.users.update_one(
                {"email": email},  
                {"$push": {"urls": {"url": url, "timestamp": datetime.utcnow()}}}  
            )
            if result.modified_count > 0:
                return {"success": True, "message": "URL added successfully."}
            return {"success": False, "message": "User not found or URL not added."}
        except Exception as e:
            return {"success": False, "error": str(e)}



    @staticmethod
    def get_urls(email):
        """ Fetch all URLs by email """
        try:
            user = mongo.db.users.find_one({"email": email})
            if user:
                return user.get("urls", [])
            return []
        except Exception as e:
            raise Exception(str(e))