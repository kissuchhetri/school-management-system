import React from "react";
import { useNavigate } from "react-router";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaChartBar,
  FaUsersCog,
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";

const Adminsidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens if you use them (optional)
    // localStorage.removeItem("token");
    // sessionStorage.clear();

    navigate("/"); // Redirect to login page
  };

  return (
    <aside className="w-full lg:w-64 bg-gradient-to-b from-purple-800 to-black p-4 sm:p-6 flex flex-col justify-between min-h-screen lg:min-h-screen">
      <div>
        <h2 
          className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white text-center lg:text-left cursor-pointer hover:text-green-400 transition-colors"
          onClick={() => navigate("/admin")}
        >
          🎓 EduManage
        </h2>
        <nav className="space-y-2 sm:space-y-4 text-sm">
          <SidebarItem
            icon={<FaUserGraduate />}
            label="DashBoard"
            onClick={() => navigate("/Admin")}
          />
          <SidebarItem
            icon={<FaUserGraduate />}
            label="Students"
            onClick={() => navigate("/Studentslist")}
          />
          <SidebarItem
            icon={<FaChalkboardTeacher />}
            label="Teachers"
            onClick={() => navigate("/Teacherslist")}
          />
          <SidebarItem
            icon={<FaBook />}
            label="Announcements"
            onClick={() => navigate("/announcements")}
          />
          <SidebarItem
            icon={<FaEnvelope />}
            label="Student Messages"
            onClick={() => navigate("/adminmessages")}
          />
          {/* <SidebarItem
            icon={<FaChartBar />}
            label="Reports"
            onClick={() => navigate("/Reports")}
          /> */}
          {/* <SidebarItem
            icon={<FaUsersCog />}
            label="Users"
            onClick={() => navigate("/Users")}
          />
          <SidebarItem
            icon={<FaCog />}
            label="Settings"
            onClick={() => navigate("/Settings")}
          /> */}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-purple-900">
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
    className="flex items-center justify-center lg:justify-start gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition py-2 px-2 sm:px-0"
  >
    <span className="text-base sm:text-lg">{icon}</span>
    <span className="text-sm sm:text-base">{label}</span>
  </div>
);

export default Adminsidebar;
