# Deployment Guide: ISBM School Management System

This guide will walk you through deploying your MERN stack application for free using **Render** (for Backend & Database) and **Vercel** (for Frontend).

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to GitHub.
2.  **Accounts**:
    *   [Render.com](https://render.com) (Log in with GitHub)
    *   [Vercel.com](https://vercel.com) (Log in with GitHub)
    *   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (For cloud database)

---

## Part 1: Database Setup (MongoDB Atlas)

1.  Log in to **MongoDB Atlas**.
2.  Create a **New Cluster** (Free Tier/M0).
3.  **Database Access**: Create a user (e.g., `admin` / `password`).
4.  **Network Access**: Allow access from anywhere (`0.0.0.0/0`).
5.  **Connect**: Get the connection string. It looks like:
    `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

---

## Part 2: Backend Deployment (Render)

1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** > **Web Service**.
3.  Connect your `School-Management-System` repo.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free
5.  **Environment Variables** (Advanced Settings):
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Paste your Atlas connection string)
    *   `JWT_SECRET`: (Any random string, e.g. `mysecretkey123`)
6.  Click **Deploy**.
7.  Once live, **Copy the URL** from the top left (e.g., `https://isbm-backend.onrender.com`).

---

## Part 3: Frontend Deployment (Vercel)

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** > **Project**.
3.  Import `School-Management-System`.
4.  **Settings**:
    *   **Root Directory**: Click **Edit** and select `frontend`.
    *   **Framework Preset**: Vite (should be auto-detected).
5.  **Environment Variables**:
    *   **Name**: `VITE_API_URL`
    *   **Value**: (Paste your Render Backend URL + `/api`)
    *   *Example Value*: `https://isbm-backend.onrender.com/api`
6.  Click **Deploy**.

---

## Part 4: Final Check

Once Vercel deploys, visit your new website URL!
*   Try logging in (Admin: `admin@isbm.com` / `adminpassword` - *Note: You will need to re-seed data or create a new admin since this is a fresh database on Atlas*).
*   **To Seed Data on Cloud DB**:
    *   You can run the seeder locally but point it to the cloud DB temporarily in your `.env`, OR
    *   Use MongoDB Compass to connect to your Atlas DB and manually add the admin user.
