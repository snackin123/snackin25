// Shared offer date utilities for Black Friday and Cyber Monday campaigns
import { useState, useEffect } from 'react';

export const OFFER_DATES = {
  // Black Friday: November 20-30, 2025
  blackFridayStart: new Date(2025, 10, 20), // November 20, 2025
  blackFridayEnd: new Date(2025, 10, 29, 23, 59, 59), // November 29, 2025 11:59 PM
  
  // Cyber Monday: November 30 - December 7, 2025
  cyberMondayStart: new Date(2025, 10, 30, 0, 0, 0), // November 30, 2025 12:00 AM
  cyberMondayEnd: new Date(2025, 11, 7, 23, 59, 59), // December 7, 2025 11:59 PM
};

export const checkOfferPeriod = () => {
  const now = new Date();
  
  const isBlackFriday = now >= OFFER_DATES.blackFridayStart && now <= OFFER_DATES.blackFridayEnd;
  const isCyberMonday = now >= OFFER_DATES.cyberMondayStart && now <= OFFER_DATES.cyberMondayEnd;
  const isOfferActive = isBlackFriday || isCyberMonday;
  
  return {
    isBlackFriday,
    isCyberMonday,
    isOfferActive,
    now,
  };
};

export const useOfferPeriod = (enableTestMode = false) => {
  const [offerPeriod, setOfferPeriod] = useState(() => checkOfferPeriod());
  
  useEffect(() => {
    const updateOfferPeriod = () => {
      setOfferPeriod(checkOfferPeriod());
    };
    
    // Check immediately
    updateOfferPeriod();
    
    // 🎉 Test mode: Switch to Cyber Monday after 5 seconds
    if (enableTestMode) {
      const testTimer = setTimeout(() => {
        setOfferPeriod({
          isBlackFriday: false,
          isCyberMonday: true,
          isOfferActive: true,
          now: new Date(),
        });
        console.log('🚀 Test: Switching to Cyber Monday after 5 seconds');
      }, 5000); // 5 seconds
      
      return () => clearTimeout(testTimer);
    }
    
    // Normal mode: Check every hour
    const interval = setInterval(updateOfferPeriod, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [enableTestMode]);
  
  return offerPeriod;
};

// Video error handler utility
export const createVideoErrorHandler = (setVideoError: (error: boolean) => void, videoSrc: string) => {
  return () => {
    console.error('Video failed to load:', videoSrc);
    setVideoError(true);
  };
};

// Video load handler utility
export const createVideoLoadHandler = (setIsVideoLoaded: (loaded: boolean) => void, setVideoError: (error: boolean) => void) => {
  return () => {
    setIsVideoLoaded(true);
    setVideoError(false);
  };
};
