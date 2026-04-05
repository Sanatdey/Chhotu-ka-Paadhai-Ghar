import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 mb-16 sm:mb-20">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white p-6 sm:p-12 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

        <div className="relative text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
            Ready to Transform Learning? 🌟
          </h3>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-95 max-w-2xl mx-auto mb-4 sm:mb-8">
            Join thousands of happy families. Start with 5 free worksheets today—no credit card
            needed!
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center mx-auto max-w-sm sm:max-w-none sm:flex-row">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-purple-600 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                🚀 Get Started Free
              </motion.button>
            </Link>
            <Link href="/dashboard/class-1">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:bg-white/10 transition-all"
            >
              📚 Explore All Classes
            </motion.button>
            </Link>
          </div>

          <p className="mt-4 sm:mt-6 text-xs sm:text-sm opacity-90">
            ✅ All Free
          </p>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
