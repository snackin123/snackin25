'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" as const 
    } 
  },
};

const WhyChoose = () => {
  return (
    <div className="w-full min-h-screen bg-red-900 bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center justify-center min-h-screen text-center w-full px-6 py-16 sm:px-10 md:px-16 lg:px-24 xl:px-48 max-w-screen-xl mx-auto">
        {/* Headline */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          Why snackin'?
        </motion.h1>

        {/* Subline */}
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white mt-6 max-w-4xl leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          Because it's time to say goodbye to ordinary snacks!
        </motion.h2>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-white mt-6 max-w-3xl leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          Snack smarter with snackin', your go-to for healthy, guilt-free indulgence. Ordinary snacks can feel repetitive, but snackin' transforms every bite into an adventure of taste and nutrition. Whether you're at work, at the gym, or on-the-go, snackin' offers convenient, nutrient-packed options that satisfy your cravings and fuel your body.
        </motion.p>
      </div>
    </div>
  );
};

export default WhyChoose;