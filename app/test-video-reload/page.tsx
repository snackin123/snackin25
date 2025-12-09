"use client";

import React, { useState } from "react";
import HeroOffer from "../components/PromoBanner/HeroOffer/HeroOffer";

export default function TestVideoReload() {
  const [reloadCount, setReloadCount] = useState(0);

  const handleReload = () => {
    // Simulate page reload by forcing component remount
    setReloadCount(prev => prev + 1);
  };

  const handleFullReload = () => {
    // Actual page reload
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Video Reload Test</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p className="text-lg mb-4">
            This page tests the video reloading functionality. The video should play correctly after reload.
          </p>
          <p className="text-lg mb-4">
            <strong>Reload count:</strong> {reloadCount}
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Simulate Reload (Component Remount)
            </button>

            <button
              onClick={handleFullReload}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Full Page Reload
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Video Component</h2>
          <p className="text-gray-600 mb-4">
            Below is the HeroOffer component with video. After reloading, the video should:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Autoplay silently (muted)</li>
            <li>Show the video content, not just the fallback image</li>
            <li>Allow sound when hovering over the video</li>
            <li>Handle errors gracefully with retry mechanism</li>
          </ul>

          <div className="border rounded-lg overflow-hidden">
            <HeroOffer key={reloadCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
