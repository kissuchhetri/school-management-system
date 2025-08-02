

require('dotenv').config();
const bcrypt = require('bcrypt');
const Teacher = require('../model/teachermodel'); // Adjust the path as needed

// ➤ CREATE Teacher (Admin Only)
const createTeacher = async (req, res) => {
  try {
    const {
      name,
      address,
      subject,
      qualification,
      email,
      password,
      role,  // optional, defaults to 'teacher'
    } = req.body;

    // Validate required fields except password (which is optional)
    if (!name || !address || !subject || !qualification || !email) {
      return res.status(400).json({ message: 'Name, address, subject, qualification, and email are required.' });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Use provided password or default password
    const plainPassword = password && password.trim() !== '' ? password : 'defaultPassword123';

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Optional photo (assumes multer file upload middleware)
    const photoPath = req.file ? req.file.path : null;

    // Create teacher record
    const newTeacher = await Teacher.create({
      name,
      address,
      subject,
      qualification,
      email,
      password: hashedPassword,
      photo: photoPath,
      role: role || 'teacher',
    });

    return res.status(201).json({
      message: 'Teacher created successfully.',
      teacher: {
        id: newTeacher.id,
        name: newTeacher.name,
        email: newTeacher.email,
        photo: newTeacher.photo,
        role: newTeacher.role,
      },
    });

  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ➤ GET All Teachers (Admin View)
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: { exclude: ['password'] }, // never expose password
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




// ➤ Controller to get total number of teachers
const getTeacherCount = async (req, res) => {
  try {
    const totalTeachers = await Teacher.count();
    return res.status(200).json({ totalTeachers });
  } catch (error) {
    console.error('Error counting teachers:', error);
    return res.status(500).json({ message: 'Failed to count teachers' });
  }
};


module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherCount
};


