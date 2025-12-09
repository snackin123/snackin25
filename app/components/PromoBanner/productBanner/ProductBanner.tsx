"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Snowflake, Gift, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

// TypeScript FIX
interface SnowflakeData {
  top: string;
  left: string;
  duration: string;
  delay: string;
}

export default function ChristmasPromo() {
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);

  // Generate stable snowflakes only on client
  useEffect(() => {
    const flakes = Array.from({ length: 16 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 4}s`,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <section
      className="
        relative w-full min-h-[320px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[500px]
        bg-gradient-to-b from-[#0d1117] via-[#14212e] to-[#0d1117]
        text-white font-['Poppins'] overflow-hidden flex items-center justify-center
        px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12 md:py-16 lg:py-20
        rounded-2xl sm:rounded-3xl shadow-xl
        mt-14 sm:mt-18 md:mt-22 lg:mt-26
      "
    >
      {/* SNOW - Hydration Safe */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {snowflakes.map((f, i) => (
          <div
            key={i}
            className="absolute w-[3px] sm:w-[4px] h-[3px] sm:h-[4px] bg-white rounded-full animate-snow"
            style={{
              top: f.top,
              left: f.left,
              animationDuration: f.duration,
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">

        {/* LABEL */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-blue-200/90 uppercase tracking-widest text-xs sm:text-sm md:text-base mb-3 sm:mb-4"
        >
          <div className="flex justify-center items-center gap-2">
            <Snowflake className="w-4 h-4" /> Christmas Offer <Snowflake className="w-4 h-4" />
          </div>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-3 sm:mb-4"
        >
          <span className="block">Celebrate Christmas</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mt-1">
            With Big Holiday Savings
          </span>
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 max-w-xl sm:max-w-2xl mx-auto leading-relaxed sm:leading-loose mb-6 sm:mb-8"
        >
          Christmas Special: Enjoy <span className="text-blue-200 font-semibold">25% OFF</span> on 
          <span className="text-blue-100 font-semibold">₹250+ orders</span> — the perfect little gift from us to you.
        </motion.p>

        {/* FROSTED CTA BUTTON */}
        <div className="flex justify-center">
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05, backdropFilter: "blur(12px)" }}
              whileTap={{ scale: 0.96 }}
              className="
                relative px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 rounded-full
                font-semibold text-white bg-white/10 backdrop-blur-md
                border border-white/20 shadow-lg hover:bg-white/20
                transition-all flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base lg:text-lg
              "
            >
              <Snowflake className="w-4 sm:w-5 h-4 sm:h-5" />
              Unlock Christmas Deal
              <Snowflake className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.button>
          </Link>
        </div>

        {/* TRUST ICONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm md:text-base text-white/60"
        >
          <div className="flex items-center gap-1 sm:gap-2"><Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-300" /> Festive Savings</div>
          {/* <div className="flex items-center gap-1 sm:gap-2"><Gift className="w-3 sm:w-4 h-3 sm:h-4 text-blue-300" /> Free Items</div> */}
          <div className="flex items-center gap-1 sm:gap-2"><Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-white" /> Limited Offer</div>
        </motion.div>
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes snow {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        .animate-snow {
          animation-name: snow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  );
}
