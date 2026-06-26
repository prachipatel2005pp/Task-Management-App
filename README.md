# Task Management App

A full-stack task management application built with:
- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Database:** MongoDB

This project lets users register, login, create tasks, and manage them. It also includes a special admin account for administrative access.

## Project structure

- `backend/` - Python backend code
  - `app/main.py` - FastAPI application entrypoint
  - `app/routes/` - API route handlers for users and tasks
  - `app/database.py` - MongoDB connection setup
- `frontend/` - React frontend code
  - `src/pages/` - app pages like `Login`, `Register`, `Dashboard`, and `AdminDashboard`
  - `src/components/` - reusable UI pieces
  - `src/services/api.js` - Axios API client configuration

## How to run the project

### 1. Start the backend

1. Open a terminal in `backend/`
2. Create and activate a virtual environment (Windows example):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate
   ```
3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```powershell
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

The backend API should now be available at `http://127.0.0.1:8000`.

### 2. Start the frontend

1. Open a second terminal in `frontend/`
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The React app will open in the browser, typically at `http://localhost:5173`.

## How the app works for beginners

1. Open the app in your browser.
2. Go to the login page.
3. If you do not have an account, click **Create account** and register.
4. After registering, log in with your email and password.
5. Once logged in, you are redirected to the dashboard.
6. In the dashboard, you can manage tasks.

### Admin access

Use the built-in admin account to login as an administrator:
- **Email:** `admin@taskapp.com`
- **Password:** `Admin@1234`

If you login as admin, the app redirects to `/admin-dashboard`.

## Key points of this project

- User authentication using backend login route
- Separate admin and regular user behavior
- Task creation, update, and deletion through API routes
- MongoDB used for storing users and tasks
- Frontend communicates with backend using Axios
- CORS is enabled in the backend so the frontend can make API requests from a different origin

## Important notes

- Make sure the backend is running before trying to login from the frontend. A common error is **Network Error** when the frontend cannot connect to `http://127.0.0.1:8000`.
- If you change the backend port, also update `frontend/src/services/api.js` `baseURL`.
- The backend uses MongoDB at `mongodb://localhost:27017`, so MongoDB must be running locally.

## Useful commands

From `backend/`:
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

From `frontend/`:
```bash
npm install
npm run dev
```

## Summary

This project is a beginner-friendly task manager with both frontend and backend components. It demonstrates how to build a React UI, connect it to a FastAPI backend, and persist data with MongoDB. Use the admin credentials above to access the admin dashboard, and register regular users for normal task management use.
