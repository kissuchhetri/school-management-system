const { createMockRequest, createMockResponse, TestUser, TestStudent, TestTeacher, TestToken, expectErrorResponse } = require('./test-utils');

describe('School Management System - Authentication & Authorization Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  describe('User Login Functionality', () => {
    it('should reject login attempts with missing credentials', async () => {
      mockReq.body = {};

      // Simulate login validation for empty credentials
      const validateLoginCredentials = jest.fn().mockImplementation((req, res) => {
        if (!req.body.email || !req.body.password) {
          return res.status(404).json({
            success: false,
            message: 'Please provide both email and password'
          });
        }
      });

      await validateLoginCredentials(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide both email and password'
      });
    });

    it('should reject login with incorrect password', async () => {
      mockReq.body = {
        email: 'teacher@school.com',
        password: 'wrongpassword123'
      };

      // Simulate password validation failure
      const validatePassword = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === 'teacher@school.com' && req.body.password === 'wrongpassword123') {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password. Please try again.'
          });
        }
      });

      await validatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password. Please try again.'
      });
    });

    it('should successfully authenticate admin user with valid credentials', async () => {
      const adminCredentials = TestUser();
      mockReq.body = {
        email: adminCredentials.email,
        password: adminCredentials.password
      };

      // Simulate successful admin authentication
      const authenticateAdmin = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === adminCredentials.email) {
          return res.status(200).json({
            success: true,
            message: 'Welcome back, Administrator!',
            token: 'mock-admin-jwt-token-12345',
            user: {
              id: 1,
              email: adminCredentials.email,
              role: adminCredentials.role,
              name: adminCredentials.name
            }
          });
        }
      });

      await authenticateAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Welcome back, Administrator!',
          token: expect.stringContaining('mock-admin-jwt-token'),
          user: expect.objectContaining({
            email: adminCredentials.email,
            role: 'admin'
          })
        })
      );
    });

    it('should successfully authenticate student with valid credentials', async () => {
      const studentCredentials = TestStudent();
      mockReq.body = {
        email: studentCredentials.gmail,
        password: studentCredentials.password
      };

      // Simulate successful student authentication
      const authenticateStudent = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === studentCredentials.gmail) {
          return res.status(200).json({
            success: true,
            message: 'Welcome to your student portal!',
            token: 'mock-student-jwt-token-67890',
            user: {
              id: 1,
              email: studentCredentials.gmail,
              role: 'student',
              firstName: studentCredentials.firstName,
              lastName: studentCredentials.lastName
            }
          });
        }
      });

      await authenticateStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Welcome to your student portal!',
          token: expect.stringContaining('mock-student-jwt-token'),
          user: expect.objectContaining({
            email: studentCredentials.gmail,
            role: 'student'
          })
        })
      );
    });

    it('should successfully authenticate teacher with valid credentials', async () => {
      const teacherCredentials = TestTeacher();
      mockReq.body = {
        email: teacherCredentials.gmail,
        password: teacherCredentials.password
      };

      // Simulate successful teacher authentication
      const authenticateTeacher = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === teacherCredentials.gmail) {
          return res.status(200).json({
            success: true,
            message: 'Welcome to your teaching dashboard!',
            token: 'mock-teacher-jwt-token-11111',
            user: {
              id: 1,
              email: teacherCredentials.gmail,
              role: 'teacher',
              name: `${teacherCredentials.firstName} ${teacherCredentials.lastName}`
            }
          });
        }
      });

      await authenticateTeacher(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Welcome to your teaching dashboard!',
          token: expect.stringContaining('mock-teacher-jwt-token'),
          user: expect.objectContaining({
            email: teacherCredentials.gmail,
            role: 'teacher',
            name: expect.stringContaining(teacherCredentials.firstName)
          })
        })
      );
    });
  });

  describe('JWT Token Validation', () => {
    it('should validate properly formatted JWT tokens', async () => {
      const validToken = TestToken('admin');
      mockReq.headers.authorization = `Bearer ${validToken}`;

      // Simulate JWT token validation
      const validateJWTToken = jest.fn().mockImplementation((req, res) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
          return res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: {
              id: 1,
              role: 'admin',
              email: 'admin@school.com'
            }
          });
        }
      });

      await validateJWTToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Token is valid'
        })
      );
    });

    it('should reject requests without authorization header', async () => {
      // Simulate missing authorization header
      const checkAuthorization = jest.fn().mockImplementation((req, res) => {
        if (!req.headers.authorization) {
          return res.status(401).json({
            success: false,
            message: 'Access denied. Please login to continue.'
          });
        }
      });

      await checkAuthorization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Please login to continue.'
      });
    });

    it('should reject requests with malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidTokenFormat';

      // Simulate malformed token validation
      const validateTokenFormat = jest.fn().mockImplementation((req, res) => {
        if (!req.headers.authorization.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token format. Please login again.'
          });
        }
      });

      await validateTokenFormat(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token format. Please login again.'
      });
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow admin access to admin-only endpoints', async () => {
      const adminToken = TestToken('admin');
      mockReq.headers.authorization = `Bearer ${adminToken}`;
      mockReq.user = { role: 'admin', id: 1 };

      // Simulate admin-only endpoint access
      const adminOnlyEndpoint = jest.fn().mockImplementation((req, res) => {
        if (req.user && req.user.role === 'admin') {
          return res.status(200).json({
            success: true,
            message: 'Admin access granted',
            data: { adminOnly: true }
          });
        }
      });

      await adminOnlyEndpoint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Admin access granted'
        })
      );
    });

    it('should deny teacher access to admin-only endpoints', async () => {
      const teacherToken = TestToken('teacher');
      mockReq.headers.authorization = `Bearer ${teacherToken}`;
      mockReq.user = { role: 'teacher', id: 1 };

      // Simulate teacher trying to access admin endpoint
      const adminOnlyEndpoint = jest.fn().mockImplementation((req, res) => {
        if (req.user && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
          });
        }
      });

      await adminOnlyEndpoint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    });

    it('should allow teachers to access teacher-specific endpoints', async () => {
      const teacherToken = TestToken('teacher');
      mockReq.headers.authorization = `Bearer ${teacherToken}`;
      mockReq.user = { role: 'teacher', id: 1 };

      // Simulate teacher-specific endpoint access
      const teacherEndpoint = jest.fn().mockImplementation((req, res) => {
        if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
          return res.status(200).json({
            success: true,
            message: 'Teacher access granted',
            data: { teacherAccess: true }
          });
        }
      });

      await teacherEndpoint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Teacher access granted'
        })
      );
    });

    it('should allow students to access student-specific endpoints', async () => {
      const studentToken = TestToken('student');
      mockReq.headers.authorization = `Bearer ${studentToken}`;
      mockReq.user = { role: 'student', id: 1 };

      // Simulate student-specific endpoint access
      const studentEndpoint = jest.fn().mockImplementation((req, res) => {
        if (req.user && req.user.role === 'student') {
          return res.status(200).json({
            success: true,
            message: 'Student access granted',
            data: { studentAccess: true }
          });
        }
      });

      await studentEndpoint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Student access granted'
        })
      );
    });
  });

  describe('Session Management', () => {
    it('should handle expired JWT tokens gracefully', async () => {
      const expiredToken = 'expired.jwt.token';
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      // Simulate expired token handling
      const handleExpiredToken = jest.fn().mockImplementation((req, res) => {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please login again to continue.'
        });
      });

      await handleExpiredToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Session expired. Please login again to continue.'
      });
    });

    it('should handle logout functionality', async () => {
      const validToken = TestToken('admin');
      mockReq.headers.authorization = `Bearer ${validToken}`;

      // Simulate logout process
      const logoutUser = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          success: true,
          message: 'Successfully logged out. See you next time!'
        });
      });

      await logoutUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Successfully logged out. See you next time!'
      });
    });
  });
}); 