"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { title } from "process";
import { trackEvent } from "@/app/lib/gtag";

type Question = {
  id: number;
  question: string;
  answer: string;
  type: "text" | "number";
};

type Worksheet = {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
  error: string;
};

export default function SolvePage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;

  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
  trackEvent("solve_view", {
    worksheet_id: "w1",
  });
    const fetchWorksheet = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/content/worksheets/${worksheetId}`);
        const data = await res.json();
        
        // Parse questions if it's a string
        let questions = data && data.questions && data.questions.questions ? data.questions.questions : [];
        if (typeof questions === "string") {
          questions = JSON.parse(questions);
        }
        
        const processedWorksheet = {
          ...data,
          questions: Array.isArray(questions) ? questions : [],
          title: data.questions.title || data.title || "Untitled Worksheet",
          description: data.questions.description || data.description || "",
        };
        
        setWorksheet(processedWorksheet);
        
        // Initialize answers object
        const answers: Record<number, string> = {};
        (processedWorksheet.questions || []).forEach((q: Question) => {
          answers[q.id] = "";
        });
        setUserAnswers(answers);
        
        console.log("Worksheet loaded:", processedWorksheet);
      } catch (error) {
        console.error("Failed to fetch worksheet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheet();
  }, [worksheetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading worksheet...</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log("Worksheet:", worksheet);
  console.log("Questions array:", worksheet?.questions);
  console.log("Is questions array?", Array.isArray(worksheet?.questions));
  console.log("Questions length:", worksheet?.questions?.length);

  if (!worksheet || !worksheet.questions || worksheet.questions.length === 0) {
    const hasError = worksheet?.error;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg max-w-lg">
          <p className="text-gray-600 font-semibold text-lg">⚠️ No questions found</p>
          {hasError && (
            <p className="text-red-600 font-semibold text-sm mt-2">Error: {worksheet.error}</p>
          )}
          <div className="mt-4 text-left text-xs bg-gray-100 p-4 rounded font-mono max-h-64 overflow-y-auto border border-gray-300">
            <p className="font-bold mb-2 text-gray-800">📋 Debug Information:</p>
            <details className="space-y-2">
              <summary className="cursor-pointer font-bold text-gray-700 hover:text-gray-900">Show Full Data</summary>
              <pre className="text-xs mt-2 overflow-x-auto text-gray-700 bg-white p-2 rounded">{JSON.stringify(worksheet, null, 2)}</pre>
            </details>
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = worksheet.questions[currentIndex];
  const totalQuestions = worksheet.questions.length;
  const isAnswered = submitted[currentQuestion.id];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: e.target.value,
    });
  };

  const handleSubmitAnswer = () => {
    const userAnswer = userAnswers[currentQuestion.id]?.trim().toLowerCase() || "";
    const correctAnswer = currentQuestion.answer.trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    setSubmitted({
      ...submitted,
      [currentQuestion.id]: true,
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    // Auto-move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const isCorrect =
    isAnswered &&
    userAnswers[currentQuestion.id]?.trim().toLowerCase() ===
      currentQuestion.answer.trim().toLowerCase();

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers(
      worksheet.questions.reduce(
        (acc, q) => ({ ...acc, [q.id]: "" }),
        {}
      )
    );
    setSubmitted({});
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isGreat = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-6">{isGreat ? "🎉" : "💡"}</div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            {isGreat ? "Great Job!" : "Try Again"}
          </h1>

          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl py-6 mb-6">
            <p className="text-5xl font-bold">{score}/{totalQuestions}</p>
            <p className="text-lg mt-2">{percentage}%</p>
          </div>

          <p className="text-gray-600 text-lg mb-8">
            {isGreat
              ? "You did an amazing job! Keep it up! 🌟"
              : "Good effort! Practice more to improve! 💪"}
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold transition-all"
            >
              🔄 Retry
            </motion.button>
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold transition-all"
            >
              ← Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-8 mb-6"
        >
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-2">
            {worksheet.title}
          </h1>
          {worksheet.description && (
            <p className="text-gray-600 text-sm sm:text-base mb-4">{worksheet.description}</p>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center font-semibold">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-8 mb-6"
        >
          <div className="text-5xl text-center mb-6">{worksheet.description}</div>

          <p className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-8">
            {currentQuestion.question}
          </p>

          {/* Answer Input */}
          {!isAnswered ? (
            <>
              <input
                type={currentQuestion.type === "number" ? "number" : "text"}
                value={userAnswers[currentQuestion.id] || ""}
                onChange={handleInputChange}
                placeholder="Type your answer..."
                disabled={isAnswered}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-600 transition font-semibold"
                onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
              />

              <motion.button
                onClick={handleSubmitAnswer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg transition-all"
              >
                ✅ Submit
              </motion.button>
            </>
          ) : (
            <>
              {/* Feedback */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`p-6 rounded-xl text-center mb-6 ${
                  isCorrect
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-red-100 border-2 border-red-500"
                }`}
              >
                <p className="text-2xl mb-2">{isCorrect ? "✅ Correct!" : "❌ Wrong"}</p>
                <p className={`font-bold text-lg ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}>
                  {isCorrect
                    ? "Great work!"
                    : `The correct answer is: ${currentQuestion.answer}`}
                </p>
              </motion.div>

              {/* Navigation */}
              {currentIndex < totalQuestions - 1 && (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold text-lg transition-all"
                >
                  ➜ Next Question
                </motion.button>
              )}
              {currentIndex === totalQuestions - 1 && (
                <motion.button
                  onClick={() => setFinished(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold text-lg transition-all"
                >
                  🏁 Finish
                </motion.button>
              )}
            </>
          )}
        </motion.div>

        {/* Score Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600 font-semibold">Current Score</p>
          <p className="text-3xl font-bold text-purple-600">
            {score}/{totalQuestions}
          </p>
        </div>
      </div>
    </div>
  );
}
