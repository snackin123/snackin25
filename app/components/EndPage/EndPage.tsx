'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';

// Lazy load heavy dependencies
const ArrowRight = dynamic(() => import('lucide-react').then(mod => mod.ArrowRight), {
  ssr: false,
  loading: () => <span className="inline-block w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
});

// Define proper type for animation variants
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const EndPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  const images = useMemo(() => [
    "/Images/Gravity-Stand-Up-Pouch-Packaging-Mockup.avif",
    "/Images/Gravity-Stand-Up-Pouch-Packaging-Mockup1.avif",
    "/Images/Gravity-Stand-Up-Pouch-Packaging-Mockup2.avif"
  ], []);

  const stopImageRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startImageRotation = useCallback(() => {
    stopImageRotation();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
  }, [images.length, stopImageRotation]);

  useEffect(() => {
    if (isInView) {
      startImageRotation();
    }
    return () => stopImageRotation();
  }, [isInView, startImageRotation, stopImageRotation]);

  return (
    <section
      ref={sectionRef}
      className="w-full h-screen flex flex-col md:flex-row items-center justify-center relative bg-black overflow-hidden"
    >
      {/* Left Panel - Rotating Product Images */}
      <div className="w-full md:w-1/2 h-full relative bg-black/50 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel - Promotional Content */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-8 py-12 md:py-24 bg-red-900 relative z-10">
        <motion.div 
          className="max-w-md text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Bold Italic Headline */}
          <motion.h2 
            className="text-4xl md:text-5xl text-white font-playfair italic font-bold leading-snug tracking-tight"
            variants={itemVariants}
          >
            <span className="text-amber-400">WOWZA!</span> a bite of bliss!
          </motion.h2>

          {/* Benefits List */}
          <motion.ul 
            className="space-y-4 text-left text-lg md:text-xl text-white font-medium"
            variants={containerVariants}
          >
            {[
              "100% Sun Dried for Natural Sweetness",
              "No Added Preservatives — Just Pure Raisins",
              "Gluten-Free & Guilt-Free Snacking",
              "Zero Added Sugar — Naturally Delicious"
            ].map((text, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3"
                variants={itemVariants}
              >
                <span className="text-amber-400 text-xl">✔</span>
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA Button */}
          <motion.div className="pt-4" variants={itemVariants}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-red-900 font-bold rounded-full transition-colors duration-300"
            >
              Browse Our Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EndPage;