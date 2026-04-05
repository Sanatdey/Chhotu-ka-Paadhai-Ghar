"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/app/lib/gtag";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
useEffect(() => {
  trackEvent("login_view", {
    worksheet_id: "w1",
  });
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setSuccess(true);
      // Store user data in localStorage (you can also use Context API or cookies)
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      {/* Decorative blurred circles */}
      <div className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-orange-400/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={56}
                height={56}
                className="w-full h-full drop-shadow-md"
              />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Login to your account
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100/50 border border-green-400 text-green-700 rounded-xl text-sm font-semibold text-center"
            >
              ✓ Login successful! Redirecting...
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100/50 border border-red-400 text-red-700 rounded-xl text-sm font-semibold text-center"
            >
              ✗ {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-purple-200/50 focus:border-blue-500 focus:bg-white/80 outline-none transition-all placeholder-gray-400 font-medium"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-purple-200/50 focus:border-blue-500 focus:bg-white/80 outline-none transition-all placeholder-gray-400 font-medium"
                required
              />
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-right"
            >
              <Link
                href="#"
                className="text-blue-600 hover:text-purple-600 text-sm font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
            <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-purple-200 to-transparent" />
          </div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="text-gray-700 font-medium">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-purple-600 font-bold transition-colors"
              >
                Register here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs sm:text-sm mt-6"
        >
          By signing in, you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
