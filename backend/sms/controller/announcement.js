const Announcement = require('../model/announcementmodel');

// Add Announcement
const addAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: 'admin' 
    });

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement
    });

  } catch (error) {
    console.error("Add Announcement Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all announcements (visible to students & teachers)
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: announcements
    });

  } catch (error) {
    console.error("Get Announcements Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Announcement
const deleteAnnouncement = async (req, res) => {
  console.log('Delete announcement request received:', req.params);
  try {
    const { id } = req.params;

    if (!id) {
      console.log('No ID provided in request');
      return res.status(400).json({ success: false, message: "Announcement ID is required" });
    }

    console.log('Attempting to delete announcement with ID:', id);

    // Check if announcement exists
    const announcement = await Announcement.findByPk(id);
    
    if (!announcement) {
      console.log('Announcement not found with ID:', id);
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    console.log('Found announcement:', announcement.title);

    // Delete the announcement
    await announcement.destroy();
    console.log('Announcement deleted successfully');

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully"
    });

  } catch (error) {
    console.error("Delete Announcement Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement
};
