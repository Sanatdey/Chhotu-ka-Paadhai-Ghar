import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ active }: { active?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-purple-200 shadow-lg w-full">
        {/* Mobile & Desktop Layout */}
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-4 lg:py-6 xl:py-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 xl:gap-3 whitespace-nowrap cursor-pointer"
            >
              <Image 
                src="/logo.png" 
                alt="Chhotu ka Paadhai Ghar Logo" 
                width={56}
                height={56}
                className="w-9 sm:w-12 lg:w-14 xl:w-16 h-9 sm:h-12 lg:h-14 xl:h-16 drop-shadow-md hover:scale-110 transition-transform"
                priority
              />
              <div>
                <h1 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight tracking-tight">
                  Chhotu ka
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent leading-tight tracking-tight">
                  Paadhai Ghar
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex gap-2 xl:gap-4 text-gray-700 font-semibold text-sm lg:text-base xl:text-lg flex-1 justify-center items-center">
                <Link href="/" className={`px-4 lg:px-5 xl:px-6 py-2 lg:py-3 rounded-lg hover:bg-red-100 hover:text-red-700 ${active === 'home' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4' : ''} transition-all duration-200 flex items-center gap-1`}>
                  🏠 Home
                </Link>
                <Link href="/dashboard/class-1" className={`px-4 lg:px-5 xl:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-100 hover:text-blue-700 ${active === 'class-1' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4' : ''} transition-all duration-200`}>
                 📺 Class 1
                </Link>
                <Link href="/dashboard/class-2" className={`px-4 lg:px-5 xl:px-6 py-2 lg:py-3 rounded-lg hover:bg-green-100 hover:text-green-700 ${active === 'class-2' ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white px-4' : ''} transition-all duration-200`}>
                  📺 Class 2
                </Link>
                <Link href="/dashboard/class-3" className={`px-4 lg:px-5 xl:px-6 py-2 lg:py-3 rounded-lg hover:bg-purple-100 hover:text-purple-700 ${active === 'class-3' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4' : ''} transition-all duration-200`}>
                  📺 Class 3
                </Link>
                
          </nav>

          {/* Right Side: Join Free (desktop) + Menu Toggle (mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-2xl text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </motion.button>

            {/* Get Started or Logout Button */}
            {isClient && user ? (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.08, boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:block bg-gradient-to-r from-red-600 to-red-700 text-white px-5 sm:px-7 lg:px-8 xl:px-10 py-2 sm:py-2.5 lg:py-3 xl:py-3.5 rounded-full shadow-lg font-bold text-sm sm:text-base lg:text-lg xl:text-xl hover:shadow-2xl transition-all whitespace-nowrap"
              >
                Logout
              </motion.button>
            ) : (
              <Link href="/auth/register">
                <motion.button 
                  whileHover={{ scale: 1.08, boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:block bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-5 sm:px-7 lg:px-8 xl:px-10 py-2 sm:py-2.5 lg:py-3 xl:py-3.5 rounded-full shadow-lg font-bold text-sm sm:text-base lg:text-lg xl:text-xl hover:shadow-2xl transition-all whitespace-nowrap"
                >
                  Get Started
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-purple-200 px-3 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4"
        >
          {isClient && user ? (
            <>
              <Link href="/dashboard">
                <button className="w-full block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base text-left">
                  📚 Dashboard
                </button>
              </Link>
              <Link href="/admin">
                <button className="w-full block text-gray-700 font-semibold hover:text-purple-600 py-2 sm:py-2.5 text-sm sm:text-base text-left">
                  🎛️ Admin Panel
                </button>
              </Link>
              <a
                href="#"
                className="block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                👤 {user.name}
              </a>
              <a
                href="#"
                className="block text-gray-700 font-semibold text-xs sm:text-sm py-1"
              >
                Class {user.class?.slice(-1)}
              </a>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all mt-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="#classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                Class 1
              </a>
              <a
                href="#classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                Class 2
              </a>
              <a
                href="#classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                Class 3
              </a>
              <a
                href="#video"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 font-semibold hover:text-purple-600 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                📺 Videos
              </a>
              <Link href="/auth/login">
                <button className="w-full block text-gray-700 font-semibold hover:text-blue-600 py-2 sm:py-2.5 text-sm sm:text-base text-left">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="w-full sm:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold mt-3 sm:mt-4 text-sm sm:text-base hover:shadow-lg transition-all">
                  Join Free
                </button>
              </Link>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}
