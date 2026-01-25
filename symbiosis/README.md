# Symbiosis School Management System

A comprehensive MERN Stack (MongoDB, Express, React, Node.js) application for managing school operations. This system features Role-Based Access Control (RBAC) for Admins, Teachers, and Students, along with modules for Fees, Library, Notices, Gallery, and more.

## 🚀 Features

-   **Role-Based Dashboards**: Tailored views for Admin, Teacher, and Student.
-   **Student Management**: Directory, Search, and Profile management.
-   **Fee Management**: 
    -   Create dynamic Fee Structures.
    -   Generate Invoices (Bulk & Single).
    -   Download PDF Invoices.
    -   Track Payments.
-   **Academic Management**: Manage Classes, Subjects, and Timetables.
-   **Library System**: Manage Books, Issue/Return tracking.
-   **Notice Board**: 
    -   Create/Delete Notices.
    -   Dynamic Categories.
    -   Targeted visibility (Public vs Class-specific).
-   **Gallery**: Event photos and school albums.
-   **Authentication**: Secure Login with Password Visibility Toggle.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Framer Motion, React Router, Axios.
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose).
-   **Tools**: PDFKit (Invoices), Multer (File Uploads), Dotenv.

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas)

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

**Configure Environment Variables**:
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/symbiosis
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Seed Database (Optional but Recommended)**:
To populate the database with dummy data (Admin, Teachers, Students, Classes):
```bash
npm run seed
```

**Start Backend**:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

**Start Frontend**:
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

## 🔑 Default Credentials (from Seeder)

| Role      | Email                   | Password      |
| :-------- | :---------------------- | :------------ |
| **Admin** | `admin@isbm.com`        | `adminpassword` |
| **Teacher**| `teacher1@school.com`  | `password123` |
| **Student**| `student1@school.com`  | `password123` |

*(Note: Passwords for generated students are typically `password123`)*

## 📂 Project Structure

```
symbiosis/
├── backend/            # Express Server & API
│   ├── controllers/    # Route Logic
│   ├── models/         # Mongoose Models
│   ├── routes/         # API Endpoints
│   └── seeder.js       # Data Seeding Script
└── frontend/           # React Client (Vite)
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── pages/      # Route Pages (Admin/Student/Teacher)
    │   └── context/    # AuthContext & Global State
```
