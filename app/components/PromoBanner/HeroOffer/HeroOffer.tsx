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

  const imageSrc = '/promtional/Diwali.png';
  const placeholderImage =
    'data:image/svg+xml;base64,PHN2dyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYzFlMjEiLz48L3N2Zz4=';

  // 🎉 Offer date range validation
  useEffect(() => {
    const checkOfferValidity = () => {
      const now = new Date();
      const offerStartDate = new Date(2025, 9, 13);
      const offerEndDate = new Date(2025, 9, 23);
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
        className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-32 pb-10 md:pt-48 md:pb-20"
      >
        {isOfferActive ? (
          <>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="uppercase tracking-[0.2em] text-yellow-200 font-semibold italic text-sm md:text-base mb-2"
            >
              Diwali Special
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-2 drop-shadow-xl"
            >
              <span className="block font-['Tangerine'] italic text-yellow-300 text-6xl md:text-8xl">
                Diwali Delights
              </span>
              <span className="block font-['Dancing_Script'] italic text-3xl md:text-4xl text-yellow-200 mt-2">
                with snackin&apos;
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-yellow-100 font-semibold italic mb-6"
            >
              Celebrate & Save this festive season!
            </motion.h2>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 180 }}
              className="inline-block bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 px-8 py-3 rounded-full text-lg font-bold text-white shadow-xl hover:scale-105 transition-transform duration-300"
            >
              ₹100 OFF on 4+ Packs
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mt-6 font-medium italic"
            >
              Buy <span className="text-yellow-200 font-semibold">4 or more</span>{' '}
              snack packs and enjoy <span className="text-yellow-300">₹100 OFF</span> - our
              little Diwali gift to you! 🎁
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10"
            >
              <Link href="/products" className="inline-block">
                <motion.button
                  whileHover={{
                    scale: 1.06,
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-gray-900 font-bold px-10 py-4 rounded-full shadow-lg overflow-hidden group transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center justify-center italic">
                    <FireworkIcon />
                    <span className="mx-2">Shop Diwali Combo</span>
                    <FireworkIcon />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </>
        ) : (
          // 💫 Pre-offer State
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-white"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Offer Coming Soon! ✨</h1>
            <p className="text-lg md:text-xl text-gray-200">
              Stay tuned for festive savings and exclusive Diwali offers!
            </p>
            <button className="mt-6 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300">
              Notify Me
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ✨ Floating Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-80">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        ))}
      </div>
    </section>
  );
}
