"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import VideosSection from "../components/VideosSection";
import SolutionsSection from "../components/SolutionsSection";
import WorksheetSection from "../components/WorksheetSection";
import Header from "@/app/components/Header";
import { trackEvent } from "@/app/lib/gtag";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"videos" | "solutions" | "worksheet">("videos");
  const [selectedSubject, setSelectedSubject] = useState<"all" | "maths" | "english" | "evs">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Search functionality can be implemented here
    }
  };

  useEffect(() => {
  trackEvent("class_3_view", {
    worksheet_id: "w1",
  });
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Top Navigation Bar */}
      <Header active="class-3"/>

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
          {activeTab === "videos" && <VideosSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={"class3"}/>}
          {activeTab === "solutions" && <SolutionsSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={"class3"} />}
          {activeTab === "worksheet" && <WorksheetSection selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} searchQuery={searchQuery} userClass={"class3"} />}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-purple-200/30 mt-12">
        <p className="font-semibold">© 2026 Chhotu ka Paadhai Ghar | Happy Learning! 🎓</p>
        <p className="text-xs mt-2">Your trusted learning platform for Class 1-3</p>
      </footer>
    </div>
  );
}
