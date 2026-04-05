import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* LEFT - HERO TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-blue-700 mb-3 sm:mb-4">
          ✨ For Class 1-3 Learners
        </div>

        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
          Learn Like Playing,
        </h2>
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-gray-800 mb-4 sm:mb-6">
          Grow Forever 🚀
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-md">
          Premium worksheets & tips designed with ❤️ for young learners. No pressure, just progress—one fun day at a time!
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/dashboard">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg font-bold text-sm sm:text-lg hover:shadow-xl transition-all"
            >
                🎓 Start Learning Free
            </motion.button>
          </Link>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full lg:w-auto border-2 border-purple-300 text-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-purple-50 transition-all text-sm sm:text-base"
            >
            📥 Free Worksheet
          </motion.button>
            </Link>
        </div>

        {/* TRUST BADGES - PREMIUM */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
          <div className="bg-green-50 text-green-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            ✅ 10K+ Happy Kids
          </div>
          <div className="bg-blue-50 text-blue-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            ⭐ Parent Approved
          </div>
          <div className="bg-pink-50 text-pink-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            🎯 Proven Results
          </div>
        </div>
      </motion.div>

      {/* RIGHT - PREMIUM CARD WITH ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative hidden sm:block"
      >
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-300 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-2xl"></div>

        <div className="relative bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-purple-100 backdrop-blur-lg">
          <div className="text-5xl sm:text-6xl mb-4">📚</div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">
            Your Learning Journey
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Personalized journey for every learner
          </p>

          <div className="space-y-3">
            {[
              { id: "math", icon: "📝", title: "Math Made Easy", desc: "Fun & Interactive" },
              {
                id: "writing",
                icon: "✍️",
                title: "Writing Skills",
                desc: "Step by Step",
              },
              { id: "logic", icon: "🧩", title: "Logic & Reasoning", desc: "Brain Boost" },
            ].map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 8 }}
                className="bg-gradient-to-r from-blue-100 to-purple-100 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
