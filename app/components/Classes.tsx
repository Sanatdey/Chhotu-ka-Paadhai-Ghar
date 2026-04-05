import { motion } from "framer-motion";
import Link from "next/link";

export default function Classes() {
  return (
    <section id="classes" className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
          Choose Your Class Path 🎓
        </h3>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Each level is crafted for the perfect learning pace
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            id: "class1",
            title: "Class 1",
            desc: "Building Foundations",
            color: "from-blue-400 to-cyan-400",
            icon: "🌱",
            content: ["Basic Math", "Letter Learning", "Fun Stories"],
            href: "/dashboard/class-1",
          },
          {
            id: "class2",
            title: "Class 2",
            desc: "Growing Skills",
            color: "from-green-400 to-emerald-400",
            icon: "🌿",
            content: ["Addition & Subtraction", "Reading & Writing", "Puzzles & Games"],
            badge: "Most Popular",
            href: "/dashboard/class-2",
          },
          {
            id: "class3",
            title: "Class 3",
            desc: "Mastering Concepts",
            color: "from-purple-400 to-pink-400",
            icon: "🚀",
            content: ["Advanced Math", "Project Work", "Reasoning"],
            href: "/dashboard/class-3",
          },
        ].map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            className="relative group cursor-pointer"
          >
            {item.badge && (
              <div className="absolute -top-3 left-4 bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                ⭐ {item.badge}
              </div>
            )}

            <div className={`bg-gradient-to-br ${item.color} p-0.5 rounded-2xl`}>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{item.icon}</div>
                <h4 className="text-xl sm:text-2xl font-black text-gray-800">{item.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mt-1">
                  {item.desc}
                </p>

                <div className="mt-4 sm:mt-5 space-y-2">
                  {item.content.map((c) => (
                    <div
                      key={c}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"
                    >
                      <span className="text-lg">✓</span> {c}
                    </div>
                  ))}
                </div>
                  <Link href={item.href}>
                    <button className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-2.5 rounded-lg font-bold hover:shadow-lg transition-all text-sm sm:text-base">
                      Explore →
                    </button>
                  </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
