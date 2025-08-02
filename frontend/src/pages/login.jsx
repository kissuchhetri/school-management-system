



import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUserApi } from "../api/api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import PublicRoute from "../components/PublicRoute";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return toast.error("Please fill in all fields");
    }

    try {
      const response = await loginUserApi({ email, password });

      if (response.data.success) {
        const decoded = jwtDecode(response.data.token);
        
        // Store user data and token using our auth context
        login(decoded, response.data.token);
        
        toast.success(response.data.message || "Login successful!");

        // Redirect based on role or to the page they were trying to access
        setTimeout(() => {
          if (decoded.role === "admin") {
            navigate("/admin");
          } else if (decoded.role === "teacher") {
            navigate("/teacher");
          } else if (decoded.role === "student") {
            navigate("/students");
          } else {
            navigate(from);
          }
        }, 1000);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 404) {
        toast.error("Login endpoint not found. Check API configuration.");
      } else if (err.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR') {
        toast.error("Network error. Check your connection and backend server.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-purple-900 to-black px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Login;
