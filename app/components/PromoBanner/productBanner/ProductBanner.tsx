'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Preload Google Fonts
const fontLinks = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap',
  'https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap'
];

const FireworkIcon = () => (
  <svg className="w-5 h-5 text-yellow-400 inline-block mx-0.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.3 15.7l1.4 1.4-1.4 1.4-1.4-1.4 1.4-1.4M15.3 14.3l-4-4 1.4-1.4 4 4-1.4 1.4m-6.6 0l-4-4 1.4-1.4 4 4-1.4 1.4m8.5 1l-1.4 1.4-1.4-1.4 1.4-1.4 1.4 1.4M12 5l-1 2h2l-1-2m-5 2L5 7l1 2 2-2m11 2l-2-2 1-2 2 2m-9-2l-1-2 2 2h-1m2 8h-1v2h2v-1l-1-1z" />
  </svg>
);

const SnackinPromoBanner = () => {
  const [isOfferActive, setIsOfferActive] = useState(true);

  useEffect(() => {
    const checkOfferValidity = () => {
      const now = new Date();
      const offerStartDate = new Date(2025, 9, 13);
      const offerEndDate = new Date(2025, 9, 23);
      setIsOfferActive(now >= offerStartDate && now <= offerEndDate);
    };
    checkOfferValidity();
    const intervalId = setInterval(checkOfferValidity, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Head>
        {fontLinks.map((href, index) => (
          <link key={index} href={href} rel="stylesheet" />
        ))}
      </Head>

      <section className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center text-center text-white rounded-3xl shadow-2xl font-['Poppins'] mt-8 md:mt-12">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/promtional/Diwali.png"
            alt="Diwali Celebration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 max-w-4xl mx-auto py-12"
        >
          {isOfferActive ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-sm md:text-base uppercase tracking-widest text-yellow-200 font-semibold italic"
              >
                Diwali Special
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-2 md:mb-4 drop-shadow-lg"
              >
                <span className="text-white font-['Tangerine'] text-5xl md:text-7xl lg:text-8xl italic">Diwali Delights</span>
                <span className="block text-yellow-300 font-['Dancing_Script'] text-3xl md:text-4xl mt-2 italic">with SnackIn'</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed font-medium italic"
              >
                Add <span className="font-bold">4 or more SnackIn’ items</span> to your cart and enjoy <span className="text-yellow-200 font-semibold">₹100 OFF</span> <br />
                <span className="text-yellow-300">(₹100 off when you buy 4+ items)</span>
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-block bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 px-8 py-3 rounded-full text-lg font-bold shadow-lg mb-6 md:mb-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <span className="drop-shadow-md italic">Shop Diwali Combo</span>
              </motion.div>
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Offer Coming Soon! ✨</h1>
              <p className="text-xl text-gray-200">Stay tuned for festive savings and exciting Diwali offers!</p>
              <button className="mt-6 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full border border-white/20 transition-all duration-300">
                Notify Me
              </button>
            </div>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-70"></div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SnackinPromoBanner;
