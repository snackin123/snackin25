'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

type ChristmasIconType = "snowflake" | "star" | "holly";

const ChristmasPatternIcon = ({ type = "snowflake", className = "" }: { type?: ChristmasIconType, className?: string }) => {
  const icons: Record<ChristmasIconType, React.ReactElement> = {
    snowflake: (
      <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    star: (
      <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15,8.5 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8.5" />
      </svg>
    ),
    holly: (
      <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19,6C18.2,6 17.5,5.5 17,4.7C16.5,5.5 15.8,6 15,6C13.3,6 12,4.7 12,3C12,4.7 10.7,6 9,6C8.2,6 7.5,5.5 7,4.7C6.5,5.5 5.8,6 5,6C3.3,6 2,4.7 2,3H22C22,4.7 20.7,6 19,6Z" />
      </svg>
    )
  };

  return icons[type];
};

export default function HeroOffer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSrc = "/promtional/Christmas Web Banner_2.mp4";

  // 🧊 Ensures video auto-plays on all devices and loads faster
  useEffect(() => {
    if (videoRef.current) {
      // Reset video state on page reload
      const handlePageReload = () => {
        setIsLoaded(false);
        setHasError(false);
        setShowFallback(false);
        setVideoKey(prevKey => prevKey + 1);
      };

      // Start with muted to ensure autoplay works
      videoRef.current.muted = true;

      // Handle user interaction to enable audio
      const handleUserInteraction = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          // Remove the event listener after first interaction
          window.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('keydown', handleUserInteraction);
          window.removeEventListener('touchstart', handleUserInteraction);
        }
      };

      // Add event listeners for user interaction
      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);

      // Listen for page visibility changes to handle reload
      window.addEventListener('visibilitychange', handlePageReload);

      // Cleanup event listeners on component unmount
      return () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('visibilitychange', handlePageReload);
      };
    }
  }, [videoKey]);

  // Retry mechanism for failed video loading
  useEffect(() => {
    if (hasError && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        setHasError(false);
        setShowFallback(false);
        setIsLoaded(false);
        setRetryCount(prev => prev + 1);
        setVideoKey(prevKey => prevKey + 1);
      }, 2000);

      return () => clearTimeout(retryTimeout);
    }
  }, [hasError, retryCount]);

  return (
    <section className="relative w-full h-screen sm:h-screen md:h-screen lg:h-screen xl:h-screen min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px] xl:min-h-[640px] overflow-hidden flex flex-col justify-end">
      
      {/* 🔮 Background & Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* HIGH PERFORMANCE VIDEO */}
        <video
          key={videoKey}
          ref={videoRef}
          src={videoSrc}
          preload="auto"
          autoPlay
          loop
          playsInline
          muted
          poster="/Images/hero.webp"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
            ${isLoaded && !hasError ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => {
            console.log("Video error occurred");
            setHasError(true);
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.log("Playback failed, but video should still be visible:", error);
                  // Don't show fallback for autoplay prevention, just log it
                });
              }
            }
          }}
          onPlaying={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
        />

        {/* Fallback shimmer while loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-red-900 to-yellow-900 animate-pulse" />
        )}

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-red-900 to-yellow-900 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="text-lg mb-2">Video failed to load</p>
              <p className="text-sm">Retrying... ({retryCount}/3)</p>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col justify-between"
      >

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-3 sm:py-3.5 md:py-4 lg:py-4.5 rounded-full font-semibold text-white 
                bg-white/10 backdrop-blur-md border border-white/20 
                shadow-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg italic"
            >
              <ChristmasPatternIcon type="snowflake" className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Ring In the</span> Christmas Sale
              <ChristmasPatternIcon type="snowflake" className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
