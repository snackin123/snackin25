'use client';
import Image from 'next/image';

export default function OfferRibbon() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full">
        {/* Fixed height only for 425px, aspect ratio for others */}
        <div className="relative w-full h-[220px] xs:pt-[100%] sm:pt-[75%] md:pt-[56.25%] lg:pt-[50%] xl:pt-[50%]">
          <Image
            src="/promtional/FestiveCover.avif"
            alt="Festive Banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 425px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            quality={90}
            loading="eager"
            fetchPriority="high"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
