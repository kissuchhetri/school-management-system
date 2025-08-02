# Backend Testing Suite

This directory contains comprehensive tests for the School Management System backend API.

## 📁 Test Structure

```
test/
├── README.md                 # This file
├── jest.config.js           # Jest configuration
├── test-setup.js            # Test environment setup
├── test-utils.js            # Common test utilities and helpers
├── global-setup.js          # Global test setup
├── global-teardown.js       # Global test cleanup
├── auth.test.js             # Authentication tests
├── assignment.test.js       # Assignment management tests
├── student.test.js          # Student management tests
└── integration.test.js      # Integration tests
```

## 🚀 Running Tests

### Prerequisites
- Node.js installed
- MySQL database running
- Environment variables configured

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suites
npm run test:auth          # Authentication tests only
npm run test:assignment    # Assignment tests only
npm run test:student       # Student tests only
npm run test:integration   # Integration tests only

# Run unit tests (excluding integration)
npm run test:unit
```

## 🧪 Test Categories

### 1. Unit Tests
- **auth.test.js**: Tests for login functionality
- **assignment.test.js**: Tests for assignment CRUD operations
- **student.test.js**: Tests for student management

### 2. Integration Tests
- **integration.test.js**: End-to-end API testing
- Tests complete workflows
- Database integration testing
- Authentication flow testing

## 🛠️ Test Utilities

### Test Data Generators
```javascript
const {
  generateTestUser,
  generateTestStudent,
  generateTestTeacher,
  generateTestAssignment
} = require('./test-utils');
```

### Mock Helpers
```javascript
const {
  createMockRequest,
  createMockResponse,
  generateTestToken
} = require('./test-utils');
```

### Database Helpers
```javascript
const {
  clearDatabase,
  seedTestData
} = require('./test-utils');
```

## 📊 Coverage

Tests cover:
- ✅ Authentication (login for all user types)
- ✅ Assignment CRUD operations
- ✅ Student management
- ✅ Error handling
- ✅ Input validation
- ✅ Database operations
- ✅ API endpoints
- ✅ Middleware functionality

## 🔧 Configuration

### Jest Configuration
- **Environment**: Node.js
- **Coverage**: 70% minimum threshold
- **Timeout**: 10 seconds per test
- **Database**: Separate test database

### Test Database
- **Database**: SMS_TEST
- **Auto-cleanup**: After each test
- **Schema**: Auto-synced before tests

## 🐛 Debugging Tests

### Enable Debug Logging
```bash
DEBUG=* npm test
```

### Run Single Test
```bash
npm test -- --testNamePattern="should login admin user successfully"
```

### Run Tests with Verbose Output
```bash
npm test -- --verbose
```

## 📝 Writing New Tests

### 1. Create Test File
```javascript
const { createMockRequest, createMockResponse } = require('./test-utils');

describe('Your Feature Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  it('should do something', async () => {
    // Your test logic here
  });
});
```

### 2. Use Test Utilities
```javascript
// Generate test data
const testData = generateTestUser();

// Create mock request
const req = createMockRequest({
  body: testData,
  token: generateTestToken()
});

// Create mock response
const res = createMockResponse();
```

### 3. Test Patterns
```javascript
// Success case
expect(mockRes.status).toHaveBeenCalledWith(200);
expect(mockRes.json).toHaveBeenCalledWith(
  expect.objectContaining({
    success: true
  })
);

// Error case
expect(mockRes.status).toHaveBeenCalledWith(400);
expect(mockRes.json).toHaveBeenCalledWith(
  expect.objectContaining({
    message: expect.stringContaining('required')
  })
);
```

## 🔒 Environment Variables

Required for testing:
```env
NODE_ENV=test
JWT_SECRET=test-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASS=soonya@123
DB_NAME=SMS_TEST
```

## 📈 Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Mocking**: Mock external dependencies
4. **Descriptive**: Use clear test descriptions
5. **Coverage**: Aim for high test coverage
6. **Performance**: Keep tests fast and efficient

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify database credentials
   - Ensure test database exists

2. **Tests Timing Out**
   - Increase timeout in jest.config.js
   - Check for hanging database connections

3. **Mock Issues**
   - Clear mocks between tests
   - Use proper mock setup/teardown

### Getting Help
- Check test logs for detailed error messages
- Use `--verbose` flag for more output
- Review Jest documentation for advanced features 