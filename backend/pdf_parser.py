from flask import Flask,Blueprint, request, jsonify
import fitz  # PyMuPDF
import google.generativeai as genai
import os
import cloudinary.uploader
import io
import json
from app import cloudinary

pdf_parser_bp = Blueprint('pdf_parser', __name__)

# Initialize Flask app
# app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_FOR_PDF")
model_name = "gemini-1.5-pro"

# Function to extract text from the uploaded PDF file
def extract_text_from_pdf(pdf_file):
    # Read the content of the file-like object into a memory buffer
    pdf_file_bytes = pdf_file.read()

    # Convert the bytes into a BytesIO stream that PyMuPDF can open
    pdf_stream = io.BytesIO(pdf_file_bytes)

    # Open the PDF file from the BytesIO stream
    pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")
    text = ""
    
    # Extract text from each page
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text()
    return text

def extract_leave_details_gemini(text):
    # Initialize the GenAI client
    model = genai.GenerativeModel(model_name=model_name)

    # Define the prompt for leave extraction
    prompt = f"""
    You are a document parser. The following text contains a leave request from an employee. Extract the relevant details such as:
    - Employee Name
    - Employee Email
    - Leave Type
    - Leave Start Date
    - Leave End Date
    - Leave Reason

    Text: {text}

    Output in JSON format:
    """

    # Call the Generative Model to process the prompt
    response = model.generate_content(
        prompt,
    )
    print(response)

    # Extract the text from the response
    if response and response._result and len(response._result.candidates) > 0:
        json_text = response._result.candidates[0].content.parts[0].text.strip("```json\n").strip("```")  # Removing markdown code block notation
        try:
            return json.loads(json_text)  # Parse the extracted JSON text
        except json.JSONDecodeError:
            return {"error": "Failed to parse the response content as JSON"}
    else:
        return {"error": "Failed to process the text with Gemini"}


@pdf_parser_bp.route('/upload-leave-site-pdf', methods=['POST'])
def upload_leave_request():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    pdf_file = request.files['file']

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        try:
            # Step 1: Save file temporarily
            temp_pdf_path = f"temp/{pdf_file.filename}"
            pdf_file.save(temp_pdf_path)

            # **Reset file pointer** for further use
            pdf_file.seek(0)

            # Step 2: Extract Text
            pdf_text = extract_text_from_pdf(pdf_file)

            # Step 3: Extract Leave Details
            leave_details = extract_leave_details_gemini(pdf_text)

            # Step 4: Upload to Cloudinary with Correct Resource Type
            cloudinary_response = cloudinary.uploader.upload(
                temp_pdf_path,
                resource_type="raw",  # Keep as "raw"
                format="pdf",  # Ensure the format remains PDF
                use_filename=True,
                unique_filename=False,
                overwrite=True,
                # raw_convert="aspose"  # ✅ Convert raw to actual PDF
            )

            # Step 5: Get Cloudinary URL for Direct Viewing
            pdf_url = cloudinary_response["secure_url"]  # ✅ No need to modify URL manually

            # Cleanup temp file
            os.remove(temp_pdf_path)

            return jsonify({
                "leave_details": leave_details,
                "pdf_url": pdf_url  # ✅ Now a viewable document link
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
