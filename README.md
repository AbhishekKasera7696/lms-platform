# 📚 Learning Management System (LMS) Platform

A full-stack Learning Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows students to browse, enroll in courses, track their progress, and admins to manage users and courses.

## 🚀 Live Demo Features

- User Authentication (JWT-based)
- Course Browsing and Enrollment
- Progress Tracking
- Admin Dashboard with User Management
- Lead Capture System with Webhook Integration
- Responsive Design

---

## ✨ Features

### User Features
- **User Registration & Login**: Secure authentication with JWT tokens
- **Browse Courses**: View all available courses with details
- **Course Enrollment**: Enroll in courses with one click
- **Progress Tracking**: Track module completion progress
- **Lead Generation**: Submit interest form that forwards to webhook


### Admin Features
- **Admin Dashboard**: Overview of platform statistics
- **User Management**: View all registered users
- **Enrollment Overview**: See all enrollments across all students
- **Course Management**: Create and delete courses
- **Platform Analytics**: View total users, courses, and enrollments


### Technical Features
- **RESTful API**: Well-structured API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Database Indexing**: Optimized queries with MongoDB indexes
- **Error Handling**: Comprehensive error handling middleware
- **CORS Enabled**: Cross-origin resource sharing configured
- **Environment Variables**: Secure configuration management

---


## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Axios** - HTTP client for webhook calls
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React.js** - UI library
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

---


## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (v6 or higher) - Comes with Node.js
- **Git** (optional) - [Download](https://git-scm.com/)

---


## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekKasera7696/lms-platform.git
cd lms-platform


# Backend Setup

# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your values (see Environment Variables section)
nano .env

# Seed the database with sample courses
npm run seed

# Start the backend server
npm run dev


# Frontend Setup

# Open a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start


---

Access the Application


Frontend: http://localhost:3000

Backend API: http://localhost:5000/api



🔧 Environment Variables

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/lms

# JWT Secret (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_generated_secret_key_here

# Webhook URL for Lead Capture (Get from https://webhook.site)
LEAD_WEBHOOK_URL=https://webhook.site/your-unique-url



Frontend (.env)

REACT_APP_API_URL=http://localhost:5000/api




Database Seeding

To populate the database with sample courses:

cd backend
npm run seed

## Sample courses added:

React Fundamentals (4 weeks, 10 modules)

Node.js Advanced (6 weeks, 12 modules)

MongoDB Essentials (3 weeks, 8 modules)

Full Stack Development (8 weeks, 15 modules)

JavaScript: The Complete Guide (5 weeks, 20 modules)


```

🚀 Scalability Considerations
Supporting 50,000+ Users
To scale the LMS platform for 50,000+ concurrent users, the following strategies are implemented and recommended:

1. Database Optimization
Indexing: All collections have indexes on frequently queried fields

Users: email (unique index)

Enrollments: Compound index on { user: 1, course: 1 }

Progress: Compound index on { user: 1, course: 1 }

Sharding: MongoDB sharding can distribute data across multiple servers

Connection Pooling: Implemented in Mongoose (default pool size: 5)

2. Load Balancing
Horizontal Scaling: Deploy multiple instances behind a load balancer

NGINX: Use as reverse proxy and load balancer

Auto-scaling: Configure auto-scaling groups in cloud environments

3. API Optimization
Pagination: Implement pagination for all list endpoints

Rate Limiting: Add rate limiting middleware (express-rate-limit)

Compression: Enable gzip compression for responses

4. Database Scaling
//for reference;
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const courses = await Course.find()
  .limit(limit)
  .skip(skip);

5. Asynchronous Processing
Queue System: Implement Bull (Redis-based) for:

Email notifications

Webhook forwarding

Report generation

Background Jobs: Process heavy operations asynchronously.


🎯 Features Implemented Checklist:

✅ User Authentication (JWT)

✅ Student Dashboard

✅ Course Listing Page

✅ Course Enrollment Functionality

✅ Basic Progress Tracking

✅ Backend API Implementation

✅ Database Integration (MongoDB)

✅ Lead Capture API with Webhook

✅ Admin Dashboard

✅ User Management

✅ Course Management

✅ Responsive Design

✅ Error Handling

✅ Input Validation

✅ Security Best Practices

