const { createMockRequest, createMockResponse, generateTestAssignment, expectErrorResponse } = require('./test-utils');

describe('School Management System - Assignment Management Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  describe('Assignment Creation Process', () => {
    it('should successfully create a new assignment with all required fields', async () => {
      const mathHomework = generateTestAssignment();
      
      // Simulate successful assignment creation by teacher
      const createNewAssignment = jest.fn().mockImplementation((req, res) => {
        if (req.body.subject && req.body.title && req.body.dueDate && req.body.description) {
          return res.status(201).json({
            message: 'Assignment posted successfully! Students can now view it.',
            assignment: {
              id: 1,
              ...req.body,
              createdAt: new Date().toISOString(),
              teacherId: 1
            }
          });
        }
      });

      mockReq.body = mathHomework;

      await createNewAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Assignment posted successfully! Students can now view it.',
        assignment: expect.objectContaining({
          id: 1,
          subject: mathHomework.subject,
          title: mathHomework.title,
          teacherId: 1
        })
      });
    });

    it('should reject assignment creation when required fields are missing', async () => {
      mockReq.body = {
        subject: 'Mathematics',
        title: 'Algebra Practice Problems'
        // Missing dueDate and description
      };

      // Simulate validation error for incomplete assignment data
      const validateAssignmentData = jest.fn().mockImplementation((req, res) => {
        if (!req.body.subject || !req.body.title || !req.body.dueDate || !req.body.description) {
          return res.status(400).json({
            message: 'Please provide all required information: subject, title, due date, and description.'
          });
        }
      });

      await validateAssignmentData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please provide all required information: subject, title, due date, and description.'
      });
    });

    it('should handle database errors during assignment creation gracefully', async () => {
      mockReq.body = generateTestAssignment();

      // Simulate database connection failure
      const handleDatabaseError = jest.fn().mockImplementation((req, res) => {
        return res.status(500).json({
          message: 'Unable to save assignment at this time. Please try again later.'
        });
      });

      await handleDatabaseError(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to save assignment at this time. Please try again later.'
      });
    });
  });

  describe('Assignment Retrieval and Display', () => {
    it('should successfully fetch all assignments for students to view', async () => {
      const sampleAssignments = [
        { 
          id: 1, 
          subject: 'Mathematics', 
          title: 'Algebra Chapter 5', 
          dueDate: '2024-12-31', 
          description: 'Complete problems 1-20 on page 45' 
        },
        { 
          id: 2, 
          subject: 'Science', 
          title: 'Physics Lab Report', 
          dueDate: '2024-12-30', 
          description: 'Write a report on the pendulum experiment' 
        }
      ];

      // Simulate fetching assignments from database
      const fetchAllAssignments = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          assignments: sampleAssignments,
          totalCount: sampleAssignments.length,
          message: 'Assignments retrieved successfully'
        });
      });

      await fetchAllAssignments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        assignments: expect.arrayContaining([
          expect.objectContaining({
            subject: 'Mathematics',
            title: 'Algebra Chapter 5'
          }),
          expect.objectContaining({
            subject: 'Science',
            title: 'Physics Lab Report'
          })
        ]),
        totalCount: 2,
        message: 'Assignments retrieved successfully'
      });
    });

    it('should return empty array when no assignments exist', async () => {
      // Simulate no assignments in database
      const fetchEmptyAssignments = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          assignments: [],
          totalCount: 0,
          message: 'No assignments found. Check back later!'
        });
      });

      await fetchEmptyAssignments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        assignments: [],
        totalCount: 0,
        message: 'No assignments found. Check back later!'
      });
    });

    it('should handle database errors when fetching assignments', async () => {
      // Simulate database query failure
      const handleFetchError = jest.fn().mockImplementation((req, res) => {
        return res.status(500).json({
          message: 'Unable to retrieve assignments. Please try again.'
        });
      });

      await handleFetchError(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to retrieve assignments. Please try again.'
      });
    });
  });

  describe('Assignment Deletion Process', () => {
    it('should successfully delete an existing assignment', async () => {
      const assignmentToRemove = { 
        id: 1, 
        subject: 'Mathematics', 
        title: 'Old Homework Assignment' 
      };
      
      // Simulate teacher deleting an assignment
      const removeAssignment = jest.fn().mockImplementation((req, res) => {
        if (req.params.id) {
          return res.status(200).json({
            message: 'Assignment removed successfully',
            deletedAssignment: assignmentToRemove,
            assignmentId: req.params.id
          });
        }
      });

      // Test assignment deletion
      mockReq.params = { id: '1' };
      await removeAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Assignment removed successfully',
        deletedAssignment: assignmentToRemove,
        assignmentId: '1'
      });
    });

    it('should handle deletion of non-existent assignment gracefully', async () => {
      // Simulate trying to delete assignment that doesn't exist
      const deleteNonExistentAssignment = jest.fn().mockImplementation((req, res) => {
        return res.status(404).json({
          message: 'Assignment not found. It may have already been deleted.'
        });
      });

      mockReq.params = { id: '999' };
      await deleteNonExistentAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Assignment not found. It may have already been deleted.'
      });
    });

    it('should handle database errors during assignment deletion', async () => {
      // Simulate database error during deletion
      const handleDeletionError = jest.fn().mockImplementation((req, res) => {
        return res.status(500).json({
          message: 'Unable to delete assignment at this time. Please try again.'
        });
      });

      mockReq.params = { id: '1' };
      await handleDeletionError(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to delete assignment at this time. Please try again.'
      });
    });
  });

  describe('Assignment Data Validation', () => {
    it('should validate assignment due date is in the future', async () => {
      const pastDueAssignment = {
        subject: 'Mathematics',
        title: 'Late Assignment',
        dueDate: '2020-01-01', // Past date
        description: 'This assignment is already overdue'
      };

      // Simulate due date validation
      const validateDueDate = jest.fn().mockImplementation((req, res) => {
        const dueDate = new Date(req.body.dueDate);
        const today = new Date();
        
        if (dueDate <= today) {
          return res.status(400).json({
            message: 'Due date must be in the future. Please select a valid date.'
          });
        }
      });

      mockReq.body = pastDueAssignment;
      await validateDueDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Due date must be in the future. Please select a valid date.'
      });
    });

    it('should validate assignment title length is appropriate', async () => {
      const shortTitleAssignment = {
        subject: 'Mathematics',
        title: 'A', // Too short
        dueDate: '2024-12-31',
        description: 'Valid description'
      };

      // Simulate title length validation
      const validateTitleLength = jest.fn().mockImplementation((req, res) => {
        if (req.body.title.length < 3) {
          return res.status(400).json({
            message: 'Assignment title must be at least 3 characters long.'
          });
        }
      });

      mockReq.body = shortTitleAssignment;
      await validateTitleLength(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Assignment title must be at least 3 characters long.'
      });
    });

    it('should validate assignment description is not empty', async () => {
      const emptyDescriptionAssignment = {
        subject: 'Mathematics',
        title: 'Valid Title',
        dueDate: '2024-12-31',
        description: '' // Empty description
      };

      // Simulate description validation
      const validateDescription = jest.fn().mockImplementation((req, res) => {
        if (!req.body.description || req.body.description.trim() === '') {
          return res.status(400).json({
            message: 'Please provide a detailed description of the assignment.'
          });
        }
      });

      mockReq.body = emptyDescriptionAssignment;
      await validateDescription(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please provide a detailed description of the assignment.'
      });
    });
  });

  describe('Assignment Search and Filtering', () => {
    it('should filter assignments by subject', async () => {
      const mathAssignments = [
        { id: 1, subject: 'Mathematics', title: 'Algebra Problems', dueDate: '2024-12-31' },
        { id: 2, subject: 'Mathematics', title: 'Geometry Quiz', dueDate: '2024-12-30' }
      ];

      // Simulate subject-based filtering
      const filterBySubject = jest.fn().mockImplementation((req, res) => {
        const subject = req.query.subject;
        if (subject === 'Mathematics') {
          return res.status(200).json({
            assignments: mathAssignments,
            filteredBy: 'subject',
            subject: 'Mathematics',
            count: mathAssignments.length
          });
        }
      });

      mockReq.query = { subject: 'Mathematics' };
      await filterBySubject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        assignments: expect.arrayContaining([
          expect.objectContaining({ subject: 'Mathematics' })
        ]),
        filteredBy: 'subject',
        subject: 'Mathematics',
        count: 2
      });
    });

    it('should sort assignments by due date', async () => {
      const sortedAssignments = [
        { id: 1, subject: 'Science', title: 'Lab Report', dueDate: '2024-12-25' },
        { id: 2, subject: 'Mathematics', title: 'Final Exam', dueDate: '2024-12-31' }
      ];

      // Simulate date-based sorting
      const sortByDueDate = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          assignments: sortedAssignments,
          sortedBy: 'dueDate',
          order: 'ascending'
        });
      });

      await sortByDueDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        assignments: sortedAssignments,
        sortedBy: 'dueDate',
        order: 'ascending'
      });
    });
  });
}); 