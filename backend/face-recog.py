from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
import face_recognition
import pickle
from datetime import datetime, time

app = Flask(__name__)

TRAINING_DIR = "Training_images"
ENCODINGS_FILE = "encodings.pkl"
ATTENDANCE_FILE = "Attendance.csv"

# Load existing encodings
if os.path.exists(ENCODINGS_FILE):
    with open(ENCODINGS_FILE, "rb") as f:
        encodings_data = pickle.load(f)
else:
    encodings_data = {}

# Store timestamps for detected faces
detected_faces = {}

# Function to encode faces
def encode_face(image_path, name):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)
    if encode:
        encodings_data[name] = encode[0]
        with open(ENCODINGS_FILE, "wb") as f:
            pickle.dump(encodings_data, f)
        return True
    return False

# Register new user
@app.route("/register", methods=["POST"])
def register():
    if "image" not in request.files or "name" not in request.form:
        return jsonify({"error": "Missing name or image"}), 400
    
    name = request.form["name"]
    image = request.files["image"]
    image_path = os.path.join(TRAINING_DIR, f"{name}.jpg")
    image.save(image_path)
    
    if encode_face(image_path, name):
        return jsonify({"message": "User registered and encoded successfully!"})
    return jsonify({"error": "Failed to encode face"}), 500

# Mark Attendance (Waits for 2 sec before marking)
@app.route("/mark-attendance", methods=["POST"])
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
            matches = face_recognition.compare_faces(list(encodings_data.values()), encodeFace)
            faceDis = face_recognition.face_distance(list(encodings_data.values()), encodeFace)

            name = "Unknown"
            if True in matches:
                matchIndex = np.argmin(faceDis)
                name = list(encodings_data.keys())[matchIndex]

                # Track face detection time
                if name in detected_faces:
                    elapsed_time = (datetime.now() - detected_faces[name]).total_seconds()
                    
                    if elapsed_time >= 2:
                        # Mark Attendance
                        with open(ATTENDANCE_FILE, "a") as f:
                            now = datetime.now()
                            dtString = now.strftime('%H:%M:%S')
                            f.write(f"{name},{dtString}\n")
                        
                        print(f"✅ {name} marked present at {dtString}")  # Print in terminal
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

if __name__ == "__main__":
    if not os.path.exists(TRAINING_DIR):
        os.makedirs(TRAINING_DIR)
    app.run(debug=True)
