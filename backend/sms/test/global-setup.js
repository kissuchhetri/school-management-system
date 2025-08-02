const { sequelize } = require('../database/db');

module.exports = async () => {
  console.log('🚀 Setting up global test environment...');
  
  try {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    
    // Connect to test database
    await sequelize.authenticate();
    console.log('✅ Test database connected');
    
    // Sync test database schema
    await sequelize.sync({ force: true });
    console.log('✅ Test database schema synced');
    
    console.log('✅ Global test setup completed');
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    throw error;
  }
}; 