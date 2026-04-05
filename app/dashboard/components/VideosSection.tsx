"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from "@/app/lib/youtube";

type Video = {
  id: number;
  title: string;
  subject: string;
  difficultyLevel: string;
  url: string;
  className: string;
};

export default function VideosSection({ 
  selectedSubject, 
  selectedDifficulty,
  searchQuery ,
  userClass,
}: { 
  selectedSubject: "all" | "maths" | "english" | "evs"
  selectedDifficulty: "all" | "easy" | "medium" | "hard"
  searchQuery: string
  userClass: string,
}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [selectedSubject, selectedDifficulty, searchQuery, userClass]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content/videos");
      const data = await res.json();
      // Ensure data is an array
      const videoArray = Array.isArray(data) ? data : [];
      
      // Filter by selected subject
      let filtered = selectedSubject === "all" 
        ? videoArray 
        : videoArray.filter((video: Video) => video.subject === selectedSubject);
      
      // Filter by difficulty
      if (selectedDifficulty !== "all") {
        filtered = filtered.filter((video: Video) => 
          video.difficultyLevel.toLowerCase() === selectedDifficulty.toLowerCase()
        );
      }

      if(userClass) {
        filtered = filtered.filter((video: Video) => 
          video.className === userClass.replaceAll("class", "")
        );
      }
      
      // Filter by search query (case-insensitive title search)
      if (searchQuery.trim()) {
        filtered = filtered.filter((video: Video) => 
          video.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setVideos(filtered);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading videos...</p>;
  }

  return (
    <div>
      {/* Videos Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all"
          >
            {/* Video Thumbnail */}
            <div className="relative w-full pt-[56.25%] bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <iframe
                src={getYouTubeEmbedUrl(video.url)}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-4 sm:p-5">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-3 line-clamp-2">
                {video.title}
              </h3>
              <motion.button
                onClick={() => window.open(getYouTubeWatchUrl(video.url), "_blank")}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white py-2 sm:py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                🎬 Watch on YouTube
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
