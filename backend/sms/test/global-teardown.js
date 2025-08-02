const { sequelize } = require('../database/db');

module.exports = async () => {
  console.log('🧹 Cleaning up global test environment...');
  
  try {
    // Close database connection
    await sequelize.close();
    console.log('✅ Test database connection closed');
    
    console.log('✅ Global test teardown completed');
  } catch (error) {
    console.error('❌ Global test teardown failed:', error);
    throw error;
  }
}; 