import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaUserCheck,
  FaBullhorn,
} from "react-icons/fa";
import StudentSidebar from "../sidebar/Studentsidebar";
import { getAllAssignmentsApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await getAllAssignmentsApi();
        setAssignments(response.data.assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments");
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <header>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">Welcome, {user?.firstName || user?.name || 'Student'} 🎓</h1>
            <p className="text-gray-300 text-sm mt-1">
              Here's your dashboard to stay on top of your studies.
            </p>
          </header>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <DashboardCard
            icon={<FaClipboardList />}
            label="Pending Assignments"
            value={assignments.length}
            color="yellow"
          />
          <DashboardCard
            icon={<FaUserCheck />}
            label="Attendance"
            value="95%"
            color="green"
          />
          <DashboardCard
            icon={<FaBullhorn />}
            label="Announcements"
            value="2"
            color="pink"
          />
        </div>

        {/* Assignments */}
        <section className="mt-8 sm:mt-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">
            📚 Your Assignments
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-300">Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No assignments available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignments.map((assignment, idx) => (
                                 <div
                   key={assignment._id || assignment.id || idx}
                   className="bg-white bg-opacity-10 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white border-opacity-20"
                 >
                   {/* Assignment Title - More Prominent */}
                   <h3 className="text-base sm:text-lg font-bold text-black mb-2">
                     📝 {assignment.title || assignment.name}
                   </h3>
                  
                                     {/* Subject */}
                   {assignment.subject && (
                     <p className="text-black text-xs sm:text-sm mb-2">
                       📚 Subject: {assignment.subject}
                     </p>
                   )}
                   
                   {/* Description */}
                   {assignment.description && (
                     <p className="text-black text-xs sm:text-sm mb-3 line-clamp-2">
                       {assignment.description}
                     </p>
                   )}
                  
                  {/* Due Date */}
                  <div className="flex justify-between items-center">
                    {assignment.dueDate ? (
                      <span className="text-black text-sm font-medium">
                        ⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    ) : assignment.createdAt ? (
                      <span className="text-black text-sm">
                        📅 Posted: {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-black text-sm">
                        📅 No due date set
                      </span>
                    )}
                    
                    {/* Status Badge */}
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// Dashboard card component
const DashboardCard = ({ icon, label, value, color }) => {
  const colorMap = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    pink: "text-pink-400",
    indigo: "text-indigo-400",
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl backdrop-blur-sm text-black">
      <div className={`text-2xl mb-2 ${colorMap[color]}`}>{icon}</div>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StudentDashboard;

