"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Video = {
  id?: number;
  title: string;
  subject: "maths" | "english" | "evs";
  difficultyLevel: "easy" | "medium" | "hard";
  url: string;
  className : "1" | "2" |"3";
  remark?: string;
};

export default function AdminVideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Video>({
    title: "",
    subject: "maths",
    difficultyLevel: "easy",
    url: "",
    remark: "",
    className : "1",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content/videos");
      const data = await res.json();
      // Ensure data is an array
      const videoArray = Array.isArray(data) ? data : [];
      setVideos(videoArray);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch("/api/content/videos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchVideos();
      }
    } catch (error) {
      console.error("Failed to save video:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData(video);
    setEditingId(video.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch("/api/content/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "maths",
      difficultyLevel: "easy",
      url: "",
      remark: "",
        className : "1",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-6"
      >
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            + Add New Video
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Video Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                required
              />

              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value as any })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="maths">📐 Maths</option>
                <option value="english">📚 English</option>
                <option value="evs">🌱 EVS</option>
              </select>

              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as any })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="easy">⭐ Easy</option>
                <option value="medium">⭐⭐ Medium</option>
                <option value="hard">⭐⭐⭐ Hard</option>
              </select>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value as any })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value={"1"}>📚 Class 1</option>
                <option value={"2"}>📚 Class 2</option>
                <option value={"3"}>📚 Class 3</option>
              </select>

              <input
                type="text"
                placeholder="YouTube URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                required
              />
            </div>

            <textarea
              placeholder="Remark (internal notes - not visible to users)"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {editingId ? "💾 Update" : "➕ Add"} Video
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Videos List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-600">No videos yet</p>
        ) : (
          videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Subject: <span className="font-semibold">{video.subject}</span> | 
                    Difficulty: <span className="font-semibold">{video.difficultyLevel}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    URL: {video.url}
                  </p>
                  {video.remark && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      📝 Note: {video.remark}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id!)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
