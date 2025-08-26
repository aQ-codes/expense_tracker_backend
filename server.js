import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { dbErrorHandler } from "./src/middlewares/db-error-handler.js";
import connectDB from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import configureRoutes from "./src/routes/routes.js";
import seedCategories from "./src/seeders/category-seeder.js";

// Define allowed origins more explicitly
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://expense-tracker-user-frontend.vercel.app", // Your Vercel URL
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, ""), // Remove trailing slash if present
].filter(Boolean);

// Create Express app
const app = express();

// Trust proxy (important for Render deployment)
app.set('trust proxy', 1);

// CORS configuration - MUST be before other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin); // For debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Essential for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false
  })
);

// Handle preflight requests explicitly
app.options('*', cors());

// Use cookie-parser middleware (AFTER CORS)
app.use(cookieParser());

// Set the port
const port = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB()
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed default categories
    try {
      await seedCategories();
    } catch (error) {
      console.error('Error seeding categories:', error);
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Expense Tracker API", 
    version: "1.0.0",
    status: "running",
    cors_origins: allowedOrigins // For debugging
  });
});

// Configure routes
configureRoutes(app);

// Serve static files
app.use("/public", express.static("public"));

// Error handling middleware
app.use(dbErrorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Route not found'
  });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Allowed origins:', allowedOrigins);
  console.log('Environment:', process.env.NODE_ENV);
});