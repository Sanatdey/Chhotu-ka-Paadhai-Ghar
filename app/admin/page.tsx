"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AdminVideosTab from "./components/AdminVideosTab";
import AdminSolutionsTab from "./components/AdminSolutionsTab";
import AdminWorksheetsTab from "./components/AdminWorksheetsTab";
import AdminUsersTab from "./components/AdminUsersTab";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"videos" | "solutions" | "worksheets" | "users">("videos");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    // In a real app, you'd check the isAdmin flag from backend
    // For now, we'll allow admin access to specific users
    setUser(parsedUser);
    setLoading(false);
    console.log("Logged in user:", parsedUser);
    const password = prompt("Enter admin password:");
    if (password !== "Manik@001") {
      window.location.href = "/auth/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-lg border-b border-purple-200 shadow-lg">
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 sm:w-10 h-8 sm:h-10"
            />
            <div className="hidden sm:block">
              <p className="text-xs sm:text-sm font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Navigation Links - Middle */}
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors"
            >
              📚 Dashboard
            </Link>
          </div>

          {/* Logout - Right */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex-shrink-0"
          >
            🚪 Logout
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 text-white"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
            🎛️ Admin Control Panel
          </h1>
          <p className="text-sm sm:text-base opacity-90">
            Manage videos, solutions, and worksheets
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 sm:gap-3 mb-8 flex-wrap justify-center"
        >
          {[
            { id: "videos", label: "📹 Videos", icon: "📹" },
            { id: "solutions", label: "💡 Solutions", icon: "💡" },
            { id: "worksheets", label: "📝 Worksheets", icon: "📝" },
            { id: "users", label: "👥 Users", icon: "👥" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white shadow-lg"
                  : "bg-white/50 text-gray-700 border-2 border-purple-200/50 hover:bg-white/80"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "videos" && <AdminVideosTab />}
          {activeTab === "solutions" && <AdminSolutionsTab />}
          {activeTab === "worksheets" && <AdminWorksheetsTab />}
          {activeTab === "users" && <AdminUsersTab />}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-purple-200/30 mt-12">
        <p className="font-semibold">© 2024 Chhotu ka Paadhai Ghar Admin | Manage with Care! 🎓</p>
      </footer>
    </div>
  );
}
