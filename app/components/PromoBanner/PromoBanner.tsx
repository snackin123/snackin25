'use client';

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const navratriDays = [
  { dayName: 'Pratipada', date: '22 Sept', gradientFrom: '#ffffff', gradientTo: '#f1f5f9', button: 'bg-white text-black hover:bg-slate-100', textColor: 'text-black' },
  { dayName: 'Dwitiya', date: '23 Sept', gradientFrom: '#ef4444', gradientTo: '#b91c1c', button: 'bg-red-600 text-white hover:bg-red-700', textColor: 'text-red-600' },
  { dayName: 'Tritiya', date: '24 Sept', gradientFrom: '#2563eb', gradientTo: '#4f46e5', button: 'bg-blue-600 text-white hover:bg-blue-700', textColor: 'text-blue-600' },
  { dayName: 'Chaturthi', date: '25 Sept', gradientFrom: '#facc15', gradientTo: '#f59e0b', button: 'bg-yellow-400 text-black hover:bg-yellow-500', textColor: 'text-yellow-400' },
  { dayName: 'Panchami', date: '26 Sept', gradientFrom: '#16a34a', gradientTo: '#059669', button: 'bg-green-600 text-white hover:bg-green-700', textColor: 'text-green-600' },
  { dayName: 'Shashti', date: '27 Sept', gradientFrom: '#9ca3af', gradientTo: '#6b7280', button: 'bg-gray-500 text-white hover:bg-gray-600', textColor: 'text-gray-500' },
  { dayName: 'Saptami', date: '28 Sept', gradientFrom: '#f97316', gradientTo: '#dc2626', button: 'bg-orange-500 text-white hover:bg-orange-600', textColor: 'text-orange-500' },
  { dayName: 'Ashtami', date: '29 Sept', gradientFrom: '#0f766e', gradientTo: '#047857', button: 'bg-emerald-600 text-white hover:bg-emerald-700', textColor: 'text-emerald-600' },
  { dayName: 'Navami', date: '30 Sept', gradientFrom: '#ec4899', gradientTo: '#db2777', button: 'bg-pink-500 text-white hover:bg-pink-600', textColor: 'text-pink-500' },
];

export default function NavratriPromoBanner() {
  const [dayIndex, setDayIndex] = useState(0);
  const [demoMode, setDemoMode] = useState(false); // Demo mode disabled by default

  // Set current day based on real date if demoMode off
  useEffect(() => {
    if (!demoMode) {
      const today = new Date();
      const startDate = new Date('2025-09-22');
      const endDate = new Date('2025-10-02');
      if (today >= startDate && today <= endDate) {
        const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        setDayIndex(Math.min(diffDays, navratriDays.length - 1)); // Ensure we don't exceed the array bounds
      } else {
        setDayIndex(0);
      }
    }
  }, [demoMode]);

  // Demo loop every 10 sec
  useEffect(() => {
    if (!demoMode) return;
    const interval = setInterval(() => {
      setDayIndex((prev) => (prev + 1) % navratriDays.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [demoMode]);

  const todayDay = navratriDays[dayIndex];

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
          backgroundSize: 'cover, contain',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center, right',
        }}
      >
        <div className="z-10 w-full sm:w-[55%] md:w-[58%] lg:w-[60%] px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center">
          <div className="bg-white/95 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm w-full">
            
            {/* Title with dynamic color */}
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 ${todayDay.textColor}`}>
              Dance • Celebrate • snackin' Energy
            </h2>

            {/* Day name & date with dynamic color */}
            <p className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 ${todayDay.textColor}`}>
              Today: <span className="font-bold">{todayDay.dayName}</span> ({todayDay.date})
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-rose-800 font-medium mb-4">
              Power through <span className="font-bold text-red-600">Garba nights</span> with snackin' raisins! Get <span className="font-bold text-orange-600">₹100 OFF</span> on any 4+ packs - festive fuel for dance, devotion, and togetherness.
            </p>

            {/* CTA + Timer */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`font-semibold rounded-full px-6 py-3 text-base transition-colors duration-300 ${todayDay.button}`}
                onClick={() => window.location.href = '/cart'}
              >
                🪔 Claim {todayDay.dayName} Offer
              </motion.button>

              <div className={`flex items-center gap-2 text-sm sm:text-base px-4 py-2 rounded-full border border-gray-300 font-medium shadow-sm ${todayDay.textColor}`}>
                <Clock className="w-4 h-4" />
                <span>Ends {todayDay.date}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Durga Face Image on the right side */}
        <div className="hidden sm:flex items-center justify-center w-[45%] md:w-[42%] lg:w-[40%] pr-4 lg:pr-8">
          <img 
            src="/promtional/Durga-Face.png" 
            alt="Durga Face" 
            className="max-h-[280px] md:max-h-[320px] lg:max-h-[360px] object-contain"
          />
        </div>
        
      </motion.div>
    </motion.div>
  );
}
