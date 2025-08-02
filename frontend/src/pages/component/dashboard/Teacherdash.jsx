import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaUserGraduate,
  FaBullhorn,
} from "react-icons/fa";
import TeacherSidebar from "../sidebar/Teachersidebar";
import { useAuth } from "../../../context/AuthContext";
import { getStudentCountForTeachersApi, getAllAssignmentsApi, getAllAnnouncementsApi } from "../../../api/api";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);

  useEffect(() => {
    // Fetch total students
    getStudentCountForTeachersApi()
      .then((res) => {
        console.log("Student count response:", res.data);
        setTotalStudents(res.data?.totalStudents || 0);
      })
      .catch((err) => {
        console.error("Student count error:", err);
        setTotalStudents(0);
      });

    // Fetch total assignments
    getAllAssignmentsApi()
      .then((res) => {
        const assignments = res.data?.data || res.data?.assignments || res.data || [];
        setTotalAssignments(assignments.length);
      })
      .catch((err) => console.error("Assignment count error:", err));

    // Fetch total announcements
    getAllAnnouncementsApi()
      .then((res) => {
        const announcements = res.data?.data || res.data?.announcements || res.data || [];
        setTotalAnnouncements(announcements.length);
      })
      .catch((err) => console.error("Announcement count error:", err));
  }, []);
  return (
    <div className="min-h-screen flex text-black">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="mb-8">
          <header>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Teacher'} 👩‍🏫</h1>
            <p className="text-gray-300 text-sm mt-1">
              Here's what's happening in your classroom today.
            </p>
          </header>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard icon={<FaUserGraduate />} label="Total Students" value={totalStudents} color="blue" />
          <DashboardCard icon={<FaClipboardList />} label="Total Assignments" value={totalAssignments} color="green" />
          <DashboardCard icon={<FaBullhorn />} label="Total Announcements" value={totalAnnouncements} color="yellow" />
        </div>


      </main>
    </div>
  );
};
// Dashboard card component
const DashboardCard = ({ icon, label, value, color }) => {
  const colorMap = {
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className={`text-2xl mb-2 ${colorMap[color]}`}>{icon}</div>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-gray-300">{value}</p>
    </div>
  );
};
export default TeacherDashboard;
