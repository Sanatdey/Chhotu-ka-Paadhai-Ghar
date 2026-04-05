import { motion } from "framer-motion";

export default function WhyItWorks() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Why Parents Love Us 💙
        </h3>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Proven approach trusted by 10K+ families
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            id: "playful",
            icon: "🎨",
            title: "Playful Learning",
            desc: "Learning feels like playing, not studying",
          },
          {
            id: "track",
            icon: "📊",
            title: "Track Progress",
            desc: "See real growth with weekly assessments",
          },
          {
            id: "parent",
            icon: "👨‍👩‍👧‍👦",
            title: "Parent Guides",
            desc: "We guide parents on how to help at home",
          },
          {
            id: "sessions",
            icon: "⏰",
            title: "15-Minute Sessions",
            desc: "Perfect bite-sized learning for busy kids",
          },
          {
            id: "confidence",
            icon: "🌟",
            title: "Confidence Building",
            desc: "Safe space to make mistakes and learn",
          },
          {
            id: "certified",
            icon: "🎓",
            title: "Certified Content",
            desc: "Aligned with school curriculum standards",
          },
        ].map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-all"
          >
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{item.icon}</div>
            <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">
              {item.title}
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
