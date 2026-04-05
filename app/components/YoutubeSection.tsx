import { motion } from "framer-motion";
import Link from "next/link";

export default function YoutubeSection() {
  return (
    <section
      id="video"
      className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-50 via-red-50 to-pink-50 rounded-3xl border border-red-100 p-6 sm:p-10 lg:p-12">
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
          <div className="inline-block bg-red-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-red-700 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
            📺 YouTube Channel
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
            Weekly Tips & Videos 🎬
          </h3>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
            Follow our channel for exclusive tips, worksheet guides, and learning hacks for
            parents & teachers.
          </p>
          <Link href="https://www.youtube.com/@ChhotukaPaadhaiGhar?sub_confirmation=1" target="_blank">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-lg transition-all text-sm sm:text-base"
            >
              Subscribe Now 🔴
            </motion.button>
          </Link>
        </motion.div>
        <Link href="https://www.youtube.com/@ChhotukaPaadhaiGhar" target="_blank">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl p-1"
        >
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-center">
            <div className="text-5xl sm:text-6xl mb-2 sm:mb-3">🎥</div>
            <p className="text-white font-bold text-sm sm:text-base">Visit Our Channel</p>
          </div>
        </motion.div>
        </Link>
      </div>
      </div>
    </section>
  );
}
      