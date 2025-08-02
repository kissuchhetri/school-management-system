const express = require('express');
const router = express.Router();
const { addAnnouncement, getAllAnnouncements, deleteAnnouncement } = require('../controller/announcement');

// Middleware to protect admin route (optional)
// const verifyAdmin = require('../middleware/verifyAdmin');

// Routes
router.post('/addannouncements', addAnnouncement); // Add announcement (admin)
// router.post('/announcements', verifyAdmin, addAnnouncement); // Secure with admin middleware

router.get('/getannouncements', getAllAnnouncements); // View for students/teachers

router.delete('/deleteannouncement/:id', deleteAnnouncement); // Delete announcement (admin)
// router.delete('/announcements/:id', verifyAdmin, deleteAnnouncement); // Secure with admin middleware

module.exports = router;
