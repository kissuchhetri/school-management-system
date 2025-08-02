const Message = require('../model/messagemodel');
const Student = require('../model/studentmodel');
const User = require('../model/usermodel');

// Send message from student to admin
const sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const { user } = req; // From auth middleware

    if (!subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Subject and message are required" 
      });
    }

    // Fetch complete user data from database
    let userData = null;
    
    // Check if it's a student
    if (user.role === 'student') {
      userData = await Student.findByPk(user.id);
      if (!userData) {
        return res.status(404).json({ 
          success: false, 
          message: "Student not found" 
        });
      }
    } else {
      return res.status(403).json({ 
        success: false, 
        message: "Only students can send messages" 
      });
    }

    const newMessage = await Message.create({
      studentId: user.id,
      studentName: `${userData.firstName} ${userData.lastName}`,
      studentEmail: userData.gmail,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get messages by student (for students to see their own messages)
const getMessagesByStudent = async (req, res) => {
  try {
    const { user } = req; // From auth middleware

    // Verify it's a student
    if (user.role !== 'student') {
      return res.status(403).json({ 
        success: false, 
        message: "Only students can access their messages" 
      });
    }

    const messages = await Message.findAll({
      where: { studentId: user.id },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error("Get student messages error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Mark message as read (admin only)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    await message.update({ isRead: true });

    return res.status(200).json({
      success: true,
      message: "Message marked as read"
    });

  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Respond to message (admin only)
const respondToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ 
        success: false, 
        message: "Response is required" 
      });
    }

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    await message.update({ 
      adminResponse: response,
      respondedAt: new Date(),
      isRead: true
    });

    return res.status(200).json({
      success: true,
      message: "Response sent successfully"
    });

  } catch (error) {
    console.error("Respond to message error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get message count (admin only)
const getMessageCount = async (req, res) => {
  try {
    const totalMessages = await Message.count();
    const unreadMessages = await Message.count({ where: { isRead: false } });

    return res.status(200).json({
      success: true,
      data: {
        totalMessages,
        unreadMessages
      }
    });

  } catch (error) {
    console.error("Get message count error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessagesByStudent,
  markAsRead,
  respondToMessage,
  getMessageCount
}; 