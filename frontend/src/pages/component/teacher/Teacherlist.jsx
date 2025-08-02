

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Adminsidebar from "../sidebar/Adminsidebar";
import { getAllTeachersApi } from "../../../api/api"; 

const TeachersList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAllTeachersApi(); 
        setTeachers(response.data.teachers || []);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to load teacher list.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-900 via-purple-900 to-black text-white">
      <Adminsidebar />

      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Teachers List</h1>
          <button
            onClick={() => navigate("/Createteacher")}
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl font-semibold text-white"
          >
            + Add Teacher
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : teachers.length === 0 ? (
          <p className="text-gray-400">No teachers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4 border border-gray-700">Name</th>
                  <th className="p-4 border border-gray-700">Subject</th>
                  <th className="p-4 border border-gray-700">Qualification</th>
                  <th className="p-4 border border-gray-700">Email</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-800">
                    <td className="p-4 border border-gray-700">{teacher.name}</td>
                    <td className="p-4 border border-gray-700">{teacher.subject}</td>
                    <td className="p-4 border border-gray-700">{teacher.qualification}</td>
                    <td className="p-4 border border-gray-700">{teacher.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersList;

