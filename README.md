
# Frontend Setup
If you're using a Vite-based frontend, follow these steps:

### 1. Navigate to the Frontend Directory
```sh
cd frontend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Start the Vite Development Server
```sh
npm run dev
```

---------

# Flask Backend API

## Introduction
This is a Flask-based backend API that includes authentication, leave management, attendance tracking, PDF uploads, and user-related functionalities.

# Backend Setup

## Installation and Setup

### 1. Activate Virtual Environment
Before running the application, activate your virtual environment:

**For Windows:**
```sh
venv\Scripts\activate
```

**For macOS/Linux:**
```sh
source venv/bin/activate
```

### 2. Install Dependencies
Install all required dependencies from `requirements.txt`:
```sh
pip install -r requirements.txt
```

### 3. Run the Flask App
Start the Flask application:
```sh
python3 app.py
```

## API Endpoints

### Authentication Routes

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| POST   | `/register` | Registers a new user. |
| POST   | `/login` | Logs in an existing user. |

### User Management Routes

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| GET   | `/get-user` | Retrieves details of the logged-in user (requires authentication). |
| GET   | `/get-teams` | Retrieves all users under the logged-in manager (requires authentication). |

### Leave Management Routes

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| POST   | `/add-leave` | Submits a leave request (requires authentication). |
| POST   | `/approve-leave` | Approves a leave request (requires authentication). |
| POST   | `/reject-leave` | Rejects a leave request (requires authentication). |
| GET   | `/get-leaves-mananger` | Retrieves leave requests for the logged-in manager (requires authentication). |
| GET   | `/get-leaves` | Retrieves the leave history of the logged-in user (requires authentication). |
| GET   | `/get-manager-leaves` | Retrieves leaves submitted to the manager (requires authentication). |

### Attendance Management Routes

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| POST   | `/check-in` | Records user check-in. |
| POST   | `/check-out` | Records user check-out. |
| GET   | `/get-attendance` | Retrieves attendance details of the logged-in user (requires authentication). |

### PDF Upload Route

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| POST   | `/upload-pdf` | Uploads a PDF to Cloudinary and returns the file URL. |

### Other Routes

| Method | Endpoint  | Description  |
|--------|----------|--------------|
| GET   | `/` | Root route, returns a welcome message. |
| GET   | `/protected` | Example of a protected route that requires authentication. |

## Environment Variables
Ensure that your `.env` file includes the necessary configurations, such as Cloudinary credentials and database connection details.

## Notes
- Ensure that the virtual environment is activated before running any Flask commands.
- Make sure that all necessary environment variables are configured properly.
- The API uses middleware for authentication, so protected routes require a valid authentication token.

