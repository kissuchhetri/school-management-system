import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-purple-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-black bg-opacity-50 backdrop-blur-sm shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">EduManage</h1>
        <ul className="flex space-x-6 text-sm font-medium">
          <li className="hover:text-green-400 cursor-pointer">Home</li>
          <li className="hover:text-green-400 cursor-pointer">Admin</li>
          <li className="hover:text-green-400 cursor-pointer">Students</li>
          <li className="hover:text-green-400 cursor-pointer">Teachers</li>
          <li className="hover:text-green-400 cursor-pointer">Login</li>
          <li className="hover:text-green-400 cursor-pointer">Signup</li>

        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-xl">
          Welcome to EduManage 📘
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mb-10">
          Simplify your school operations with our all-in-one management system. Manage attendance, grades, announcements, and communication effortlessly.
        </p>

        <img
          src="../../../assets/5752737f-7ed1-4bf8-aa82-e779156297c5.png"
          alt="School Management Illustration"
          className="w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100"
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-700 mt-auto">
        © {new Date().getFullYear()} EduManage. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
