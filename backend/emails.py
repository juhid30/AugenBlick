import os
import imaplib
import email
from email.header import decode_header
import datetime
import re
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Secure credentials using environment variables
IMAP_SERVER = "imap.gmail.com"
EMAIL_ACCOUNT = os.getenv("EMAIL_ACCOUNT")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")  # Use App Password if 2FA is enabled
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini AI
if not GEMINI_API_KEY:
    raise ValueError("Gemini API key is missing. Please set it in your .env file.")
genai.configure(api_key=GEMINI_API_KEY)

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Keywords to filter leave applications
LEAVE_KEYWORDS = ["leave application", "leave request", "vacation request"]

# Function to fetch emails from the last 2 days
def fetch_recent_emails():
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
        mail.select("inbox")
        # status, messages = mail.search(None, "ALL")

        date_since = (datetime.datetime.now() - datetime.timedelta(days=2)).strftime("%d-%b-%Y")
        status, messages = mail.search(None, f'SINCE {date_since}')

        if status != "OK":
            logging.warning("No emails found.")
            return []

        email_ids = messages[0].split()
        leave_emails = []

        for e_id in reversed(email_ids):
            status, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding or "utf-8")
                    sender = msg.get("From")
                    
                    # Extract email body
                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            content_disposition = str(part.get("Content-Disposition"))
                            if content_type == "text/plain" and "attachment" not in content_disposition:
                                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                                break
                    else:
                        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

                    # Check if email is a leave request
                    if any(keyword.lower() in subject.lower() or keyword.lower() in body.lower() for keyword in LEAVE_KEYWORDS):
                        leave_emails.append({"sender": sender, "subject": subject, "body": body})

        mail.logout()
        return leave_emails
    except Exception as e:
        logging.error(f"Error fetching emails: {e}")
        return []

# Function to extract employee details using Gemini
def extract_employee_details_gemini(email_body):
    model_name = "gemini-1.5-pro-latest"
    prompt = f"""
    Extract employee details from the following email text and return a JSON object.

    Email: {email_body}

    The JSON object should have these keys:
    - name
    - employee_id
    - leave_date
    - reason
    - contact

    If any field is missing, return "N/A" for that field. NO PREAMBLE.
    """
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)

        # Remove Markdown formatting if present
        structured_data = re.sub(r"```json|```", "", response.text.strip()).strip()

        # Parse JSON
        return json.loads(structured_data)

    except json.JSONDecodeError:
        logging.warning("Unexpected response format:", structured_data)
        return None

    except Exception as e:
        logging.error("Error extracting details:", e)
        return None

# Main Execution
if __name__ == "__main__":
    logging.info("Fetching recent emails...")
    leave_emails = fetch_recent_emails()

    if not leave_emails:
        logging.info("No leave application emails found.")
    else:
        logging.info(f"Found {len(leave_emails)} leave applications. Extracting details...")
        extracted_data = []

        for email_data in leave_emails:
            logging.info(f"Processing email from: {email_data['sender']}")
            details = extract_employee_details_gemini(email_data["body"])

            if details:
                extracted_data.append(details)
                logging.info("Extracted Details:", json.dumps(details, indent=4))

        # Save the extracted data as JSON
        output_file = "leave_requests.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(extracted_data, f, indent=4)

        logging.info(f"Leave requests saved to {output_file}")
