import React from "react";
import { useNavigate } from "react-router";
import {
  FaChalkboard,
  FaClipboardList,
  FaUserCheck,
  FaBell,
  FaCalendarAlt,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens or session if any
    // localStorage.removeItem("studentToken");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-6 flex flex-col justify-between min-h-screen text-white">
      <div>
        <h2 
          className="text-2xl font-bold mb-8 text-white cursor-pointer hover:text-green-400 transition-colors"
          onClick={() => navigate("/Students")}
        >
          🎓 Student Panel
        </h2>
        <nav className="space-y-4 text-sm">
          <SidebarItem
            icon={<FaChalkboard />}
            label="Dashboard"
            onClick={() => navigate("/students")}
          />
          <SidebarItem
            icon={<FaClipboardList />}
            label="Assignments"
            onClick={() => navigate("/StudentAssignments")}
          />
          <SidebarItem
            icon={<FaBell />}
            label="Announcements"
            onClick={() => navigate("/StudentAnnouncement")}
          />
          <SidebarItem
            icon={<FaEnvelope />}
            label="Message Admin"
            onClick={() => navigate("/StudentMessage")}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-indigo-800">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          onClick={() => navigate("/")}
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

export default StudentSidebar;
