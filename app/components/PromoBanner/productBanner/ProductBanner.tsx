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
          {/* Main gradient with rich colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-red-950 to-black">
            {/* Radial gradient for depth */}
            <div className="absolute inset-0 bg-radial-gradient from-red-600/30 via-transparent to-transparent"></div>
            {/* Animated shimmer effect */}
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-yellow-600/10 to-transparent animate-shimmer"></div>
            </div>
            {/* Floating particles for elegance */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/20 rounded-full animate-float"></div>
              <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-red-400/20 rounded-full animate-float-delayed"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-300/20 rounded-full animate-float"></div>
            </div>
            {/* Subtle mesh pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px),
                  repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)
                `
              }}></div>
            </div>
            {/* Vignette effect for focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
            {/* Light rays effect */}
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-tr from-transparent via-yellow-600/5 to-transparent transform rotate-12 scale-150"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 max-w-4xl mx-auto py-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-sm md:text-base uppercase tracking-widest text-yellow-200 font-semibold italic"
          >
            Black Friday Special
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-2 md:mb-4 drop-shadow-lg"
          >
            <span className="text-white font-['Tangerine'] text-5xl md:text-7xl lg:text-8xl italic">Black Friday</span>
            <span className="block text-yellow-300 font-['Dancing_Script'] text-3xl md:text-4xl mt-2 italic">Mega Sale with SnackIn'</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed font-medium italic"
          >
            Buy <span className="font-bold">2 or more Snackin' items</span> and get <span className="text-yellow-200 font-semibold">2 absolutely FREE</span> <br />
            <span className="text-yellow-300">(Buy 2 Get 2 FREE - Biggest sale of the year!)</span>
          </motion.p>

          {/* Interactive CTA Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="relative group mb-6 md:mb-8 cursor-pointer"
            onClick={() => window.location.href = '/products'}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-yellow-400/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
            
            {/* Main card container */}
            <div className="relative bg-gradient-to-br from-red-900/90 via-red-800/80 to-black/90 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-red-500/30 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-red-500/25 overflow-hidden">
              
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-gradient-to-tr from-red-600/20 via-transparent to-yellow-600/20 animate-spin-slow"></div>
              </div>
              
              {/* Floating sparkle effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle"></div>
                <div className="absolute bottom-4 left-3 w-2 h-2 bg-yellow-200 rounded-full animate-twinkle-delayed"></div>
                <div className="absolute top-6 left-8 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Headline */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                  Unlock Your Black Friday Deal
                </h3>
                
                {/* Subtitle */}
                <p className="text-red-200 text-sm md:text-base mb-6 font-medium">
                  Limited Time: Buy 2 Get 2 FREE on All Snackin' Products
                </p>  
                {/* Trust indicators */}
                <div className="flex justify-center gap-4 mt-6 text-xs text-red-300">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Instant Savings</span>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            </div>
          </motion.div>
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
