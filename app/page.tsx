"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Classes from "./components/Classes";
import YoutubeSection from "./components/YoutubeSection";
import WhyItWorks from "./components/WhyItWorks";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { trackEvent } from "./lib/gtag";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {

  trackEvent("landing_view", {
    worksheet_id: "w1",
  });

    setIsClient(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      // Redirect to dashboard after 2 seconds if logged in
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }, []);

  // Show redirect message if user is logged in
  if (isClient && user) {
    return (
      <main className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black mb-4">
            👋 Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Redirecting to your dashboard...
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all"
          >
            Go to Dashboard Now
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-blue-50 via-purple-50 to-white min-h-screen text-gray-800 overflow-hidden">
      <Header active="home" />
      <Hero />
      <Classes />
      <YoutubeSection />
      <WhyItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
