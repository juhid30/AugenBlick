from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import google.generativeai as genai
import os
import io
import json

# Initialize Flask app
app = Flask(__name__)

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

# Route to handle file upload and process the leave request
@app.route('/upload-leave-request', methods=['POST'])
def upload_leave_request():
    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    pdf_file = request.files['file']

    # Check if the file is a PDF
    if pdf_file and pdf_file.filename.endswith('.pdf'):
        # Extract text from the PDF
        pdf_text = extract_text_from_pdf(pdf_file)

        # Use Gemini to process the extracted text and extract leave details
        leave_details = extract_leave_details_gemini(pdf_text)
        return jsonify(leave_details), 200
    else:
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

if __name__ == '__main__':
    app.run(debug=True)
