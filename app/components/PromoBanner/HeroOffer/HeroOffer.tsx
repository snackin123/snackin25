'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// 🔥 Decorative Icon
const FireworkIcon = () => (
  <svg
    className="w-5 h-5 text-yellow-300 inline-block mx-0.5 drop-shadow-md"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5.3 15.7l1.4 1.4-1.4 1.4-1.4-1.4 1.4-1.4M15.3 14.3l-4-4 1.4-1.4 4 4-1.4 1.4m-6.6 0l-4-4 1.4-1.4 4 4-1.4 1.4m8.5 1l-1.4 1.4-1.4-1.4 1.4-1.4 1.4 1.4M12 5l-1 2h2l-1-2m-5 2L5 7l1 2 2-2m11 2l-2-2 1-2 2 2m-9-2l-1-2 2 2h-1m2 8h-1v2h2v-1l-1-1z" />
  </svg>
);

export default function HeroOffer() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isOfferActive, setIsOfferActive] = useState(true);

  const imageSrc = '/promtional/BlackFriday.png';
  const placeholderImage =
    'data:image/svg+xml;base64,PHN2dyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYzFlMjEiLz48L3N2Zz4=';

  // 🎉 Offer date range validation
  useEffect(() => {
    const checkOfferValidity = () => {
      const now = new Date();
      const offerStartDate = new Date(2025, 10, 20); // November 20, 2025
      const offerEndDate = new Date(2025, 10, 30); // November 30, 2025
      setIsOfferActive(now >= offerStartDate && now <= offerEndDate);
    };
    checkOfferValidity();
    const interval = setInterval(checkOfferValidity, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[85vh] min-h-[550px] md:h-[90vh] lg:h-screen overflow-hidden">
      {/* 🔮 Background with Enhanced Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 z-0" />
        <Image
          src={imageSrc}
          alt="Diwali Special Offer - snackin'"
          fill
          priority
          quality={85}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            isImageLoaded ? 'opacity-80' : 'opacity-0'
          }`}
          onLoadingComplete={() => setIsImageLoaded(true)}
          placeholder="blur"
          blurDataURL={placeholderImage}
          style={{
            objectPosition: 'center center',
            userSelect: 'none',
          }}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-amber-900 to-red-900 animate-pulse" />
        )}
      </div>

      {/* 🌟 Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 lg:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-20 flex flex-col justify-end min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh]"
      >
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center px-2 sm:px-4"
        >
          <Link href="/products" className="inline-block">
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
              }}
              whileTap={{ scale: 0.97 }}
              className="relative bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-gray-900 font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full shadow-lg overflow-hidden group transition-all duration-500 text-sm sm:text-base md:text-lg"
            >
              <span className="relative z-10 flex items-center justify-center italic">
                <FireworkIcon />
                <span className="mx-1 sm:mx-2">Unlock Your Black Friday Deal</span>
                <FireworkIcon />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ✨ Floating Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-80">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        ))}
      </div>
    </section>
  );
}
