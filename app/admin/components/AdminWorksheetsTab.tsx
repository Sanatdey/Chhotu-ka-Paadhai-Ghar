"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { title } from "process";
import { json } from "stream/consumers";

type Worksheet = {
  id?: number;
  title: string;
  description?: string;
  class: 1|2|3;
  subject: "maths" | "english" | "evs";
  difficultyLevel: "easy" | "medium" | "hard";
  pdfUrl: string;
  solutionVideoUrl?: string;
  questions?: Array<{ id: number; question: string; answer: string; type: "text" | "number" }>;
  remark?: string;
};

export default function AdminWorksheetsTab() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [formData, setFormData] = useState<Worksheet>({
    title: "",
    description: "",
    subject: "maths",
    difficultyLevel: "easy",
    pdfUrl: "",
    solutionVideoUrl: "",
    questions: [],
    remark: "",
    class: 1
  });
  const [questionsJson, setQuestionsJson] = useState<string>("[]");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content/worksheets");
      const data = await res.json();
      // Ensure data is an array
      const worksheetArray = Array.isArray(data) ? data : [];
      setWorksheets(worksheetArray);
    } catch (error) {
      console.error("Failed to fetch worksheets:", error);
      setWorksheets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      // Parse questions JSON
      let questions = [];
      let title = formData.title;
      let desc = formData.description;
      
      try {
        const trimmedJson = questionsJson.trim();
        
        if (trimmedJson && trimmedJson !== "[]") {
          const parsed = JSON.parse(trimmedJson);
          
          // Handle both formats:
          // 1. Direct array: [{"id": 1, ...}, ...]
          // 2. Object with questions key: {"questions": [...], ...}
          if (Array.isArray(parsed)) {
            questions = parsed;
          } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.questions)) {
            questions = parsed.questions;
          } else {
            throw new Error("JSON must be an array of questions OR an object with a 'questions' array property");
          }
          title = parsed.title || title;
          desc = parsed.description || desc;
        }
      } catch (parseError) {
        const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        setMessage(`❌ JSON Error: ${errorMsg}`);
        setMessageType("error");
        setSubmitting(false);
        console.error("JSON Parse Error:", parseError);
        return;
      }

      const jsonData = {
        title : title,
        description: desc,
        questions: questions.length > 0 ? questions : null,
      }
      
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...formData,
        id: editingId,
        json: jsonData,
      };
      
      console.log("Sending payload:", payload);

      const res = await fetch("/api/content/worksheets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);
      console.log("Saved questions:", data.questions);

      if (res.ok) {
        setMessage(`✅ Worksheet ${editingId ? "updated" : "created"} successfully!`);
        setMessageType("success");
        resetForm();
        fetchWorksheets();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to save worksheet"}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Failed to save worksheet:", error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Failed to save worksheet"}`);
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (worksheet: Worksheet) => {
    setFormData(worksheet);
    setEditingId(worksheet.id || null);
    setQuestionsJson(worksheet.questions ? JSON.stringify(worksheet.questions, null, 2) : "[]");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this worksheet?")) return;

    try {
      const res = await fetch("/api/content/worksheets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchWorksheets();
      }
    } catch (error) {
      console.error("Failed to delete worksheet:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "maths",
      difficultyLevel: "easy",
      pdfUrl: "",
      solutionVideoUrl: "",
      questions: [],
      remark: "",
      class: 1
    });
    setQuestionsJson("[]");
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
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
            + Add New Worksheet
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Worksheet Title"
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
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value as any })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value={"1"}>📚 Class 1</option>
                <option value={"2"}>📚 Class 2</option>
                <option value={"3"}>📚 Class 3</option>
              </select>

              <input
                type="url"
                placeholder="PDF URL"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                required
              />

              <input
                type="text"
                placeholder="Solution Video URL (YouTube link)"
                value={formData.solutionVideoUrl}
                onChange={(e) => setFormData({ ...formData, solutionVideoUrl: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>
            

            {/* Questions JSON Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Questions (JSON) - Optional
                </label>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (questionsJson.trim()) {
                        const parsed = JSON.parse(questionsJson);
                        
                        // If it's an object with questions key, format the whole object
                        // Otherwise format just the array
                        let toFormat = parsed;
                        if (!Array.isArray(parsed) && parsed?.questions) {
                          toFormat = parsed;
                        }
                        
                        const formatted = JSON.stringify(toFormat, null, 2);
                        setQuestionsJson(formatted);
                        setMessage("✅ JSON formatted successfully");
                        setMessageType("success");
                        setTimeout(() => setMessage(""), 2000);
                      }
                    } catch (error) {
                      setMessage("❌ Invalid JSON - cannot format");
                      setMessageType("error");
                    }
                  }}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  🔧 Format JSON
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded border border-blue-200">
                <strong>Each question must have:</strong> id (number), question (text), answer (text), type ("text" or "number")
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Formats Accepted:</strong> <br/>✅ Direct array OR ✅ Object with "questions" key
              </p>
              <details className="text-xs mb-3 cursor-pointer">
                <summary className="font-semibold text-gray-700">📋 Show Examples</summary>
                <div className="bg-gray-100 p-2 rounded mt-2 text-xs font-mono overflow-x-auto text-gray-700 space-y-2">
                  <div>
                    <p className="font-bold mb-1">Format 1: Direct Array</p>
                    <pre>{`[
  {"id": 1, "question": "12 + 5 = ___", "answer": "17", "type": "number"},
  {"id": 2, "question": "Is the sky blue?", "answer": "yes", "type": "text"}
]`}</pre>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Format 2: Object with "questions" key</p>
                    <pre>{`{
  "title": "worksheet 1",
  "description": "desc 1",
  "questions": [
    {"id": 1, "question": "12 + 5 = ___", "answer": "17", "type": "number"},
    {"id": 2, "question": "Is the sky blue?", "answer": "yes", "type": "text"}
  ]
}`}</pre>
                  </div>
                </div>
              </details>
              <textarea
                placeholder='Paste your JSON here: either a direct array or an object with a "questions" key'
                value={questionsJson}
                onChange={(e) => setQuestionsJson(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 font-mono text-sm bg-white"
                rows={8}
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
                    {editingId ? "💾 Update" : "➕ Add"} Worksheet
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

      {/* Worksheets List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : worksheets.length === 0 ? (
          <p className="text-center text-gray-600">No worksheets yet</p>
        ) : (
          worksheets.map((worksheet, index) => (
            <motion.div
              key={worksheet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{worksheet.title}</h3>
                  {worksheet.description && (
                    <p className="text-sm text-gray-600 mt-1">{worksheet.description}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Subject: <span className="font-semibold">{worksheet.subject}</span> | 
                    Difficulty: <span className="font-semibold">{worksheet.difficultyLevel}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    PDF URL: {worksheet.pdfUrl}
                  </p>
                  {worksheet.solutionVideoUrl && (
                    <p className="text-xs text-green-600 mt-1 truncate">
                      ✅ Solution Video: {worksheet.solutionVideoUrl}
                    </p>
                  )}
                  {!worksheet.solutionVideoUrl && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ No solution video added
                    </p>
                  )}
                  {worksheet.questions && Array.isArray(worksheet.questions) && worksheet.questions.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✅ Interactive Quiz: {worksheet.questions.length} questions
                    </p>
                  )}
                  {(!worksheet.questions || !Array.isArray(worksheet.questions) || worksheet.questions.length === 0) && (
                    <p className="text-xs text-gray-500 mt-1">
                      ℹ️ No interactive questions added
                    </p>
                  )}
                  {worksheet.remark && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      📝 Note: {worksheet.remark}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(worksheet)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(worksheet.id!)}
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
