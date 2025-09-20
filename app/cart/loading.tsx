import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-[64px] px-4 sm:px-6 lg:px-8 py-32 sm:py-36">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
