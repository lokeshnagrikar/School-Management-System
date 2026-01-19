# ISBM School Management System

A production-ready MERN stack application for School Management with a public website and admin dashboard.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Swagger
- **Frontend**: React (Vite), Tailwind CSS, Context API
- **Deployment**: Ready for standard Node.js/React hosting (e.g., Render, Vercel/Heroku)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in `backend/` folder (already created):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/isbm_school (or your Atlas URI)
JWT_SECRET=your_jwt_secret
```

**Run Database Seeder (Recommended):**
To populate default Admin and sample data:
```bash
npm run data:import
```

**Start Server:**
```bash
npm run dev
```
Server runs on http://localhost:5000
Swagger Docs: http://localhost:5000/api-docs

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Start Client:**
```bash
npm run dev
```
Frontend runs on http://localhost:5173

## Features

- **Authentication**: Role-based login (Admin, Teacher, Student).
- **Public Website**: Home, About, Contact pages.
- **Admin Dashboard**:
  - Manage Students & Staff
  - CMS (News, Gallery - backend ready)
- **API Documentation**: Full Swagger UI.

## Login Credentials (seeded)

- **Admin**: `admin@isbm.com` / `adminpassword`

## Folder Structure

- `backend/models`: Mongoose Schemas (User, Student, Staff, Class, etc.)
- `backend/controllers`: API Logic
- `backend/routes`: API Routes
- `frontend/src/context`: Auth State Management
- `frontend/src/pages`: React Pages

## Production Build

To build frontend for production:
```bash
cd frontend
npm run build
```
Serve the `dist` folder via Nginx or Express static middleware.
