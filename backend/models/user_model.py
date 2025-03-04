from datetime import datetime
from werkzeug.security import check_password_hash
from config import mongo  

class User:
    def __init__(self, user_id, fullname, email, password, manager_id, role, team):
        self.user_id = user_id
        self.fullname = fullname
        self.email = email
        self.role = role
        self.team = team
        self.password = password
        self.manager_id = manager_id
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
        # Check if email already exists
        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return {"error": "Email already exists."}

        # Create a user document
        new_user = {
            "role": role,
            "team": team,
            "manager_id": "" if role == "manager" else manager_id,
            "email": email,
            "password": hashed_password,
            "fullname": fullname,
            "created_at": datetime.utcnow()
        }

        # Insert the new user into the MongoDB collection
        result = mongo.db.users.insert_one(new_user)

        # Return user details (excluding password for security)
        user_data = new_user
        user_data["_id"] = str(result.inserted_id)
        return user_data