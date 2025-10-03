'use client';

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';

// Playfair Display for promo heading only
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

// Navratri days (only colors/styles, dates auto-generated)
const navratriDays = [
  { dayName: 'Pratipada', gradientFrom: '#ffffff', gradientTo: '#f1f5f9', button: 'bg-white text-black hover:bg-slate-100', textColor: 'text-black' },
  { dayName: 'Dwitiya', gradientFrom: '#ef4444', gradientTo: '#b91c1c', button: 'bg-red-600 text-white hover:bg-red-700', textColor: 'text-red-600' },
  { dayName: 'Tritiya', gradientFrom: '#2563eb', gradientTo: '#4f46e5', button: 'bg-blue-600 text-white hover:bg-blue-700', textColor: 'text-blue-600' },
  { dayName: 'Tritiya', gradientFrom: '#facc15', gradientTo: '#f59e0b', button: 'bg-yellow-400 text-black hover:bg-yellow-500', textColor: 'text-yellow-400' },
  { dayName: 'Chaturthi', gradientFrom: '#16a34a', gradientTo: '#059669', button: 'bg-green-600 text-white hover:bg-green-700', textColor: 'text-green-600' },
  { dayName: 'Panchami', gradientFrom: '#9ca3af', gradientTo: '#6b7280', button: 'bg-gray-500 text-white hover:bg-gray-600', textColor: 'text-gray-500' },
  { dayName: 'Shashti', gradientFrom: '#f97316', gradientTo: '#dc2626', button: 'bg-orange-500 text-white hover:bg-orange-600', textColor: 'text-orange-500' },
  { dayName: 'Saptami', gradientFrom: '#0f766e', gradientTo: '#047857', button: 'bg-emerald-600 text-white hover:bg-emerald-700', textColor: 'text-emerald-600' },
  { dayName: 'Ashtami', gradientFrom: '#ec4899', gradientTo: '#db2777', button: 'bg-pink-500 text-white hover:bg-pink-600', textColor: 'text-pink-500' },
  { dayName: 'Navami', gradientFrom: '#8b5cf6', gradientTo: '#6d28d9', button: 'bg-purple-600 text-white hover:bg-purple-700', textColor: 'text-purple-600' },
];

// Start date in IST (adjust year if needed)
const startDateIST = new Date(Date.UTC(2025, 8, 22, -5, -30)); // 22 Sept 2025 IST

// Helper: Get today in IST
function getISTDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 60 * 60000);
}

export default function NavratriPromoBanner() {
  const [dayIndex, setDayIndex] = useState(0);
  const [demoMode, setDemoMode] = useState(true);

  // Calculate real date in IST
  useEffect(() => {
    if (!demoMode) {
      const todayIST = getISTDate();
      const diffDays = Math.floor((todayIST.getTime() - startDateIST.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < navratriDays.length) {
        setDayIndex(diffDays);
      } else {
        setDayIndex(0);
      }
    }
  }, [demoMode]);

  // Demo mode: cycle every 5 sec
  useEffect(() => {
    if (!demoMode) return;
    const interval = setInterval(() => {
      setDayIndex((prev) => (prev + 1) % navratriDays.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [demoMode]);

  const todayDay = navratriDays[dayIndex];

  // Generate IST-based date label
  const dayDate = new Date(startDateIST);
  dayDate.setDate(startDateIST.getDate() + dayIndex);
  const dateLabel = dayDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 mt-6"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row justify-start bg-no-repeat min-h-[220px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-[400px]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${todayDay.gradientFrom}, ${todayDay.gradientTo}), url('/GIFT_BOX_BG.webp')`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, right',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/5 sm:bg-black/10 pointer-events-none" />

        {/* Left Side Content */}
        <div className="relative z-10 w-full sm:w-[55%] md:w-[58%] lg:w-[60%] px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center">
          <div className="bg-white/95 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm w-full">

            {/* Heading with Playfair Display */}
            <h2 
              className={`text-3xl sm:text-4xl md:text-5xl mb-2 font-extrabold ${todayDay.textColor} ${playfair.className}`}
            >
              Dance • Celebrate • Snackin' Energy
            </h2>

            {/* Day & Date */}
            <p className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 ${todayDay.textColor}`}>
              Navaratri <span className="font-bold">{todayDay.dayName}</span> ({dateLabel})
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-rose-800 font-medium mb-4">
              Power through <span className="font-bold text-red-600">Garba nights</span> with snackin' raisins! 
              Get <span className="font-bold text-orange-600">₹100 OFF</span> on any 4+ packs – festive fuel for dance, devotion, and togetherness.
            </p>

            {/* CTA + Timer */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-label={`Claim ${todayDay.dayName} Offer`}
                className={`font-semibold rounded-full px-6 py-3 text-base transition-colors duration-300 ${todayDay.button}`}
                onClick={() => window.location.href = '/cart'}
              >
                🪔 Claim {todayDay.dayName} Offer
              </motion.button>

              <div className={`flex items-center gap-2 text-sm sm:text-base px-4 py-2 rounded-full border border-gray-300 font-medium shadow-sm ${todayDay.textColor}`}>
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>Ends {dateLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden sm:flex items-center justify-center w-[45%] md:w-[42%] lg:w-[40%] pr-4 lg:pr-8 relative">
          <Image
            src="/promtional/Durga-Face.png"
            alt="Durga Face Illustration"
            width={400}
            height={400}
            priority
            className="max-h-[280px] md:max-h-[320px] lg:max-h-[360px] object-contain"
          />
        </div>

        {/* Demo toggle */}
        {/* <button
          onClick={() => setDemoMode((prev) => !prev)}
          className="absolute top-3 right-3 bg-white/80 text-xs px-3 py-1 rounded-full shadow-md hover:bg-white"
        >
          {demoMode ? 'Stop Demo' : 'Start Demo'}
        </button> */}
      </motion.div>
    </motion.div>
  );
}
