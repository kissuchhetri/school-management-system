// // models/teacher.js
// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../database/db'); // Adjust path as needed

// const Teacher = sequelize.define('teacher', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   address: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   subject: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   qualification: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true,
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false, // hashed password must always be present
//   },
// }, {
//   timestamps: true,
//   tableName: 'teachers',
// });

// module.exports = Teacher;



// models/teacher.js


// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../database/db'); // Adjust path as needed

// const Teacher = sequelize.define('teacher', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   address: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   subject: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   qualification: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true,
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false, // hashed password must always be present
//   },
//   photo: {
//     type: DataTypes.STRING,  // stores file path or URL
//     allowNull: true,         // optional
//   },
// }, {
//   timestamps: true,
//   tableName: 'teachers',
// });

// module.exports = Teacher;




// const User = require('../model/usermodel');
// const Student = require('../model/studentmodel');
// const Teacher = require('../model/teachermodel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require("dotenv").config();

// const loginUser = async (req, res) => {
//     console.log(req.body);
//     try {
//         const { email, password } = req.body;

//         let user = null;
//         let userType = '';
//         let userEmail = '';

//         // Check User table
//         user = await User.findOne({ where: { email } });
//         if (user) {
//             userType = user.role || 'admin';
//             userEmail = user.email;
//         }

//         // Check Student table
//         if (!user) {
//             user = await Student.findOne({ where: { gmail: email } });
//             if (user) {
//                 userType = user.role || 'student';
//                 userEmail = user.gmail;
//             }
//         }

//         // Check Teacher table
//         if (!user) {
//             user = await Teacher.findOne({ where: { email } });
//             if (user) {
//                 userType = 'teacher'; // assuming role isn't defined in Teacher model
//                 userEmail = user.email;
//             }
//         }

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         const token = jwt.sign(
//             {
//                 id: user.id,
//                 email: userEmail,
//                 role: userType,
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         return res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             token,
//             user: {
//                 id: user.id,
//                 email: userEmail,
//                 role: userType,
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

// module.exports = {
//     loginUser
// };


const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db'); // Adjust the path as needed

const Teacher = sequelize.define('teacher', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  photo: {
    type: DataTypes.STRING, // path to uploaded photo
    allowNull: true,
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'teacher', // default role
  },
}, {
  timestamps: true,
  tableName: 'teachers',
});

module.exports = Teacher;


