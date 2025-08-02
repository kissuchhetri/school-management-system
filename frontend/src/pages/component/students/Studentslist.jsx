
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Adminsidebar from "../sidebar/Adminsidebar";
import { getAllStudentsApi } from "../../../api/api"; 

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudentsApi();
        setStudents(response.data.students || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student list.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Group students by class
  const studentsByClass = students.reduce((acc, student) => {
    const classKey = student.class || "Unknown";
    if (!acc[classKey]) acc[classKey] = [];
    acc[classKey].push(`${student.firstName} ${student.lastName}`);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Adminsidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-green-900 via-purple-900 to-black p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student List</h1>
          <button
            onClick={() => navigate("/createstudents")}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white font-semibold"
          >
            + Add Student
          </button>
        </div>

        {/* Loading and error */}
        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-gray-400">No students found.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(studentsByClass).map(([className, names]) => (
              <div
                key={className}
                className=" bg-opacity-40 rounded-xl p-4 border border-purple-900 shadow"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-2">
                  Students of class {className}:
                </h2>
                <ul className="list-disc list-inside text-white text-sm space-y-1">
                  {names.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentsList;

