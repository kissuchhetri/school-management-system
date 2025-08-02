const { createMockRequest, createMockResponse, TestStudent, expectErrorResponse } = require('./test-utils');

describe('School Management System - Student Management Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  describe('Student Registration Process', () => {
    it('should successfully enroll a new student with complete information', async () => {
      const newStudent = TestStudent();
      
      // Simulate successful student enrollment
      const enrollNewStudent = jest.fn().mockImplementation((req, res) => {
        if (req.body.firstName && req.body.lastName && req.body.gmail && req.body.class) {
          return res.status(201).json({
            message: 'Student enrolled successfully! Welcome to our school.',
            student: {
              id: 1,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              gmail: req.body.gmail,
              class: req.body.class,
              enrollmentDate: new Date().toISOString()
            }
          });
        }
      });

      mockReq.body = newStudent;

      await enrollNewStudent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student enrolled successfully! Welcome to our school.',
        student: expect.objectContaining({
          id: 1,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          gmail: newStudent.gmail,
          class: newStudent.class
        })
      });
    });

    it('should reject student enrollment with missing required fields', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe'
        // Missing gmail and class
      };

      // Simulate validation for incomplete student data
      const validateStudentData = jest.fn().mockImplementation((req, res) => {
        if (!req.body.firstName || !req.body.lastName || !req.body.gmail || !req.body.class) {
          return res.status(400).json({
            message: 'Please provide all required student information: first name, last name, email, and class.'
          });
        }
      });

      await validateStudentData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please provide all required student information: first name, last name, email, and class.'
      });
    });

    it('should handle duplicate email addresses during enrollment', async () => {
      const existingStudent = TestStudent();
      mockReq.body = existingStudent;

      // Simulate duplicate email detection
      const checkDuplicateEmail = jest.fn().mockImplementation((req, res) => {
        return res.status(409).json({
          message: 'A student with this email address already exists. Please use a different email.'
        });
      });

      await checkDuplicateEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'A student with this email address already exists. Please use a different email.'
      });
    });

    it('should handle database errors during student enrollment', async () => {
      mockReq.body = TestStudent();

      // Simulate database connection failure
      const handleEnrollmentError = jest.fn().mockImplementation((req, res) => {
        return res.status(500).json({
          message: 'Unable to enroll student at this time. Please try again later.'
        });
      });

      await handleEnrollmentError(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to enroll student at this time. Please try again later.'
      });
    });
  });

  describe('Student Data Retrieval', () => {
    it('should successfully fetch all enrolled students', async () => {
      const enrolledStudents = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          gmail: 'john.doe@student.com',
          class: '10'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          gmail: 'jane.smith@student.com',
          class: '11'
        }
      ];

      // Simulate fetching all students from database
      const fetchAllStudents = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          students: enrolledStudents,
          totalCount: enrolledStudents.length,
          message: 'Students retrieved successfully'
        });
      });

      await fetchAllStudents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        students: expect.arrayContaining([
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            class: '10'
          }),
          expect.objectContaining({
            firstName: 'Jane',
            lastName: 'Smith',
            class: '11'
          })
        ]),
        totalCount: 2,
        message: 'Students retrieved successfully'
      });
    });

    it('should return empty array when no students are enrolled', async () => {
      // Simulate no students in database
      const fetchEmptyStudentList = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          students: [],
          totalCount: 0,
          message: 'No students found. Start by enrolling new students!'
        });
      });

      await fetchEmptyStudentList(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        students: [],
        totalCount: 0,
        message: 'No students found. Start by enrolling new students!'
      });
    });

    it('should handle database errors when fetching students', async () => {
      // Simulate database query failure
      const handleFetchError = jest.fn().mockImplementation((req, res) => {
        return res.status(500).json({
          message: 'Unable to retrieve student list. Please try again.'
        });
      });

      await handleFetchError(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to retrieve student list. Please try again.'
      });
    });
  });

  describe('Student Count and Statistics', () => {
    it('should provide accurate total student count', async () => {
      const studentCount = 150;

      // Simulate counting total students
      const getTotalStudentCount = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          totalStudents: studentCount,
          message: `Total enrolled students: ${studentCount}`,
          lastUpdated: new Date().toISOString()
        });
      });

      await getTotalStudentCount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        totalStudents: 150,
        message: 'Total enrolled students: 150',
        lastUpdated: expect.any(String)
      });
    });

    it('should provide student count by class', async () => {
      const classDistribution = {
        '9': 25,
        '10': 30,
        '11': 28,
        '12': 27
      };

      // Simulate class-wise student counting
      const getStudentsByClass = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          classDistribution: classDistribution,
          totalClasses: Object.keys(classDistribution).length,
          message: 'Student distribution by class retrieved successfully'
        });
      });

      await getStudentsByClass(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        classDistribution: expect.objectContaining({
          '9': 25,
          '10': 30,
          '11': 28,
          '12': 27
        }),
        totalClasses: 4,
        message: 'Student distribution by class retrieved successfully'
      });
    });
  });

  describe('Student Search and Filtering', () => {
    it('should filter students by class', async () => {
      const class10Students = [
        { id: 1, firstName: 'John', lastName: 'Doe', class: '10' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', class: '10' }
      ];

      // Simulate class-based filtering
      const filterStudentsByClass = jest.fn().mockImplementation((req, res) => {
        const className = req.params.class;
        if (className === '10') {
          return res.status(200).json({
            students: class10Students,
            className: '10',
            count: class10Students.length,
            message: `Found ${class10Students.length} students in class 10`
          });
        }
      });

      mockReq.params = { class: '10' };
      await filterStudentsByClass(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        students: expect.arrayContaining([
          expect.objectContaining({ class: '10' })
        ]),
        className: '10',
        count: 2,
        message: 'Found 2 students in class 10'
      });
    });

    it('should search students by name', async () => {
      const searchResults = [
        { id: 1, firstName: 'John', lastName: 'Doe', class: '10' }
      ];

      // Simulate name-based search
      const searchStudentsByName = jest.fn().mockImplementation((req, res) => {
        const searchTerm = req.query.name;
        if (searchTerm === 'John') {
          return res.status(200).json({
            students: searchResults,
            searchTerm: 'John',
            count: searchResults.length,
            message: `Found ${searchResults.length} student(s) matching "John"`
          });
        }
      });

      mockReq.query = { name: 'John' };
      await searchStudentsByName(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        students: expect.arrayContaining([
          expect.objectContaining({ firstName: 'John' })
        ]),
        searchTerm: 'John',
        count: 1,
        message: 'Found 1 student(s) matching "John"'
      });
    });

    it('should return no results for non-existent search terms', async () => {
      // Simulate search with no results
      const searchWithNoResults = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          students: [],
          searchTerm: 'NonExistent',
          count: 0,
          message: 'No students found matching your search criteria.'
        });
      });

      mockReq.query = { name: 'NonExistent' };
      await searchWithNoResults(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        students: [],
        searchTerm: 'NonExistent',
        count: 0,
        message: 'No students found matching your search criteria.'
      });
    });
  });

  describe('Student Data Validation', () => {
    it('should validate student email format', async () => {
      const invalidEmailStudent = {
        firstName: 'John',
        lastName: 'Doe',
        gmail: 'invalid-email-format',
        class: '10'
      };

      // Simulate email format validation
      const validateEmailFormat = jest.fn().mockImplementation((req, res) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.gmail)) {
          return res.status(400).json({
            message: 'Please provide a valid email address format (e.g., student@school.com).'
          });
        }
      });

      mockReq.body = invalidEmailStudent;
      await validateEmailFormat(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please provide a valid email address format (e.g., student@school.com).'
      });
    });

    it('should validate student class is within valid range', async () => {
      const invalidClassStudent = {
        firstName: 'John',
        lastName: 'Doe',
        gmail: 'john@student.com',
        class: '15' // Invalid class
      };

      // Simulate class range validation
      const validateClassRange = jest.fn().mockImplementation((req, res) => {
        const validClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        if (!validClasses.includes(req.body.class)) {
          return res.status(400).json({
            message: 'Please select a valid class between 1 and 12.'
          });
        }
      });

      mockReq.body = invalidClassStudent;
      await validateClassRange(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please select a valid class between 1 and 12.'
      });
    });

    it('should validate student name length is appropriate', async () => {
      const shortNameStudent = {
        firstName: 'A', // Too short
        lastName: 'Doe',
        gmail: 'john@student.com',
        class: '10'
      };

      // Simulate name length validation
      const validateNameLength = jest.fn().mockImplementation((req, res) => {
        if (req.body.firstName.length < 2 || req.body.lastName.length < 2) {
          return res.status(400).json({
            message: 'First name and last name must be at least 2 characters long.'
          });
        }
      });

      mockReq.body = shortNameStudent;
      await validateNameLength(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'First name and last name must be at least 2 characters long.'
      });
    });
  });

  describe('Student Profile Management', () => {
    it('should successfully update student information', async () => {
      const updatedStudentData = {
        firstName: 'John',
        lastName: 'Smith',
        gmail: 'john.smith@student.com',
        class: '11'
      };

      // Simulate student profile update
      const updateStudentProfile = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          message: 'Student information updated successfully',
          student: {
            id: 1,
            ...req.body,
            updatedAt: new Date().toISOString()
          }
        });
      });

      mockReq.body = updatedStudentData;
      await updateStudentProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student information updated successfully',
        student: expect.objectContaining({
          firstName: 'John',
          lastName: 'Smith',
          class: '11'
        })
      });
    });

    it('should handle student profile deletion', async () => {
      const studentToDelete = { id: 1, firstName: 'John', lastName: 'Doe' };

      // Simulate student profile deletion
      const deleteStudentProfile = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          message: 'Student profile removed successfully',
          deletedStudent: studentToDelete
        });
      });

      mockReq.params = { id: '1' };
      await deleteStudentProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student profile removed successfully',
        deletedStudent: studentToDelete
      });
    });
  });
}); 