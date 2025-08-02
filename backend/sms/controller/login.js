const User = require('../model/usermodel');
const Student = require('../model/studentmodel');
const Teacher = require('../model/teachermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const loginUser = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        let user = null;
        let userType = '';
        let userEmail = '';

        // Check User table
        user = await User.findOne({ where: { email } });
        if (user) {
            userType = user.role || 'admin';
            userEmail = user.email;
        }

        // Check Student table
        if (!user) {
            user = await Student.findOne({ where: { gmail: email } });
            if (user) {
                userType = user.role || 'student';
                userEmail = user.gmail;
            }
        }

        // Check Teacher table
        if (!user) {
            user = await Teacher.findOne({ where: { email } });
            if (user) {
                userType = 'teacher'; // No role field, so hardcoded
                userEmail = user.email;
            }
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: userEmail,
                role: userType,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Prepare user data based on user type
        let userData = {
            id: user.id,
            email: userEmail,
            role: userType,
        };

        // Add name field for teachers
        if (userType === 'teacher' && user.name) {
            userData.name = user.name;
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    loginUser
};

