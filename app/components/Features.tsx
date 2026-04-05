import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-2">
          Premium Package Inside 📦
        </h3>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Everything your child needs to excel
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            id: "worksheets",
            icon: "📄",
            title: "300+ Worksheets(Comming soon)",
            desc: "Printable, colorful, engaging sheets",
            color: "from-blue-400 to-cyan-400",
          },
          {
            id: "videos",
            icon: "🎥",
            title: "Video Lessons(Comming soon)",
            desc: "10-minute clips explaining each concept",
            color: "from-purple-400 to-pink-400",
          },
          {
            id: "tests",
            icon: "📊",
            title: "Practice Tests(Comming soon)",
            desc: "Assess learning with fun quizzes",
            color: "from-green-400 to-emerald-400",
          },
          {
            id: "badges",
            icon: "🏆",
            title: "Achievement Badges",
            desc: "Celebrate wins with digital stickers",
            color: "from-yellow-400 to-orange-400",
          },
          {
            id: "resources",
            icon: "👨‍🏫",
            title: "Parent Resources",
            desc: "Tips to support learning at home",
            color: "from-red-400 to-pink-400",
          },
          {
            id: "updates",
            icon: "🔄",
            title: "Lifetime Updates",
            desc: "New content added every month",
            color: "from-indigo-400 to-purple-400",
          },
        ].map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
          >
            <div className={`bg-gradient-to-br ${f.color} p-4 sm:p-6 h-full`}>
              <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{f.icon}</div>
              <h4 className="font-bold text-base sm:text-lg text-white mb-1">{f.title}</h4>
              <p className="text-white/90 text-xs sm:text-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
