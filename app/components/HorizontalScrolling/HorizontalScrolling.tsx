'use client';

import Image from 'next/image';
import Link from 'next/link';

const StaticSnackSection = () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-16"
      style={{
        backgroundImage: `url('/Images/bg2.webp')`,
      }}
    >
      {/* Responsive Cards Container */}
      <div className="w-full max-w-[3840px] flex flex-wrap gap-6 justify-center items-center mb-12 px-4" style={{ minHeight: '90vh' }}>
        {[1, 4, 2].map((num) => (
          <Link
            href="/products"
            key={num}
            className="relative flex-grow flex-shrink-0 basis-full sm:basis-[48%] lg:basis-[calc((100%/3)-1.5rem)] h-[90vh] rounded-xl overflow-hidden group"
          >
            <Image
              src={`/Images/Plastic_Pouch_${num}.avif`}
              alt={`Plastic Pouch flavor ${num}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, 33vw"
              priority={num === 1}
              unoptimized
            />
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href="/products"
        className="inline-block bg-amber-500 hover:bg-amber-600 text-red-900 font-bold text-xl py-4 px-10 rounded-full shadow-lg transition"
      >
       Grab Your Favorite Flavors!
      </Link>
    </div>
  );
};

export default StaticSnackSection;
