// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const { addAssignment, getAllAssignments, deleteAssignment, markAttendance, getAttendanceByClass } = require("../controller/assingment");
const authGuard = require('../middleware/authguard');

// Test route to verify the assignment endpoint is working
router.get("/test", (req, res) => {
  res.status(200).json({ 
    message: "Assignment API is working!",
    timestamp: new Date().toISOString()
  });
});

// Assignment routes
router.post("/add", authGuard, addAssignment);
router.get("/all", authGuard, getAllAssignments);
router.delete("/delete/:id", authGuard, deleteAssignment);

// Attendance routes
router.post("/attendance/mark", authGuard, markAttendance);
router.get("/attendance/:className/:date", authGuard, getAttendanceByClass);

module.exports = router;
