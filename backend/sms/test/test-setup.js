const { sequelize } = require('../database/db');
require('dotenv').config();

// Test database configuration
const testConfig = {
  database: 'SMS_TEST',
  username: 'root',
  password: 'soonya@123',
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable logging during tests
};

// Setup test environment
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  
  // Connect to test database
  try {
    await sequelize.authenticate();
    console.log('Test database connected successfully');
    
    // Sync test database schema
    await sequelize.sync({ force: true }); // Force recreate tables
    console.log('Test database schema synced');
  } catch (error) {
    console.error('Test database connection failed:', error);
    // Don't throw error, continue with tests
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

// Clean up data after each test
afterEach(async () => {
  try {
    // Clear all tables after each test
    const models = sequelize.models;
    for (const modelName in models) {
      await models[modelName].destroy({ where: {}, force: true });
    }
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
});

module.exports = {
  testConfig,
  sequelize
}; 