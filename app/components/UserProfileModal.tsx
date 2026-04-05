"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdate: (updatedUser: any) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdate,
}: UserProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (formData.name.trim() === "" && formData.newPassword === "") {
      setMessage("❌ Please update either name or password");
      setMessageType("error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          name: formData.name,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        setMessageType("success");
        
        // Update localStorage
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onProfileUpdate(updatedUser);

        // Reset form
        setTimeout(() => {
          setFormData({
            name: updatedUser.name,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setMessage("");
        }, 2000);
      } else {
        setMessage(`❌ ${data.error}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Failed to update profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-black">👤 My Profile</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current User Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 space-y-2">
            <p className="text-sm text-gray-600">📧 Email</p>
            <p className="font-bold text-lg text-gray-800">{user?.email}</p>
            <p className="text-sm text-gray-600 mt-3">📚 Class</p>
            <p className="font-bold text-lg text-gray-800">Class {user?.class?.slice(-1)}</p>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg font-semibold text-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📝 Update Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-all"
              />
            </div>

            {/* Password Section */}
            <div className="border-t-2 border-purple-200 pt-4">
              <h3 className="font-bold text-gray-700 mb-3">🔒 Change Password</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-400 transition-all"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
