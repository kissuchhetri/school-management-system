
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUserApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUserApi({ email, password });
      setLoading(false);

      if (response.data.success) {
        // Store user data and token in AuthContext
        const userData = response.data.user;
        const token = response.data.token;
        
        // Use the login function from AuthContext
        login(userData, token);

        const role = userData?.role || "user"; // fallback

        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "student":
            navigate("/Students");
            break;
          default:
            setError("Unknown user role");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("Login endpoint not found. Check API configuration.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR' || err.name === 'NetworkError') {
        setError("Network error. Check your connection and backend server.");
      } else if (err.message.includes('fetch')) {
        setError("Cannot connect to server. Check if backend is running.");
      } else if (err.message.includes('timeout')) {
        setError("Request timeout. Backend server might be slow or unreachable.");
      } else if (err.message.includes('CORS')) {
        setError("CORS error. Backend is not allowing requests from this origin.");
      } else {
        setError(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-purple-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-4 sm:px-6 py-4 bg-black bg-opacity-50 backdrop-blur-sm shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">School Management System</h1>

        {/* Inline Login Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md shadow-lg w-full sm:w-auto"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm hover:bg-purple-700 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </nav>

      {/* Error message */}
      {error && (
        <div className="text-center text-red-400 font-medium mt-2">{error}</div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 drop-shadow-xl">
          Welcome to EduManage 📘
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mb-6 sm:mb-10 px-4">
          Simplify your school operations with our all-in-one management system.
          Manage attendance, grades, announcements, and communication effortlessly.
        </p>

        <img
          src="background.png"
          alt="School Management Illustration"
          className="w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 mb-8 sm:mb-12 px-4"
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
