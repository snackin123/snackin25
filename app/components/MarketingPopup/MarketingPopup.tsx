"use client";

import React from 'react';

const MarketingPopup: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-4 max-w-sm w-full md:max-w-md pointer-events-none">
      <div className="animate-rainbow p-6 rounded-xl shadow-lg text-center text-white border border-white border-opacity-20 pointer-events-auto transform transition-all duration-300 hover:scale-105">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900 drop-shadow-md">
          Something Exciting is Coming!
        </h2>
        <p className="text-base md:text-lg mb-4 font-medium leading-relaxed text-gray-800">
          The Snackin' Company is preparing a delightful surprise.
          Get ready for an even better experience!
        </p>
        <p className="text-sm text-gray-700">
          Stay tuned for updates. Your taste buds will thank you!
        </p>
      </div>
    </div>
  );
};

export default MarketingPopup;