"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  class: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "class1",
  });
  const [passwordReset, setPasswordReset] = useState<{
    userId: number | null;
    newPassword: string;
  }>({ userId: null, newPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setFormData({
      name: user.name,
      email: user.email,
      class: user.class,
    });
    setEditingId(user.id);
  };

  const handleUpdateUser = async () => {
    if (!editingId) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
        }),
      });

      if (res.ok) {
        setMessage("✅ User updated successfully");
        fetchUsers();
        setEditingId(null);
        setFormData({ name: "", email: "", class: "class1" });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setMessage("❌ Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (userId: number) => {
    if (!passwordReset.newPassword || passwordReset.newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: passwordReset.newPassword }),
      });

      if (res.ok) {
        setMessage("✅ Password reset successfully");
        setPasswordReset({ userId: null, newPassword: "" });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
      setMessage("❌ Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessage("✅ User deleted successfully");
        fetchUsers();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      setMessage("❌ Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg"
        >
          {message}
        </motion.div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found</p>
        ) : (
          users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-6 space-y-4"
            >
              {/* User Basic Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">📧 {user.email}</p>
                  <p className="text-sm text-gray-600">
                    📚 {user.class} {user.isAdmin && "| 👑 Admin"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setPasswordReset({ userId: user.id, newPassword: "" })}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm hover:bg-yellow-600"
                  >
                    🔑 Reset Password
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Edit Form - Show when editing this user */}
              {editingId === user.id && (
                <div className="border-t border-purple-200 pt-4 space-y-3 bg-purple-50/50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">Edit User Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                    <select
                      value={formData.class}
                      onChange={(e) =>
                        setFormData({ ...formData, class: e.target.value })
                      }
                      className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                    >
                      <option value="class1">Class 1</option>
                      <option value="class2">Class 2</option>
                      <option value="class3">Class 3</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateUser}
                      disabled={submitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting ? "💾 Saving..." : "💾 Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold text-sm hover:bg-gray-600"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Password Reset Form */}
              {passwordReset.userId === user.id && (
                <div className="border-t border-purple-200 pt-4 space-y-3 bg-yellow-50/50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">🔑 Reset Password</h4>
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={passwordReset.newPassword}
                    onChange={(e) =>
                      setPasswordReset({
                        ...passwordReset,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      disabled={submitting}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold text-sm hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {submitting ? "⏳ Resetting..." : "🔑 Reset Now"}
                    </button>
                    <button
                      onClick={() =>
                        setPasswordReset({ userId: null, newPassword: "" })
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold text-sm hover:bg-gray-600"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
