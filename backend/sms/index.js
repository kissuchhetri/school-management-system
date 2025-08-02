const express = require("express");
const { sequelize, connectDB } = require("./database/db.js");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  credentials: false, // Changed to false to match frontend
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


// Test endpoint to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend API is working!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      login: "/api/login/login",
      users: "/api/users",
      students: "/api/createstudent",
      teachers: "/api/createteacher",
      assignments: "/api/assignment",
      announcements: "/api/announcement"
    }
  });
});

app.use("/api/users", require("./router/userroute"));
app.use("/api/login", require("./router/login"));
app.use("/uploads", express.static("uploads")); // Serve static files from the 'uploads' directory
app.use("/api/createstudent", require("./router/createstudent"));
app.use("/api/createteacher", require("./router/createteacher"));
app.use("/api/announcement", require("./router/announcement"));
app.use("/api/assignment", require("./router/assingment"));
app.use("/api/message", require("./router/message"));

const startServer = async () => {
  try {
    console.log("Starting server...");
    
    // Try to connect to database
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.log("Database connection failed, but server will continue...");
    }
    
    // Sync database schema
    try {
      await sequelize.sync({});
      console.log("Database schema synced successfully");
    } catch (syncError) {
      console.error("Database sync error:", syncError);
    }
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API endpoints available at http://localhost:${port}/api/`);
    });
    
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
