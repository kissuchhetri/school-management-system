const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

console.log("Initializing Assignment model...");

const Assignment = sequelize.define('assignment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,  // Use DATEONLY for date without time
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'assignments',
});

console.log("Assignment model defined successfully");

// Attendance Model
console.log("Initializing Attendance model...");

const Attendance = sequelize.define('attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isPresent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teacherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'attendance',
});

console.log("Attendance model defined successfully");

module.exports = { Assignment, Attendance };
