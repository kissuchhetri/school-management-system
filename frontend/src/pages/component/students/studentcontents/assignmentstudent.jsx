import React, { useEffect, useState } from "react";
import StudentSidebar from "../../sidebar/Studentsidebar";
import { FaBookOpen, FaClipboardList, FaUserCheck, FaBullhorn } from "react-icons/fa";
import { getAllAssignmentsApi } from "../../../../api/api"; // adjust path if needed
import dayjs from "dayjs"; // optional, for nice date formatting

const StudentAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      console.log("Fetching assignments for student...");
      console.log("Token from localStorage:", localStorage.getItem('token'));
      
      const res = await getAllAssignmentsApi();
      console.log("Student assignments API response:", res);
      console.log("Student assignments data:", res.data);
      
      // Handle different possible response structures
      let assignmentsData = [];
      if (res.data && res.data.assignments) {
        assignmentsData = res.data.assignments;
      } else if (res.data && Array.isArray(res.data)) {
        assignmentsData = res.data;
      } else if (Array.isArray(res.data)) {
        assignmentsData = res.data;
      }
      
      console.log("Processed assignments for student:", assignmentsData);
      setAssignments(assignmentsData || []);
      setError("");
    } catch (err) {
      console.error("Error fetching assignments for student:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Assignments endpoint not found. Check API configuration.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR') {
        setError("Network error. Check your connection and backend server.");
      } else {
        setError(`Failed to load assignments: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Your Assignments 📚</h1>
          <p className="text-white text-sm mt-1">
            Stay on top of your assignments and due dates.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-white">
            <p>Loading assignments...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 mb-6">
            <p>{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center text-white">
            <p>No assignments found.</p>
          </div>
        ) : (
          <ul className="space-y-6 max-w-4xl mx-auto">
            {assignments.map((assignment) => {
              // Debug: Log each assignment to see its structure
              console.log("Student assignment object:", assignment);
              
              // Try different possible ID field names
              const assignmentId = assignment.id || assignment._id || assignment.assignmentId;
              
              return (
                <li
                  key={assignmentId}
                  className="bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-black">{assignment.title}</h2>
                    <span className="text-sm text-black">
                      Due: {dayjs(assignment.dueDate).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <p className="text-black mb-2">
                    <strong>Subject: </strong> {assignment.subject}
                  </p>
                  <p className="text-black">{assignment.description}</p>
                  
                  {/* Debug: Show the ID being used */}
                  <p className="text-xs text-black mt-2">ID: {assignmentId}</p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
};

export default StudentAssignmentsPage;
