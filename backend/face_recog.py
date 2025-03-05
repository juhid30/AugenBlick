from flask import Blueprint, request, jsonify
import os
import cv2
import numpy as np
import face_recognition
import pickle
from datetime import datetime
import requests
from controllers.attendance_controller import checkin_face, checkout_face  # Import check_in function

# Create a Blueprint named 'face_recog'
face_recog_bp = Blueprint('face_recog', __name__)

TRAINING_DIR = "Training_images"
ENCODINGS_FILE = "encodings.pkl"
ATTENDANCE_FILE = "Attendance.csv"
ATTENDANCE_API_URL = "http://127.0.0.1:5000/get-attendance"  # Replace with actual API endpoint

# Load existing encodings
if os.path.exists(ENCODINGS_FILE):
    with open(ENCODINGS_FILE, "rb") as f:
        encodings_data = pickle.load(f)
else:
    encodings_data = {}

# Store timestamps for detected faces
detected_faces = {}

# Function to encode faces
def encode_face(image_path, name, email):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)
    if encode:
        encodings_data[name] = {"encoding": encode[0], "email": email}  # Store encoding with email
        with open(ENCODINGS_FILE, "wb") as f:
            pickle.dump(encodings_data, f)
        return True
    return False

# Register new user (now captures email)
@face_recog_bp.route("/register", methods=["POST"])
def register():
    if "image" not in request.files or "name" not in request.form or "email" not in request.form:
        return jsonify({"error": "Missing name, email, or image"}), 400
    
    name = request.form["name"]
    email = request.form["email"]  # Capture email
    image = request.files["image"]
    image_path = os.path.join(TRAINING_DIR, f"{name}.jpg")
    image.save(image_path)
    
    if encode_face(image_path, name, email):
        return jsonify({"message": "User registered and encoded successfully!"})
    return jsonify({"error": "Failed to encode face"}), 500

# Get latest attendance status
def get_latest_attendance(user_email):
    try:
        token = request.headers.get("Authorization")
        if not token:
            return {"error": "Unauthorized, token missing"}, 401

        headers = {
            "Authorization": token,  # Pass token in request
            "Content-Type": "application/json"
        }

        response = requests.get(ATTENDANCE_API_URL, json={"email": user_email}, headers=headers)

        if response.status_code == 200:
            attendance_records = response.json()
            today = datetime.now().strftime("%d-%m-%Y")
            for record in attendance_records:
                if record["date"] == today:
                    print(record)
                    return record  # Return the latest record for today
        return None  # No attendance found for today
    except Exception as e:
        print(f"Error fetching attendance: {e}")
        return None

# Mark Attendance (Waits for 2 sec before marking)
@face_recog_bp.route("/mark-attendance", methods=["POST"])
def mark_attendance():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return jsonify({"error": "Could not access webcam"}), 500

    while True:
        success, img = cap.read()
        if not success:
            break

        imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
        imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

        facesCurFrame = face_recognition.face_locations(imgS)
        encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

        for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
            matches = face_recognition.compare_faces([data["encoding"] for data in encodings_data.values()], encodeFace)
            faceDis = face_recognition.face_distance([data["encoding"] for data in encodings_data.values()], encodeFace)

            name = "Unknown"
            email = None  # Initialize email as None
            if True in matches:
                matchIndex = np.argmin(faceDis)
                name = list(encodings_data.keys())[matchIndex]
                email = encodings_data[name]["email"]  # Retrieve the email from encodings data

                # Track face detection time
                if name in detected_faces:
                    elapsed_time = (datetime.now() - detected_faces[name]).total_seconds()
                    print(f"Detected: {name}, Email: {email}, Elapsed Time: {elapsed_time} seconds")
                    
                    # Only proceed if elapsed time is >= 2 seconds
                    if elapsed_time >= 10:
                        if email:  # Ensure email exists before proceeding
                            latest_attendance = get_latest_attendance(email)  # Use email for attendance
                            if latest_attendance:
                                print(f"Latest Attendance Status: {latest_attendance}")
                            else:
                                print(f"No attendance record found for {email}.")
                        
                        # Check if attendance needs to be marked or checked out
                        if latest_attendance:
                                print(f"Latest Attendance Status: {latest_attendance}")
                                status = latest_attendance.get("status", "")

                                if status == "checked-in":
                                    print(f"🔵 {name} is already checked in. Checking out now.")
                                    checkout_face(email)  # Call checkout function
                                elif status == "checked-out":
                                    print(f"🟢 {name} is checked out. Checking in now.")
                                    checkin_face(email)  # Call check-in function
                                else:
                                    print(f"⚠️ Unknown status for {name}, defaulting to check-in.")
                                    checkin_face(email)  # Default to check-in if status is unclear
                        else:
                            print(f"No attendance record found for {email}. Checking in.")
                            checkin_face(email)  # If no record found, check-in

                        print(f"✅ {name} marked present")  # Print in terminal
                        del detected_faces[name]  # Reset timer for the person
                else:
                    detected_faces[name] = datetime.now()  # Start timer

            # Draw Bounding Box
            top, right, bottom, left = [v * 4 for v in faceLoc]
            cv2.rectangle(img, (left, top), (right, bottom), (0, 255, 0), 2)  # Green box
            cv2.putText(img, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Show the image
        cv2.imshow("Face Recognition Attendance", img)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    return jsonify({"message": "Attendance process completed"})
