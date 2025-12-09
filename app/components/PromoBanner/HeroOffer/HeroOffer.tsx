"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useRef, useEffect, memo } from "react";

/* ------------------ ICONS (memoized) ------------------ */

type ChristmasIconType = "snowflake" | "star" | "holly";

const SnowflakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15,8.5 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8.5" />
  </svg>
);

const HollyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,6C18.2,6 17.5,5.5 17,4.7C16.5,5.5 15.8,6 15,6C13.3,6 12,4.7 12,3C12,4.7 10.7,6 9,6C8.2,6 7.5,5.5 7,4.7C6.5,5.5 5.8,6 5,6C3.3,6 2,4.7 2,3H22C22,4.7 20.7,6 19,6Z" />
  </svg>
);

const ICON_COMPONENTS: Record<
  ChristmasIconType,
  React.ComponentType<{ className?: string }>
> = {
  snowflake: SnowflakeIcon,
  star: StarIcon,
  holly: HollyIcon,
};

const ChristmasPatternIcon = memo(function ChristmasPatternIcon({
  type = "snowflake",
  className = "w-4 h-4",
}: {
  type?: ChristmasIconType;
  className?: string;
}) {
  const Icon = ICON_COMPONENTS[type];
  return <Icon className={className} />;
});

/* ----------------------------- HERO COMPONENT ---------------------------- */

export default function HeroOffer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const videoSrc = "/promtional/Christmas Web Banner_2.mp4";
  const fallbackImage = "/promtional/Christmas Web Banner_2.jpg";

  /* -------------------------- Real Autoplay Logic -------------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Required for autoplay on iOS
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    // Single autoplay attempt (Safari requires this)
    video.play().catch(() => {
      // If autoplay fails silently, do NOT retry or Safari will block it
      console.log("Autoplay failed silently (expected on some devices).");
    });
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-end">

      {/* ------------------ VIDEO BACKGROUND ------------------ */}
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Blurred background fill layer */}
        <img
          src={fallbackImage}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        {/* Main Video (autoplay-safe) */}
        <video
          ref={videoRef}
          src={videoSrc}
          preload="auto"
          loop
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          className={`absolute inset-0 w-full h-full object-contain sm:object-cover z-[2] transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
        />

        {/* Loading shimmer */}
        {!loaded && !error && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-red-900 to-yellow-900 animate-[pulse_2s_ease_in_out_infinite] z-[3]" />
        )}

        {/* Error fallback */}
        {error && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-red-900 to-yellow-900 flex items-center justify-center text-white z-[3]">
            <div className="text-center p-4">
              <p className="text-lg">Video failed to load</p>
            </div>
          </div>
        )}
      </div>

      {/* ------------------ CONTENT ------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-16"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 rounded-full font-semibold text-white bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/20 transition-all flex items-center gap-3 text-lg italic"
            >
              <ChristmasPatternIcon type="snowflake" />
              <span>Ring In the Christmas Sale</span>
              <ChristmasPatternIcon type="snowflake" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
