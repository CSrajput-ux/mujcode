# MujCode Deployment Guide

This document provides instructions for deploying the MujCode application to production.

## 1. Frontend Deployment (Vercel/Netlify)

The frontend is built with Vite and React.

### Environment Variables
Configure the following environment variable in your deployment platform:
- `VITE_API_URL`: The URL of your backend API (e.g., `https://api.mujcode.in`).

### Build Command
- `npm run build`
- Output directory: `dist`

---

## 2. Backend Deployment (Docker/VPS/Railway)

The backend is a Node.js Express application.

### Environment Variables
Ensure the following variables are set in your `.env` file or environment:
- `PORT`: 5000 (standard)
- `NODE_ENV`: `production`
- `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`: PostgreSQL credentials.
- `MONGO_URI`: MongoDB connection string.
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis credentials (required for the submission queue).
- `JWT_SECRET`: A long, random string.
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://mujcode.in`).

### Database Setup
The backend uses Sequelize and Mongoose. Tables and collections will be created automatically on startup.

---

## 3. Post-Deployment Checklist
1. Ensure the backend URL in the frontend's `VITE_API_URL` is correct.
2. Ensure the frontend URL in the backend's `CORS_ORIGIN` is correct.
3. Test the login flow.
4. Verify code submission (requires Redis and a running worker).
