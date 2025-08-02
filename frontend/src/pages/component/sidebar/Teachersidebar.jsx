import React from "react";
import { useNavigate } from "react-router";
import {
  FaChalkboard,
  FaClipboardList,
  FaUserCheck,
  FaBell,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const TeacherSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens from localStorage or sessionStorage
    localStorage.removeItem("teacherToken"); // or 'token', depending on your naming
    sessionStorage.clear();

    // Navigate to login page
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h2 
          className="text-2xl font-bold mb-8 text-white cursor-pointer hover:text-green-400 transition-colors"
          onClick={() => navigate("/teacher")}
        >
          👨‍🏫 Teacher Panel
        </h2>
        <nav className="space-y-4 text-sm">
          <SidebarItem
            icon={<FaChalkboard />}
            label="Dashboard"
            onClick={() => navigate("/teacher")}
          />

          <SidebarItem
            icon={<FaClipboardList />}
            label="Assignments"
            onClick={() => navigate("/assignments")}
          />
          <SidebarItem
            icon={<FaUserCheck />}
            label="Attendance"
            onClick={() => navigate("/attendance")}
          />
          <SidebarItem
            icon={<FaBell />}
            label="Announcements"
            onClick={() => navigate("/Tannouncements")}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-indigo-800">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          onClick={handleLogout}
        />
        <p className="text-xs text-gray-400 text-center mt-4">
          © {new Date().getFullYear()} EduManage
        </p>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition py-2"
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </div>
);

export default TeacherSidebar;
