"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ArrowRight = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowRight),
  {
    ssr: false,
    loading: () => <span className="inline-block w-5 h-5" />,
  }
);

const placeholderImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

const HeroPage = () => {
  const [inView, setInView] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    const hero = document.getElementById("hero-section");
    if (hero) {
      const rect = hero.getBoundingClientRect();
      setInView(rect.top <= window.innerHeight && rect.bottom >= 0);
    }
  }, []);

  const imageSrc = useMemo(() => "/Images/hero.webp", []);

  useEffect(() => {
    handleScroll();

    const debounceScroll = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(handleScroll, 50);
    };

    window.addEventListener("scroll", debounceScroll, { passive: true });
    window.addEventListener("resize", debounceScroll, { passive: true });

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      window.removeEventListener("scroll", debounceScroll);
      window.removeEventListener("resize", debounceScroll);
    };
  }, [handleScroll]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  return (
    <div
      id="hero-section"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gray-950/80 z-10 transition-all duration-700 ${
          inView ? "backdrop-blur-none" : "backdrop-blur-sm"
        }`}
        style={{
          backgroundColor: "rgba(3, 7, 18, 0.4)",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-20 text-center text-white px-4 sm:px-8 md:px-16 transition-opacity duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide">
          <span className="block">SNACKIN MADE BOLDER, BRIGHTER, &</span>
          <span className="block">BETTER FOR YOU</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-gray-100 max-w-3xl mx-auto">
          Discover snackin' – healthy, delicious snacks with bold flavors and
          zero guilt. Perfect for fueling your day and satisfying cravings!
        </p>
        <Link
          href="/products"
          className="group bg-amber-500 text-red-900 mt-6 px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-amber-400 hover:brightness-110 transition-all duration-300 inline-flex items-center gap-2"
          aria-label="Browse our collection of snackin flavors"
          prefetch={true}
        >
          Browse Our Flavors
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt="Delicious and healthy snacks from snackin"
          fill
          priority
          quality={80}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={handleImageLoad}
          placeholder="blur"
          blurDataURL={placeholderImage}
          loading="eager"
        />
        {!isImageLoaded && <div className="absolute inset-0 bg-gray-900" />}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(HeroPage), { ssr: false });