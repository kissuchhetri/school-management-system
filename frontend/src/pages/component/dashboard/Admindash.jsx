import React, { useEffect, useState } from "react";
import Adminsidebar from "../sidebar/Adminsidebar";
import { getstudentcountApi, getTeacherCountApi, getAllAnnouncementsApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const totalClasses = 12;
  const totalRevenue = 1540000;

  useEffect(() => {
    console.log("Admin dashboard useEffect running...");
    console.log("Token from localStorage:", localStorage.getItem('token'));
    
    getstudentcountApi()
      .then((res) => setTotalStudents(res.data.totalStudents || 0))
      .catch((err) => console.error("Student count error:", err));

    getTeacherCountApi()
      .then((res) => setTotalTeachers(res.data.totalTeachers || 0))
      .catch((err) => console.error("Teacher count error:", err));

    console.log("Calling getAllAnnouncementsApi...");
    getAllAnnouncementsApi()
      .then((res) => {
        console.log("Announcements API response:", res.data);
        const announcements = res.data?.data || res.data?.announcements || res.data || [];
        console.log("Processed announcements:", announcements);
        console.log("Setting totalAnnouncements to:", announcements.length);
        setTotalAnnouncements(announcements.length);
      })
      .catch((err) => {
        console.error("Announcements count error:", err);
        console.error("Error response:", err.response);
        console.error("Error status:", err.response?.status);
        setTotalAnnouncements(0);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-white">
      <Adminsidebar />

      <main className="flex-1 bg-gradient-to-br from-green-900 via-purple-900 to-black p-4 sm:p-6 lg:p-8">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-gray-300 mb-6 sm:mb-8">Welcome, {user?.name || user?.firstName || 'Admin'}! Choose what you want to manage today.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <DashboardCard label="Total Students" value={totalStudents} />
          <DashboardCard label="Total Teachers" value={totalTeachers} />
          <DashboardCard label="Total Announcements" value={totalAnnouncements} />
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ label, value }) => (
  <div className="bg-black bg-opacity-40 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-800 hover:scale-105 transition-transform">
    <p className="text-base sm:text-lg text-gray-400">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{value}</p>
  </div>
);

export default AdminDashboard;


