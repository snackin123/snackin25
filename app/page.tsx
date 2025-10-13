"use client";
import dynamic from "next/dynamic";

const HeroPage = dynamic(() => import("./components/HeroPage/HeroPage"), { ssr: false });
const WhyChoose = dynamic(() => import("./components/WhyChoose/WhyChoose"), { ssr: false });
const HorizontalScrolling = dynamic(() => import("./components/HorizontalScrolling/HorizontalScrolling"), { ssr: false });
const EndPage = dynamic(() => import("./components/EndPage/EndPage"), { ssr: false });
const HeroOffer = dynamic(() => import("./components/PromoBanner/HeroOffer/HeroOffer"), { ssr: false });
const CustomerReviewsRibbon = dynamic(() => import("./components/CustomerReviewsRibbon/CustomerReviewsRibbon"), { ssr: false });
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* <SnowFall /> */}
      <nav className="fixed top-0 w-full p-4 z-10 bg-transparent text-white flex items-center justify-between">
        <div
          id="logo"
          className="w-40 h-10 sm:w-48 sm:h-12 md:w-56 md:h-16 px-24 bg-cover bg-center"
          aria-label="snackin' Official Logo"
          role="img"
          aria-hidden="true"
        />
      </nav>
      <main className="flex-grow flex flex-col items-center">
        {/* <HeroPage /> */}
        <HeroOffer/>
        <WhyChoose />
        <HorizontalScrolling />
        <EndPage />
        <CustomerReviewsRibbon />
      </main>
    </div>
  );
}




