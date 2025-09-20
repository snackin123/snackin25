"use client";

import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function About() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const heroTextRef = useRef(null);
  const valuesRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const animateElement = (
      element: HTMLElement | null,
      keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
      options: KeyframeAnimationOptions
    ) => {
      if (element) {
        element.animate(keyframes, options);
      }
    };

    // Initial animations for Hero section
    animateElement(
      headingRef.current,
      [
        { transform: "translateY(100px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
      }
    );

    animateElement(
      heroTextRef.current,
      [
        { transform: "translateY(50px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
        delay: 200,
      }
    );

    // Scroll-triggered animations using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Type assertion to HTMLElement since we know these are DOM elements
            const target = entry.target as HTMLElement;
            animateElement(
              target,
              [
                { transform: "translateY(50px)", opacity: 0 },
                { transform: "translateY(0)", opacity: 1 },
              ],
              {
                duration: 1000,
                easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fill: "forwards",
              }
            );
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements
    [valuesRef.current, card1Ref.current, card2Ref.current, ctaRef.current].forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Cleanup on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen text-red-800"
      style={{
        backgroundImage: "url('/Images/bg2.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center">
        <div ref={heroRef} className="absolute inset-0 bg-gradient-to-b opacity-50" />
        <div className="max-w-4xl mx-auto text-center px-4 z-10">
          <h1 ref={headingRef} className="opacity-0 text-7xl font-bold mb-6 tracking-tight">
            Our Story
          </h1>
          <div ref={heroTextRef} className="opacity-0 text-xl leading-relaxed space-y-6">
            <p className="text-2xl font-medium text-amber-400">Who said raisins are boring?</p>
            <p>
              Not us! Snackin' was born out of the desire to turn one of nature's healthiest snacks
              into something more exciting. Packed with natural energy and free from preservatives,
              our raisins offer a flavor-packed snacking experience.
            </p>
            <p>
              From sun-kissed vineyards to your table, we deliver raisins with a smile,
              helping you snack guilt-free!
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-32 px-4 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div ref={valuesRef} className="opacity-0 text-center mb-24">
            <h2 className="text-5xl font-semibold mb-8">A Raisin Revolution Awaits</h2>
            <p className="text-xl max-w-3xl mx-auto">
              At snackin', our mission is simple - we want to make healthy snacking a joyful,
              fun part of your daily life. No fuss, just fun!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div
              ref={card1Ref}
              className="opacity-0 bg-gray-800 p-12 rounded-3xl transform hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundImage: "url('/Images/bg1.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Heart className="w-12 h-12 text-amber-500 mb-6" />
              <h3 className="text-3xl font-semibold mb-4 text-red-800">Mission</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                We're reimagining raisins, turning a timeless snack into something extraordinary.
                Packed with nature's energy and bursting with bold, natural flavors, our raisins
                are here to make snacking exciting again - without preservatives or added junk.
              </p>
            </div>

            <div
              ref={card2Ref}
              className="opacity-0 p-12 rounded-3xl transform hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundImage: "url('/Images/bg1.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Sparkles className="w-12 h-12 text-amber-500 mb-6" />
              <h3 className="text-3xl font-semibold mb-4 text-red-800">Vision</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Life's too short for boring snacks! We're inspired by the simple joy of nature's
                perfect treat - raisins. No fillers, no artificial nonsense - just wholesome
                raisins bursting with vibrant flavors, ready to fuel your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Snack Your Way Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Snack Your Way</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[ 
              { 
                title: "Morning Boost", 
                description: "Top your oatmeal or yogurt with our flavorful raisins for a sweet, energy-packed start." 
              },
              { 
                title: "Salad Upgrade", 
                description: "Toss them into your salad for a burst of natural sweetness." 
              },
              { 
                title: "Smoothie Power", 
                description: "Mix them into your smoothies for a powerful, guilt-free boost." 
              },
              { 
                title: "Straight Up", 
                description: "Or just pop 'em straight into your mouth and enjoy a wholesome snack anytime!" 
              }
            ].map((item, index) => (
              <div key={index} className="bg-red-800 p-8 rounded-xl transition-colors duration-300">
                <Leaf className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div ref={ctaRef} className="opacity-0 max-w-3xl mx-auto text-center">
          <Link href="/products">
            <button className="group bg-amber-500 text-red-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 mx-auto">
              Browse Our Flavors
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
