'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useOfferPeriod, createVideoErrorHandler, createVideoLoadHandler } from '../../../../utils/offerDates';

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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [useVideo, setUseVideo] = useState(false);

  const videoSrc = '/promtional/Cybermonday.mp4';
  const imageSrc = '/promtional/BlackFriday.png';
  const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYzFlMjEiLz48L3N2Zz4=';

  // 🎉 Use shared offer period hook (production mode)
  const { isBlackFriday, isCyberMonday, isOfferActive } = useOfferPeriod(false);

  // 🎉 Update video state based on offer period
  useEffect(() => {
    setUseVideo(isCyberMonday);
  }, [isCyberMonday]);

  // 🎉 Use shared video handlers
  const handleVideoError = createVideoErrorHandler(setVideoError, videoSrc);
  const handleVideoLoad = createVideoLoadHandler(setIsVideoLoaded, setVideoError);

  return (
    <section className="relative w-full h-[85vh] min-h-[550px] md:h-[90vh] lg:h-screen overflow-hidden">
      {/* 🔮 Background with Enhanced Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 z-0" />
        {useVideo ? (
          !videoError ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-80' : 'opacity-0'
              }`}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              style={{
                objectPosition: 'center center',
                userSelect: 'none',
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-amber-900 to-red-900 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <p className="text-lg font-semibold mb-2">Cyber Monday Deal</p>
                <p className="text-sm opacity-80">Special offer available!</p>
              </div>
            </div>
          )
        ) : (
          <Image
            src={imageSrc}
            alt="Black Friday Special Offer - snackin'"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover opacity-80 transition-opacity duration-1000"
            style={{
              objectPosition: 'center center',
              userSelect: 'none',
            }}
          />
        )}
        
        {useVideo && !isVideoLoaded && !videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-amber-900 to-red-900 animate-pulse" />
        )}
      </div>

      {/* 🌟 Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-4 sm:pb-6 md:pb-8 lg:pb-12 flex flex-col min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh]"
      >
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center px-2 sm:px-4 mt-auto"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-1 sm:p-2 md:p-3">
            <Link href="/products" className="inline-block">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
                }}
                whileTap={{ scale: 0.97 }}
                className="relative bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-gray-900 font-bold px-3 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 md:py-3 rounded-full shadow-lg overflow-hidden group transition-all duration-500 text-xs sm:text-sm md:text-base"
              >
              <span className="relative z-10 flex items-center justify-center italic">
                <FireworkIcon />
                <span className="mx-1 sm:mx-2">{useVideo ? 'Unlock Your Cyber Monday Deal' : 'Unlock Your Black Friday Deal'}</span>
                <FireworkIcon />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
          </div>
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
