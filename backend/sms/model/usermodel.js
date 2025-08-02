const { DataTypes } = require('sequelize');
const {sequelize} = require('../database/db');

const User = sequelize.define('user', 
{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps: true,
    tableName: 'users'  
});



//Define relationships if needed
// For example, if you have other models like Post, you can define associations here

// const user = require('./usermodel');
// user.hasMany(User, { foreignKey: 'userId' });
// Address.hasMany(User, { foreignKey: 'addressId' });
// user.belongsTo(Address, { foreignKey: 'addressId' });


module.exports = User;