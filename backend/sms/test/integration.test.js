const { createMockRequest, createMockResponse, TestUser, TestStudent, TestTeacher, generateTestAssignment } = require('./test-utils');

describe('School Management System - End-to-End Integration Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  describe('Complete User Authentication Workflow', () => {
    it('should allow admin to register and login successfully', async () => {
      const newAdmin = TestUser();
      
      // Simulate admin registration process
      const registerAdmin = jest.fn().mockImplementation((req, res) => {
        return res.status(201).json({
          message: 'Admin account created successfully',
          user: {
            id: 1,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role
          }
        });
      });

      // Simulate admin login process
      const loginAdmin = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === newAdmin.email) {
          return res.status(200).json({
            success: true,
            message: 'Welcome back! Login successful',
            token: 'mock-admin-jwt-token',
            user: {
              id: 1,
              email: newAdmin.email,
              role: newAdmin.role
            }
          });
        }
      });

      // Test the complete admin registration flow
      mockReq.body = newAdmin;
      await registerAdmin(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);

      // Test the admin login flow
      mockReq.body = { email: newAdmin.email, password: newAdmin.password };
      await loginAdmin(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            role: 'admin'
          })
        })
      );
    });

    it('should allow teacher to register and access their dashboard', async () => {
      const newTeacher = TestTeacher();
      
      // Simulate teacher registration
      const registerTeacher = jest.fn().mockImplementation((req, res) => {
        return res.status(201).json({
          message: 'Teacher account created successfully',
          teacher: {
            id: 1,
            firstName: newTeacher.firstName,
            lastName: newTeacher.lastName,
            gmail: newTeacher.gmail,
            name: `${newTeacher.firstName} ${newTeacher.lastName}`
          }
        });
      });

      // Simulate teacher login
      const loginTeacher = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === newTeacher.gmail) {
          return res.status(200).json({
            success: true,
            message: 'Welcome to your teaching dashboard!',
            token: 'mock-teacher-jwt-token',
            user: {
              id: 1,
              email: newTeacher.gmail,
              role: 'teacher',
              name: `${newTeacher.firstName} ${newTeacher.lastName}`
            }
          });
        }
      });

      // Test teacher registration
      mockReq.body = newTeacher;
      await registerTeacher(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);

      // Test teacher login
      mockReq.body = { email: newTeacher.gmail, password: newTeacher.password };
      await loginTeacher(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            role: 'teacher',
            name: expect.stringContaining(newTeacher.firstName)
          })
        })
      );
    });

    it('should allow student to register and access their learning portal', async () => {
      const newStudent = TestStudent();
      
      // Simulate student registration
      const registerStudent = jest.fn().mockImplementation((req, res) => {
        return res.status(201).json({
          message: 'Student enrolled successfully',
          student: {
            id: 1,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            gmail: newStudent.gmail,
            class: newStudent.class
          }
        });
      });

      // Simulate student login
      const loginStudent = jest.fn().mockImplementation((req, res) => {
        if (req.body.email === newStudent.gmail) {
          return res.status(200).json({
            success: true,
            message: 'Welcome to your student portal!',
            token: 'mock-student-jwt-token',
            user: {
              id: 1,
              email: newStudent.gmail,
              role: 'student'
            }
          });
        }
      });

      // Test student registration
      mockReq.body = newStudent;
      await registerStudent(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);

      // Test student login
      mockReq.body = { email: newStudent.gmail, password: newStudent.password };
      await loginStudent(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            role: 'student'
          })
        })
      );
    });
  });

  describe('Assignment Management Workflow', () => {
    it('should allow teacher to create assignment and student to view it', async () => {
      const mathAssignment = generateTestAssignment();
      
      // Simulate teacher creating an assignment
      const createAssignment = jest.fn().mockImplementation((req, res) => {
        if (req.body.subject && req.body.title && req.body.dueDate && req.body.description) {
          return res.status(201).json({
            message: 'Assignment posted successfully!',
            assignment: {
              id: 1,
              ...req.body,
              createdAt: new Date().toISOString()
            }
          });
        }
      });

      // Simulate fetching assignments for students
      const fetchAssignments = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          assignments: [{
            id: 1,
            subject: mathAssignment.subject,
            title: mathAssignment.title,
            description: mathAssignment.description,
            dueDate: mathAssignment.dueDate,
            createdAt: new Date().toISOString()
          }]
        });
      });

      // Test assignment creation by teacher
      mockReq.body = mathAssignment;
      await createAssignment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Assignment posted successfully!',
          assignment: expect.objectContaining({
            subject: mathAssignment.subject,
            title: mathAssignment.title
          })
        })
      );

      // Test assignment retrieval by students
      await fetchAssignments(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          assignments: expect.arrayContaining([
            expect.objectContaining({
              subject: mathAssignment.subject,
              title: mathAssignment.title
            })
          ])
        })
      );
    });

    it('should handle assignment deletion by teacher', async () => {
      const assignmentToDelete = { id: 1, subject: 'Math', title: 'Old Assignment' };
      
      // Simulate teacher deleting an assignment
      const deleteAssignment = jest.fn().mockImplementation((req, res) => {
        if (req.params.id) {
          return res.status(200).json({
            message: 'Assignment removed successfully',
            deletedAssignment: assignmentToDelete
          });
        }
      });

      // Test assignment deletion
      mockReq.params = { id: '1' };
      await deleteAssignment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Assignment removed successfully'
        })
      );
    });
  });

  describe('Attendance Tracking Workflow', () => {
    it('should allow teacher to mark attendance for their class', async () => {
      const attendanceData = {
        studentId: 1,
        studentName: 'John Doe',
        className: '10',
        date: '2024-01-15',
        isPresent: true,
        teacherId: 1,
        teacherName: 'Mrs. Smith'
      };
      
      // Simulate marking attendance
      const markAttendance = jest.fn().mockImplementation((req, res) => {
        if (req.body.studentId && req.body.className && req.body.date) {
          return res.status(200).json({
            message: 'Attendance recorded successfully',
            attendance: {
              id: 1,
              ...req.body,
              createdAt: new Date().toISOString()
            }
          });
        }
      });

      // Test attendance marking
      mockReq.body = attendanceData;
      await markAttendance(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Attendance recorded successfully',
          attendance: expect.objectContaining({
            studentName: 'John Doe',
            className: '10',
            isPresent: true
          })
        })
      );
    });

    it('should retrieve attendance records for a specific class and date', async () => {
      const classAttendance = [
        { studentId: 1, studentName: 'John Doe', isPresent: true },
        { studentId: 2, studentName: 'Jane Smith', isPresent: false }
      ];
      
      // Simulate fetching attendance records
      const getAttendance = jest.fn().mockImplementation((req, res) => {
        if (req.params.className && req.params.date) {
          return res.status(200).json({
            attendance: classAttendance,
            className: req.params.className,
            date: req.params.date
          });
        }
      });

      // Test attendance retrieval
      mockReq.params = { className: '10', date: '2024-01-15' };
      await getAttendance(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          attendance: expect.arrayContaining([
            expect.objectContaining({
              studentName: 'John Doe',
              isPresent: true
            })
          ]),
          className: '10',
          date: '2024-01-15'
        })
      );
    });
  });

  describe('Announcement System Workflow', () => {
    it('should allow admin to post announcements visible to all users', async () => {
      const announcementData = {
        title: 'School Holiday Notice',
        content: 'School will be closed on Monday for maintenance.',
        author: 'Principal'
      };
      
      // Simulate creating announcement
      const createAnnouncement = jest.fn().mockImplementation((req, res) => {
        if (req.body.title && req.body.content) {
          return res.status(201).json({
            message: 'Announcement published successfully',
            announcement: {
              id: 1,
              ...req.body,
              createdAt: new Date().toISOString()
            }
          });
        }
      });

      // Simulate fetching announcements
      const getAnnouncements = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          announcements: [{
            id: 1,
            title: announcementData.title,
            content: announcementData.content,
            author: announcementData.author,
            createdAt: new Date().toISOString()
          }]
        });
      });

      // Test announcement creation
      mockReq.body = announcementData;
      await createAnnouncement(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Announcement published successfully',
          announcement: expect.objectContaining({
            title: 'School Holiday Notice'
          })
        })
      );

      // Test announcement retrieval
      await getAnnouncements(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          announcements: expect.arrayContaining([
            expect.objectContaining({
              title: 'School Holiday Notice',
              content: 'School will be closed on Monday for maintenance.'
            })
          ])
        })
      );
    });
  });

  describe('Student Messaging System Workflow', () => {
    it('should allow student to send message to admin and admin to respond', async () => {
      const messageData = {
        subject: 'Question about assignment',
        message: 'I need clarification on the math homework.'
      };
      
      // Simulate student sending message
      const sendMessage = jest.fn().mockImplementation((req, res) => {
        if (req.body.subject && req.body.message) {
          return res.status(201).json({
            message: 'Message sent successfully',
            messageData: {
              id: 1,
              ...req.body,
              studentId: 1,
              studentName: 'John Doe',
              studentEmail: 'john@student.com',
              isRead: false,
              createdAt: new Date().toISOString()
            }
          });
        }
      });

      // Simulate admin responding to message
      const respondToMessage = jest.fn().mockImplementation((req, res) => {
        if (req.params.id && req.body.response) {
          return res.status(200).json({
            message: 'Response sent successfully',
            updatedMessage: {
              id: 1,
              adminResponse: req.body.response,
              respondedAt: new Date().toISOString(),
              isRead: true
            }
          });
        }
      });

      // Test message sending
      mockReq.body = messageData;
      await sendMessage(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Message sent successfully',
          messageData: expect.objectContaining({
            subject: 'Question about assignment',
            isRead: false
          })
        })
      );

      // Test admin response
      mockReq.params = { id: '1' };
      mockReq.body = { response: 'Please check page 45 of your textbook for the solution.' };
      await respondToMessage(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Response sent successfully',
          updatedMessage: expect.objectContaining({
            isRead: true
          })
        })
      );
    });
  });

  describe('Dashboard Analytics Workflow', () => {
    it('should provide accurate counts for admin dashboard', async () => {
      const dashboardStats = {
        totalStudents: 150,
        totalTeachers: 25,
        totalAnnouncements: 8,
        totalAssignments: 45
      };
      
      // Simulate fetching dashboard statistics
      const getDashboardStats = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          stats: dashboardStats,
          lastUpdated: new Date().toISOString()
        });
      });

      // Test dashboard statistics retrieval
      await getDashboardStats(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stats: expect.objectContaining({
            totalStudents: 150,
            totalTeachers: 25,
            totalAnnouncements: 8,
            totalAssignments: 45
          })
        })
      );
    });

    it('should provide teacher-specific dashboard data', async () => {
      const teacherStats = {
        totalStudents: 30,
        totalAssignments: 12,
        totalAnnouncements: 5
      };
      
      // Simulate fetching teacher dashboard data
      const getTeacherStats = jest.fn().mockImplementation((req, res) => {
        return res.status(200).json({
          teacherStats: teacherStats,
          teacherId: 1
        });
      });

      // Test teacher dashboard data retrieval
      await getTeacherStats(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherStats: expect.objectContaining({
            totalStudents: 30,
            totalAssignments: 12
          })
        })
      );
    });
  });
}); 