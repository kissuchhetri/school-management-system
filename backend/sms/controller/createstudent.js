require("dotenv").config();
const bcrypt = require('bcrypt');
const Student = require('../model/studentmodel'); // Sequelize model
const { get } = require("../router/userroute");

// CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      class: studentClass,
      fatherName,
      motherName,
      fatherContact,
      motherContact,
      gmail,
      password,
    } = req.body;

    // Validation
    if (
      !firstName || !lastName || !address || !studentClass || !fatherName ||
      !motherName || !fatherContact || !motherContact || !gmail
    ) {
      return res.status(400).json({ message: 'All fields except password are required.' });
    }

    // Check if gmail already exists
    const existingStudent = await Student.findOne({ where: { gmail } });
    if (existingStudent) {
      return res.status(409).json({ message: 'Gmail already in use.' });
    }

    // Default password fallback
    const plainPassword = password && password.trim() !== "" ? password : "password";

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Save student to DB
    const newStudent = await Student.create({
      firstName,
      lastName,
      address,
      class: studentClass,
      fatherName,
      motherName,
      fatherContact,
      motherContact,
      gmail,
      password: hashedPassword,
    });

    // Respond
    res.status(201).json({
      message: 'Student created successfully.',
      student: {
        id: newStudent.id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        gmail: newStudent.gmail,
      },
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ['password'] }, // Exclude sensitive info
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET STUDENTS BY CLASS (for attendance)
const getStudentsByClass = async (req, res) => {
  try {
    const { class: studentClass } = req.params;
    
    if (!studentClass) {
      return res.status(400).json({ message: 'Class parameter is required.' });
    }

    const students = await Student.findAll({
      where: { class: studentClass },
      attributes: ['id', 'firstName', 'lastName', 'class', 'gmail'],
      order: [['firstName', 'ASC']]
    });

    res.status(200).json({ 
      students,
      class: studentClass,
      count: students.length
    });
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStudentCount = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    return res.status(200).json({ totalStudents });
  } catch (error) {
    console.error('Error counting students:', error);
    return res.status(500).json({ message: 'Failed to count students' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentCount
};

