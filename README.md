# 🏫 School Management System

A comprehensive, full-stack web application designed to streamline school administration, student management, and academic processes. Built with the MERN stack (MongoDB, Express, React, Node.js), it features secure Google Authentication, Dynamic Role-Based Dashboards, and a responsive modern UI.

![Dashboard Preview](https://via.placeholder.com/800x400?text=School+Management+System+Dashboard)

## 🚀 Features

### 🔐 Authentication & Security
- **Google OAuth 2.0 Integration**: Secure one-click login for students and staff.
- **Auto-Registration**: First-time Google users are automatically registered as Students.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `TEACHER`, and `STUDENT`.
- **JWT Authentication**: Secure session management.

### 👥 User Roles & Dashboards
- **Admin Panel**:
  - Full control over Students, Teachers, and Classes.
  - View system-wide statistics.
  - Manage admissions and staff records.
- **Teacher Panel**:
  - View assigned classes and students.
  - Access timetables (Coming Soon: Attendance & Grading).
- **Student Panel**:
  - View personal specific dashboard.
  - Check Class Teacher and Schedule.
  - (Coming Soon: View Attendance & Grades).

### 📚 Academic Management
- **Student Directory**: Admins can Add, Edit, and Delete student records with validation.
- **Class Organization**: Pre-seeded database with Grades 1 through 10.
- **Profile Management**: Profile photo persistence and password management.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Animations), Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js (Google Strategy), JSON Web Tokens (JWT)
- **Tools**: Swagger (API Docs), Nodemon

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Account (for OAuth)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd symbiosis
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_db
JWT_SECRET=your_super_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Auth Keys (From Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🏃‍♂️ Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
*Server runs on port 5000.*

### Start Frontend
```bash
cd frontend
npm run dev
```
*Client runs on port 5173.*

---

## 🚀 Deployment Guide (Render)

This project is configured for deployment on Render.com.

1.  **Create a New Web Service** on Render.
2.  **Connect your Repository**.
3.  **Build Command**: `cd backend && npm install` (or root install script).
4.  **Start Command**: `cd backend && node server.js`.
5.  **Environment Variables**:
    You **MUST** add the following in the Render Dashboard under "Environment":
    - `MONGO_URI`: Connection string to your MongoDB Atlas cluster.
    - `JWT_SECRET`: A strong secret key.
    - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
    - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
    - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`).

---

## 📂 Project Structure

```
symbiosis/
├── backend/
│   ├── config/         # DB & Passport Config
│   ├── controllers/    # Request Logic (Auth, Student, etc.)
│   ├── models/         # Mongoose Schemas (User, Student, Class)
│   ├── routes/         # API Routes
│   └── server.js       # Entry Point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Auth Context
│   │   ├── pages/      # Dashboard Views (Admin, Student, Teacher)
│   │   └── services/   # API Integration
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Commercial License Notice
This project is proprietary software.
It is not open source and may not be redistributed or resold without permission.
For commercial licensing, contact the author.


---

## 📜 License

MIT License.
