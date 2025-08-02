const jwt = require('jsonwebtoken');

// Test data generators
const TestUser = () => ({
  name: 'Test Admin',
  email: 'testadmin@example.com',
  password: 'testpassword123',
  role: 'admin'
});

const TestStudent = () => ({
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Test Street',
  class: '10',
  fatherName: 'Father Doe',
  motherName: 'Mother Doe',
  fatherContact: '1234567890',
  motherContact: '0987654321',
  gmail: 'john.doe@student.com',
  password: 'studentpass123'
});

const TestTeacher = () => ({
  name: 'Jane Smith',
  address: '456 Teacher Avenue',
  subject: 'Mathematics',
  qualification: 'MSc Mathematics',
  email: 'jane.smith@teacher.com',
  password: 'teacherpass123'
});

const generateTestAssignment = () => ({
  subject: 'Mathematics',
  title: 'Algebra Test',
  dueDate: '2024-12-31',
  description: 'Complete all algebra problems in Chapter 5'
});

// Generate JWT tokens for testing
const TestToken = (userData = {}) => {
  const defaultUser = {
    id: 1,
    email: 'test@example.com',
    role: 'admin'
  };
  
  const user = { ...defaultUser, ...userData };
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
};

// Mock request objects
const createMockRequest = (data = {}) => ({
  body: data.body || {},
  params: data.params || {},
  query: data.query || {},
  headers: {
    authorization: data.token ? `Bearer ${data.token}` : '',
    'content-type': 'application/json',
    ...data.headers
  },
  file: data.file || null
});

// Mock response objects
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Database helpers
const clearDatabase = async (sequelize) => {
  try {
    const models = sequelize.models;
    for (const modelName in models) {
      await models[modelName].destroy({ where: {}, force: true });
    }
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

const seedTestData = async (sequelize) => {
  try {
    const { User, Student, Teacher, Assignment } = sequelize.models;
    
    // Create test admin
    const admin = await User.create(TestUser());
    
    // Create test student
    const student = await Student.create(TestStudent());
    
    // Create test teacher
    const teacher = await Teacher.create(TestTeacher());
    
    // Create test assignment
    const assignment = await Assignment.create(generateTestAssignment());
    
    return { admin, student, teacher, assignment };
  } catch (error) {
    console.error('Error seeding test data:', error);
    return {};
  }
};

// Validation helpers
const expectValidationError = (response, field) => {
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining(field)
    })
  );
};

const expectSuccessResponse = (response, expectedData = {}) => {
  expect(response.status).toHaveBeenCalledWith(200);
  expect(response.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
      ...expectedData
    })
  );
};

// Simple test helpers
const expectErrorResponse = (response, statusCode, message) => {
  expect(response.status).toHaveBeenCalledWith(statusCode);
  if (message) {
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(message)
      })
    );
  }
};

module.exports = {
  TestUser,
  TestStudent,
  TestTeacher,
  generateTestAssignment,
  TestToken,
  createMockRequest,
  createMockResponse,
  clearDatabase,
  seedTestData,
  expectValidationError,
  expectSuccessResponse,
  expectErrorResponse
}; 