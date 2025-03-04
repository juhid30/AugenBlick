from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Email credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ACCOUNT = os.getenv("EMAIL_ACCOUNT")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Templates for responses
TEMPLATES = {
    "accept": """
    Dear {name},

    We are pleased to inform you that your leave request for {leave_date} has been approved. We understand the importance of taking time off to rest and rejuvenate, and we fully support your need for a break. Please ensure that you have delegated any pending responsibilities before your leave period begins to ensure a smooth workflow.

    Should you require any further assistance or have any questions, feel free to reach out. Enjoy your time off, and we look forward to your return!

    Best regards,
    Manager
    """,
    "reject": """
    Dear {name},

    After careful consideration, we regret to inform you that your leave request for {leave_date} has been declined due to {remarks}. We understand that this may be disappointing, but due to current workload constraints and business requirements, we are unable to approve your request at this time.

    We encourage you to discuss alternative dates with us or let us know if there is any flexibility in your plans so that we can work towards a solution that accommodates both your needs and the company’s requirements.

    If you have any concerns or require further clarification, please do not hesitate to reach out.

    Best regards,
    Manager
    """
}

@app.route("/respond-leave", methods=["POST"])
def respond_leave():
    data = request.json
    decision = data.get("decision")
    name = data.get("name")
    leave_date = data.get("leave_date")
    email = data.get("email")
    remarks = data.get("remarks", "NA")
    
    if decision not in ["accept", "reject", "hold"]:
        return jsonify({"error": "Invalid decision"}), 400
    
    if decision == "hold":
        return jsonify({"message": "Leave request is on hold."})
    
    template = TEMPLATES.get(decision, "")
    message_body = template.format(name=name, leave_date=leave_date, remarks=remarks)
    
    # Send email
    try:
        msg = MIMEText(message_body)
        msg["Subject"] = "Leave Application Response"
        msg["From"] = EMAIL_ACCOUNT
        msg["To"] = email
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ACCOUNT, email, msg.as_string())
        
        return jsonify({"message": "Response sent successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
