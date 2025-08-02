
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Public pages
import Homepage from './pages/homepage';
import Contact from "./pages/contact";
import Login from "./pages/login";
import Product from "./pages/product";
import Form from "./pages/form";

// Protected pages - Admin
import Admindash from "./pages/component/dashboard/Admindash";
import Studentslist from "./pages/component/students/Studentslist";
import StudentForm from "./pages/component/students/Createstudents";
import CreateteacherForm from "./pages/component/teacher/Createteacher";
import TeachersList from "./pages/component/teacher/Teacherlist";
import Announcement from "./pages/component/announcment/announcement";

// Protected pages - Teacher
import Teacherdash from "./pages/component/dashboard/Teacherdash";

import TeacherAssignments from "./pages/component/Teachercontent/assingment";
import AddAssignmentPage from "./pages/component/Teachercontent/addassingments";
import TeacherAttendancePage from "./pages/component/Teachercontent/attendance";
import TeacherAnnouncementPage from "./pages/component/Teachercontent/Tannouncement";

// Protected pages - Student
import Studentdash from "./pages/component/dashboard/Studentdash";
import StudentAnnouncement from "./pages/component/students/studentcontents/StudentAnnouncement";
import StudentAssignmentsPage from "./pages/component/students/studentcontents/assignmentstudent";
import StudentMessage from "./pages/component/students/studentcontents/StudentMessage";

// Protected pages - Admin Messages
import AdminMessages from "./pages/component/admin/AdminMessages"; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-purple-900 to-black text-white flex flex-col">
          {/* <Nav /> */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product" element={<Product />} />
              
              {/* Public Routes that redirect if authenticated */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/form" element={<PublicRoute><Form /></PublicRoute>} />
              
              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admindash /></ProtectedRoute>} />
              <Route path="/studentslist" element={<ProtectedRoute requiredRole="admin"><Studentslist /></ProtectedRoute>} />
              <Route path="/createstudents" element={<ProtectedRoute requiredRole="admin"><StudentForm /></ProtectedRoute>} />
              <Route path="/createteacher" element={<ProtectedRoute requiredRole="admin"><CreateteacherForm /></ProtectedRoute>} />
              <Route path="/teacherslist" element={<ProtectedRoute requiredRole="admin"><TeachersList /></ProtectedRoute>} />
              <Route path="/announcements" element={<ProtectedRoute requiredRole="admin"><Announcement /></ProtectedRoute>} />
              <Route path="/adminmessages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
              
              {/* Teacher Protected Routes */}
              <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><Teacherdash /></ProtectedRoute>} />
      
              <Route path="/assignments" element={<ProtectedRoute requiredRole="teacher"><TeacherAssignments /></ProtectedRoute>} />
              <Route path="/addassignment" element={<ProtectedRoute requiredRole="teacher"><AddAssignmentPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute requiredRole="teacher"><TeacherAttendancePage /></ProtectedRoute>} />
              <Route path="/Tannouncements" element={<ProtectedRoute requiredRole="teacher"><TeacherAnnouncementPage /></ProtectedRoute>} />
              
              {/* Student Protected Routes */}
              <Route path="/Students" element={<ProtectedRoute requiredRole="student"><Studentdash /></ProtectedRoute>} />
              <Route path="/StudentAnnouncement" element={<ProtectedRoute requiredRole="student"><StudentAnnouncement /></ProtectedRoute>} />
              <Route path="/StudentAssignments" element={<ProtectedRoute requiredRole="student"><StudentAssignmentsPage /></ProtectedRoute>} />
              <Route path="/StudentMessage" element={<ProtectedRoute requiredRole="student"><StudentMessage /></ProtectedRoute>} />

              {/* Add more routes as needed */}
            </Routes>
          </main>
          <footer className="text-center py-4 text-sm text-gray-300 border-t border-gray-700 bg-black bg-opacity-40">
            © {new Date().getFullYear()} EduManage. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
