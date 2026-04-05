"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getYouTubeWatchUrl } from "@/app/lib/youtube";
import { useRouter } from "next/navigation";

type Worksheet = {
  id: number;
  title: string;
  subject: string;
  difficultyLevel: string;
  pdfUrl: string;
  className: string;
  solutionVideoUrl?: string;
};

export default function WorksheetSection({ 
  selectedSubject,
  selectedDifficulty,
  searchQuery,
  userClass,
}: { 
  selectedSubject: "all" | "maths" | "english" | "evs"
  selectedDifficulty: "all" | "easy" | "medium" | "hard"
  searchQuery: string
  userClass: string
}) {
  const router = useRouter();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorksheets();
  }, [selectedSubject, selectedDifficulty, searchQuery]);

  const fetchWorksheets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content/worksheets");
      const data = await res.json();
      // Ensure data is an array
      const worksheetArray = Array.isArray(data) ? data : [];
      
      // Filter by selected subject
      let filtered = selectedSubject === "all"
        ? worksheetArray
        : worksheetArray.filter((worksheet: Worksheet) => worksheet.subject === selectedSubject);
      
      // Filter by difficulty
      if (selectedDifficulty !== "all") {
        filtered = filtered.filter((worksheet: Worksheet) => 
          worksheet.difficultyLevel.toLowerCase() === selectedDifficulty.toLowerCase()
        );
      }
      if(userClass) {
        filtered = filtered.filter((worksheet: Worksheet) => 
          worksheet.className === userClass.replaceAll("class", "")
        );
      }
      
      // Filter by search query (case-insensitive title search)
      if (searchQuery.trim()) {
        filtered = filtered.filter((worksheet: Worksheet) => 
          worksheet.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setWorksheets(filtered);
    } catch (error) {
      console.error("Failed to fetch worksheets:", error);
      setWorksheets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = (worksheet: Worksheet) => {
    const classShort = userClass.replace('class', '');
    const subjectShort = worksheet.subject.toLowerCase();
    router.push(`/solve/${classShort}/${subjectShort}/${worksheet.id}`);
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  const handleSolution = (worksheet: Worksheet) => {
    if (worksheet.solutionVideoUrl) {
      window.open(getYouTubeWatchUrl(worksheet.solutionVideoUrl), "_blank");
    } else {
      alert(`No solution video available for ${worksheet.title}`);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading worksheets...</p>;
  }

  return (
    <div>
      {/* Worksheets Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {worksheets.map((worksheet, index) => (
          <motion.div
            key={worksheet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all p-6 sm:p-8"
          >
            {/* <div className="text-4xl sm:text-5xl mb-4 text-center"></div> */}
            

            {/* Worksheet Title */}
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-6 text-center">
              📄{worksheet.title}
            </h3>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 flex-col">
              <motion.button
                onClick={() => handleSolve(worksheet)}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all"
              >
                ✏️ Solve
              </motion.button>
              <motion.button
                onClick={() => handleSolution(worksheet)}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all"
              >
                📹 Solution
              </motion.button>
              <motion.button
                onClick={() => handleDownload(worksheet.pdfUrl)}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all"
              >
                ⬇️ Download
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
