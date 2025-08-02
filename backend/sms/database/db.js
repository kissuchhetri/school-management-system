const {Sequelize} = require('sequelize');
require("dotenv").config();

const istestEnviroment = process.env.NODE_ENV === 'test';
//istestEnviroment ? "test" :
console.log(`Running in ${istestEnviroment ? 'test' : 'Development'} mode.`);
const sequelize = new Sequelize("SMS",'root','soonya@123', {
    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    logging: true, //true
});


const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log("database connected successfully");
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return false;
    }
};

module.exports = { sequelize, connectDB };

