import React, { useState, useEffect } from "react";
import TeacherSidebar from "../sidebar/Teachersidebar";
import { getStudentsByClassApi, markAttendanceApi, getAttendanceByClassApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass();
    }
  }, [selectedClass]);

  // Fetch existing attendance when class and date are selected
  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchExistingAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchStudentsByClass = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getStudentsByClassApi(selectedClass);
      console.log("Students by class response:", response.data);
      
      const studentsData = response.data.students || [];
      setStudents(studentsData);
      
      // Initialize attendance state for all students
      const initialAttendance = {};
      studentsData.forEach(student => {
        initialAttendance[student.id] = false;
      });
      setAttendance(initialAttendance);
      
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students for this class.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await getAttendanceByClassApi(selectedClass, selectedDate);
      console.log("Existing attendance response:", response.data);
      
      const existingAttendance = {};
      const attendanceData = response.data.attendance || [];
      
      // Set existing attendance for students
      attendanceData.forEach(record => {
        existingAttendance[record.studentId] = record.isPresent;
      });
      
      // Initialize missing students as absent
      students.forEach(student => {
        if (existingAttendance[student.id] === undefined) {
          existingAttendance[student.id] = false;
        }
      });
      
      setAttendance(existingAttendance);
    } catch (err) {
      console.error("Error fetching existing attendance:", err);
      // If no existing attendance, initialize all as absent
      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student.id] = false;
      });
      setAttendance(initialAttendance);
    }
  };

  const handleCheckboxChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) {
      setError("Please select both class and date.");
      return;
    }

    if (!user || !user.id) {
      setError("User information is missing. Please login again.");
      return;
    }

    if (!students || students.length === 0) {
      setError("No students found for this class.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("Submitting attendance for class:", selectedClass, "date:", selectedDate);
      console.log("User data:", user);
      console.log("Students:", students);
      console.log("Attendance state:", attendance);

      // Submit attendance for each student
      const attendancePromises = students.map(student => {
        // Validate student data
        if (!student.id || !student.firstName || !student.lastName) {
          console.error("Invalid student data:", student);
          throw new Error(`Invalid student data for student: ${student.id}`);
        }

        const attendanceData = {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          className: selectedClass,
          date: selectedDate,
          isPresent: attendance[student.id] || false,
          teacherId: user.id,
          teacherName: user.name || user.firstName || user.email || "Unknown Teacher"
        };

        // Validate attendance data
        if (!attendanceData.studentId || !attendanceData.studentName || !attendanceData.className || 
            !attendanceData.date || attendanceData.teacherId === undefined || !attendanceData.teacherName) {
          console.error("Invalid attendance data:", attendanceData);
          throw new Error("Invalid attendance data");
        }

        console.log("Submitting attendance for student:", attendanceData);
        return markAttendanceApi(attendanceData);
      });

      await Promise.all(attendancePromises);
      setSuccess("Attendance submitted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error submitting attendance:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check your input.");
      } else {
        setError("Failed to submit attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="max-w-4xl mx-auto flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 ">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            ✅ Mark Attendance
          </h1>

          {/* Class and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-90 text-black border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a class</option>
                {availableClasses.map(className => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-90 text-black border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 text-green-600 p-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center text-black mb-4">
              <p>Loading...</p>
            </div>
          )}

          {/* Students List */}
          {selectedClass && students.length > 0 && (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-black mb-2">
                  Students in Class {selectedClass} - {selectedDate}
                </h2>
                <p className="text-black text-sm">
                  Total Students: {students.length}
                </p>
              </div>

              <table className="w-full text-left text-black border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    <th className="text-black px-4 py-2">Student Name</th>
                    <th className="text-black text-center">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <td className="px-4 py-3 rounded-l-lg">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="text-center rounded-r-lg">
                        <input
                          type="checkbox"
                          checked={attendance[student.id] || false}
                          onChange={() => handleCheckboxChange(student.id)}
                          className="form-checkbox h-5 w-5 text-green-600 accent-green-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-3 px-4 rounded-md transition font-semibold"
              >
                {loading ? "Submitting..." : "Submit Attendance"}
              </button>
            </>
          )}

          {/* No Students Message */}
          {selectedClass && !loading && students.length === 0 && (
            <div className="text-center text-black py-8">
              <p>No students found in Class {selectedClass}.</p>
            </div>
          )}

          {/* Select Class Message */}
          {!selectedClass && (
            <div className="text-center text-white py-8">
              <p>Please select a class to view students and mark attendance.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherAttendancePage;
