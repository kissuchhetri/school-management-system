const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Announcement = sequelize.define('announcement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING, // Usually 'admin'
    defaultValue: 'admin'
  }
}, {
  timestamps: true,
  tableName: 'announcements',
});

module.exports = Announcement;
