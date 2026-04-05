"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import VideosSection from "./components/VideosSection";
import SolutionsSection from "./components/SolutionsSection";
import WorksheetSection from "./components/WorksheetSection";
import UserProfileModal from "../components/UserProfileModal";
import { trackEvent } from "../lib/gtag";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"videos" | "solutions" | "worksheet">("videos");
  const [selectedSubject, setSelectedSubject] = useState<"all" | "maths" | "english" | "evs">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {

  
  trackEvent("dashboard_view", {
    worksheet_id: "w1",
  });


    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Search functionality can be implemented here
    }
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
      <header className="sticky top-0 z-40 bg-gradient-to-r from-white/80 via-blue-50/80 to-purple-50/80 backdrop-blur-xl border-b border-purple-200/50 shadow-2xl">
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-5">
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
                Chhotu ka Paadhai Ghar
              </p>
            </div>
          </Link>

          {/* Center - Welcome Info with Premium Design */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center px-2 sm:px-6"
          >
            <p className="text-gray-600 text-xs sm:text-sm font-bold tracking-wide">Welcome Back 👋</p>
            
            {/* Mobile: Name and Class side by side */}
            <div className="flex sm:hidden items-center gap-2 mt-1.5">
              <h2 className="text-base font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                {user?.name}
              </h2>
              <span className="text-xs font-bold text-purple-600">| 📚 {user?.class?.slice(-1) || "1"}</span>
            </div>

            {/* Desktop: Name and Class with divider and badge */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center gap-0 sm:gap-4 mt-1.5">
              {/* Name */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <h2 className="text-lg sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {user?.name}
                </h2>
              </motion.div>
              
              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-50"></div>
              
              {/* Class Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-purple-200/60"
              >
                <span className="text-lg">📚</span>
                <span className="font-bold text-sm sm:text-base text-gray-800">Class {user?.class?.slice(-1) || "1"}</span>
                {user?.isAdmin && (
                  <>
                    <span className="text-xs opacity-70">•</span>
                    <span className="text-sm font-bold text-yellow-600">👑 Admin</span>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Profile & Logout Buttons */}
          <div className="flex-shrink-0 flex gap-2 items-center">
            <motion.button
              onClick={() => setProfileModalOpen(true)}
              whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 shadow-lg"
            >
              <span className="hidden sm:inline">👤 Profile</span>
              <span className="sm:hidden">👤</span>
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-lg"
            >
              🚪 Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
            {/* First Row: Subject and Difficulty Dropdowns */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4 items-stretch sm:items-end flex-wrap">
              {/* Subject Filter Dropdown */}
              <div className="flex-1 sm:flex-none min-w-[200px]">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📚 Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-300 font-semibold text-gray-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-all cursor-pointer"
                >
                  <option value="all">🌍 All Subjects</option>
                  <option value="maths">📐 Mathematics</option>
                  <option value="english">📚 English</option>
                  <option value="evs">🌱 Environmental Studies</option>
                </select>
              </div>

              {/* Difficulty Filter Dropdown */}
              <div className="flex-1 sm:flex-none min-w-[200px]">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ⭐ Select Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 font-semibold text-gray-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-300 transition-all cursor-pointer"
                >
                  <option value="all">🌍 All Levels</option>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            {/* Second Row: Search Input */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔍 Search Topics
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for videos, solutions..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-purple-300 font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-all"
                />
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                >
                  🔍 Search
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 sm:gap-3 mb-8 flex-wrap justify-center"
        >
          {[
            { id: "videos", label: "📹 Videos", icon: "📹" },
            { id: "solutions", label: "💡 Solutions", icon: "💡" },
            { id: "worksheet", label: "📝 Worksheets", icon: "📝" },
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
          className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 p-6 sm:p-8 shadow-lg"
        >
          {activeTab === "videos" && <VideosSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={user?.className}/>}
          {activeTab === "solutions" && <SolutionsSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={user?.className} />}
          {activeTab === "worksheet" && <WorksheetSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={user?.className} />}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-purple-200/30 mt-12">
        <p className="font-semibold">© 2026 Chhotu ka Paadhai Ghar | Happy Learning! 🎓</p>
        <p className="text-xs mt-2">Your trusted learning platform for Class 1-3</p>
      </footer>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onProfileUpdate={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}
