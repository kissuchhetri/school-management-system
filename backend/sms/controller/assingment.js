const { Assignment, Attendance } = require("../model/assingment");

exports.addAssignment = async (req, res) => {
  try {
    console.log("Adding assignment - Request body:", req.body);
    const { subject, title, dueDate, description } = req.body;

    // Validate required fields
    if (!subject || !title || !dueDate || !description) {
      console.log("Validation failed - missing fields:", { subject, title, dueDate, description });
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log("Creating assignment with data:", { subject, title, dueDate, description });
    const newAssignment = await Assignment.create({
      subject,
      title,
      dueDate,
      description,
    });

    console.log("Assignment created successfully:", newAssignment.toJSON());
    res.status(201).json({ 
      message: "Assignment added successfully.",
      assignment: newAssignment
    });
  } catch (error) {
    console.error("Add assignment error:", error);
    res.status(500).json({ message: "Server error adding assignment." });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    console.log("Fetching all assignments...");
    const assignments = await Assignment.findAll({
      order: [['dueDate', 'ASC']] // sorted by due date ascending
    });
    
    console.log(`Found ${assignments.length} assignments:`, assignments.map(a => a.toJSON()));
    res.status(200).json({ assignments });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ message: "Server error fetching assignments." });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting assignment with ID:", id);

    if (!id) {
      return res.status(400).json({ message: "Assignment ID is required." });
    }

    const assignment = await Assignment.findByPk(id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    await assignment.destroy();
    console.log("Assignment deleted successfully");
    
    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ message: "Server error deleting assignment." });
  }
};

// Attendance functions
exports.markAttendance = async (req, res) => {
  try {
    console.log("Marking attendance - Request body:", req.body);
    const { studentId, studentName, className, date, isPresent, teacherId, teacherName } = req.body;

    // Validate required fields
    if (!studentId || !studentName || !className || !date || teacherId === undefined || !teacherName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      where: {
        studentId,
        date,
        className
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      await existingAttendance.update({
        isPresent,
        teacherId,
        teacherName
      });
      console.log("Attendance updated successfully");
    } else {
      // Create new attendance record
      await Attendance.create({
        studentId,
        studentName,
        className,
        date,
        isPresent,
        teacherId,
        teacherName
      });
      console.log("Attendance marked successfully");
    }

    res.status(200).json({ message: "Attendance marked successfully." });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ message: "Server error marking attendance." });
  }
};

exports.getAttendanceByClass = async (req, res) => {
  try {
    const { className, date } = req.params;
    
    if (!className || !date) {
      return res.status(400).json({ message: "Class and date parameters are required." });
    }

    const attendance = await Attendance.findAll({
      where: {
        className,
        date
      },
      order: [['studentName', 'ASC']]
    });

    res.status(200).json({ 
      attendance,
      className,
      date,
      count: attendance.length
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ message: "Server error fetching attendance." });
  }
};
