import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaClipboardList, FaClock, FaPlus, FaTrash } from "react-icons/fa";
import TeacherSidebar from "../sidebar/Teachersidebar";
import { getAllAssignmentsApi, deleteAssignmentApi } from "../../../api/api";

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Function to fetch assignments from the API
  const fetchAssignments = async () => {
    try {
      console.log("Starting to fetch assignments...");
      console.log("Token from localStorage:", localStorage.getItem('token'));
      console.log("API Base URL: http://localhost:3000");
      console.log("API Endpoint: /api/assignment/all");
      
      // Test if backend is accessible
      try {
        const testResponse = await fetch('http://localhost:3000/api/assignment/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Test fetch response status:", testResponse.status);
        console.log("Test fetch response ok:", testResponse.ok);
        
        // Try to get the response text to see the actual error
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.log("Test fetch error response:", errorText);
        }
      } catch (testErr) {
        console.error("Test fetch failed:", testErr);
      }
      
      const response = await getAllAssignmentsApi();
      console.log("Assignments API Response:", response);
      console.log("Assignments API Response Data:", response.data);
      
      // Handle different possible response structures
      let assignmentsData = [];
      if (response.data && response.data.data) {
        assignmentsData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        assignmentsData = response.data;
      } else if (response.data && response.data.assignments) {
        assignmentsData = response.data.assignments;
      } else if (Array.isArray(response.data)) {
        assignmentsData = response.data;
      }
      
      console.log("Processed assignments data:", assignmentsData);
      
      // Set assignments from API response
      setAssignments(assignmentsData || []);
      setError("");
    } catch (err) {
      console.error("Error fetching assignments:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Assignments endpoint not found. Check API configuration.");
      } else if (err.response?.status >= 500) {
        console.error("Server Error Details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        setError(`Server error (${err.response?.status}): ${err.response?.data?.message || err.response?.statusText || 'Unknown server error'}`);
      } else if (err.code === 'NETWORK_ERROR') {
        setError("Network error. Check your connection and backend server.");
      } else {
        setError(`Failed to load assignments: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to delete assignment
  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the assignment "${assignmentTitle}"?\n\nThis action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingId(assignmentId);
      console.log("Deleting assignment with ID:", assignmentId);
      
      await deleteAssignmentApi(assignmentId);
      
      // Remove the deleted assignment from the state
      setAssignments(prev => prev.filter(assignment => {
        const id = assignment._id || assignment.id || assignment.assignmentId;
        return id !== assignmentId;
      }));
      
      console.log("Assignment deleted successfully");
      // You could add a success toast here if you have a toast system
      
    } catch (err) {
      console.error("Error deleting assignment:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      let errorMessage = "Failed to delete assignment.";
      
      if (err.response?.status === 404) {
        errorMessage = "Assignment not found.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-3xl font-bold text-white">📋 Assignments</h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage and view upcoming assignments for your classes.
            </p>
          </div>

          <button
            onClick={() => navigate("/addassignment")}
            className="flex items-center gap-2  hover:bg-purple-900 text-white px-4 py-2 rounded-lg shadow-lg transition duration-300"
          >
            <FaPlus />
            <span className="text-sm font-medium">Add Assignment</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-black">
            <p>Loading assignments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No Assignments State */}
        {!loading && !error && assignments.length === 0 && (
          <div className="text-center text-black">
            <p>No assignments available. Create your first assignment!</p>
          </div>
        )}

        {/* Assignment Cards */}
        {!loading && !error && assignments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              // Debug: Log each assignment to see its structure
              console.log("Assignment object:", assignment);
              
              // Try different possible ID field names
              const assignmentId = assignment._id || assignment.id || assignment.assignmentId;
              
              return (
                <div
                  key={assignmentId}
                  className=" bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-black">{assignment.subject}</h2>
                    <FaClipboardList className="text-2xl text-blue-600" />
                  </div>
                  <p className="text-black mb-2">
                    📘 <span className="font-medium">{assignment.title}</span>
                  </p>
                  <p className="text-black mb-2 text-sm">
                    📝 {assignment.description}
                  </p>
                  <p className="flex items-center gap-2 text-black text-sm mb-4">
                    <FaClock /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  
                  {/* Debug: Show the ID being used */}
                  <p className="text-xs text-black mb-2">ID: {assignmentId}</p>
                  
                  <div className="flex gap-2">
                    {/* <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
                      View Details
                    </button> */}
                    <button 
                      className={`py-2 px-3 rounded-md transition ${
                        deletingId === assignmentId 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                      title="Delete Assignment"
                      onClick={() => handleDeleteAssignment(assignmentId, assignment.title)}
                      disabled={deletingId === assignmentId}
                    >
                      {deletingId === assignmentId ? (
                        <span className="text-xs">Deleting...</span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherAssignments;
