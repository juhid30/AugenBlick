import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Baby, ArrowLeft, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token
      localStorage.setItem("token", data.access_token);

      // Decode JWT to get user info (if needed)
      const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      localStorage.setItem("user_role", tokenPayload.role);
      localStorage.setItem("user_id", tokenPayload.user_id);
      localStorage.setItem("user_email", tokenPayload.email);

      // NEW: Fetch user details from /get-user API and save user information in localStorage
      const userResponse = await fetch("http://127.0.0.1:5000/get-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.access_token}`
        },
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on role
      if (tokenPayload.role === "user") {
        window.location.href = "/user-dashboard";
      } else if (tokenPayload.role === "manager") {
        window.location.href = "/manager-dashboard";
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <Baby className="h-8 w-8 text-primary-600 mr-2" />
            <h1 className="font-display font-bold text-2xl text-gray-900">
              MinG Baby HRMS
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold font-display text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Please enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                isLoading
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" color="text-white" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Contact your administrator
            </a>
          </p>
        </div>

        {/* Right side - Image and Info */}
        <div className="hidden md:block md:w-1/2 bg-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90"></div>
          <img
            src="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Office workspace"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />

          <div className="relative h-full flex flex-col justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold font-display mb-6">
                Streamline your HR operations with MinG Baby HRMS
              </h2>
              <p className="mb-8">
                Our comprehensive HR management system helps you track
                attendance, manage leave requests, and maintain employee records
                with ease.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time attendance tracking",
                  "Simplified leave management",
                  "Comprehensive employee profiles",
                  "Insightful reporting and analytics",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
