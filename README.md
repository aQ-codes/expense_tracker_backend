# Expense Tracker Backend

Backend service for the Expense Tracker app, built with **Node.js, Express, and MongoDB**.  
Handles authentication, expense management, and provides REST APIs for the frontend.

---

## 🚀 Features
- User authentication with **JWT + Cookies**
- Secure password hashing with **bcrypt**
- Expense CRUD operations (Create, Read, Update, Delete)
- Dashboard and charts
- Category management with color coding
- Dashboard analytics and monthly breakdown
- CORS setup for frontend integration
- MongoDB connection with Mongoose

---

## 🛠 Tech Stack
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- bcryptjs for password hashing
- Joi for validation
- dotenv for environment variables  

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd expense_tracker_backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   FRONTEND_URL=http://localhost:3000
   ```

4. **Run the server**
   ```bash
   yarn dev
   ```

---

## 📚 API Endpoints

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/expenses` - Create expense
- `POST /api/expenses/list` - Get expenses
- `POST /api/expenses/update` - Update expense
- `POST /api/expenses/delete` - Delete expense
- `POST /api/expenses/dashboard` - Get dashboard data
- `POST /api/categories` - Get categories
- `POST /api/monthly-breakdown` - Get monthly breakdown

---

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn start` - Start production server
- `yarn seed` - Seed default categories
