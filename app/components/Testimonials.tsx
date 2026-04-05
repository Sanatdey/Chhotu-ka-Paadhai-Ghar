import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-2">
          Parents Are Loving It 💬
        </h3>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            id: "priya",
            name: "Priya M.",
            role: "Mom of 2",
            text: "My kids look forward to worksheets now! Best investment!",
          },
          {
            id: "raj",
            name: "Raj P.",
            role: "School Teacher",
            text: "Used in my class. Students' confidence improved dramatically!",
          },
          {
            id: "deepa",
            name: "Deepa S.",
            role: "Working Mom",
            text: "15 mins daily practice changed everything. Highly recommend!",
          },
        ].map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all"
          >
            <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
              {[...Array(5)].map((_, idx) => (
                <span key={`star-${idx}`} className="text-yellow-400 text-base sm:text-lg">
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-gray-700 italic mb-3 sm:mb-4 text-sm sm:text-base">
              "{t.text}"
            </p>
            <div className="border-t pt-2 sm:pt-3">
              <p className="font-bold text-gray-800 text-sm sm:text-base">{t.name}</p>
              <p className="text-xs sm:text-sm text-gray-600">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
