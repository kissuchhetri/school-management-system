const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getAllMessages, 
  getMessagesByStudent, 
  markAsRead, 
  respondToMessage, 
  getMessageCount 
} = require('../controller/message');
const authGuard = require('../middleware/authguard');
const isAdmin = require('../middleware/isadmin');

// Student routes (require authentication)
router.post('/send', authGuard, sendMessage); // Students can send messages
router.get('/student', authGuard, getMessagesByStudent); // Students can view their own messages

// Admin routes (require admin authentication)
router.get('/all', authGuard, isAdmin, getAllMessages); // Admin can view all messages
router.get('/count', authGuard, isAdmin, getMessageCount); // Admin can get message count
router.put('/read/:id', authGuard, isAdmin, markAsRead); // Admin can mark as read
router.put('/respond/:id', authGuard, isAdmin, respondToMessage); // Admin can respond

module.exports = router; 