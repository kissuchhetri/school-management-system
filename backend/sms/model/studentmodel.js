
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Student = sequelize.define('student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fatherName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motherName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fatherContact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 10],
      isNumeric: true
    }
  },
  motherContact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 10],
      isNumeric: true
    }
  },
  gmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // optional in form; will be defaulted in controller
    defaultValue: null
  },
  role: {
    type: DataTypes.ENUM('admin', 'teacher', 'student'),
    defaultValue: 'student'
  },
}, {
  timestamps: true,
  tableName: 'students'
});

module.exports = Student;
