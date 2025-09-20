// components/CustomerReviewsRibbon.tsx
import { useEffect, useRef } from 'react';
import { FiStar } from 'react-icons/fi';

interface Review {
  name: string;
  message: string;
  rating: number;
}

// Function to get a random rating between 4, 4.5, and 5
const getRandomRating = () => {
  const ratings = [4, 4.5, 5];
  return ratings[Math.floor(Math.random() * ratings.length)];
};

const reviews: Review[] = [
  { name: "Prathamesh Bhujbal", message: "Tasted Chocolate & chatpata. Superb & tasty! Great innovation", rating: getRandomRating() },
  { name: "Sonam Jadhav", message: "They are really good! And chocolate is already our favourite!", rating: getRandomRating() },
  { name: "Mansi Bhagat", message: "I tried chocolate, chatpata flavour and chilly guava till now and all of these are tasty!", rating: getRandomRating() },
  { name: "Shobha", message: "Very fun & delicious!", rating: getRandomRating() },
  { name: "Pravin Choudyal", message: "Awesome!", rating: getRandomRating() },
  { name: "Manisha", message: "A great snack for the little ones! Loved it", rating: getRandomRating() },
  { name: "Chhaya", message: "Can't resist eating just one! Too good.", rating: getRandomRating() },
  { name: "Siddhling", message: "Delicious and too good. Must try!", rating: getRandomRating() },
  { name: "Rohit", message: "Very interesting, placing order again!", rating: getRandomRating() },
  { name: "Chanda", message: "Keep coming back for more. The chocolate one is the best!", rating: getRandomRating() },
  { name: "Apeksha Dethe", message: "Variety of flavoured raisins & too yummy!", rating: getRandomRating() },
  { name: "Ananya", message: "My favourite is chilli Guava!", rating: getRandomRating() },
  { name: "Pranjali", message: "Loved the chatpata and paan flavoured raisins. Amazing flavours.", rating: getRandomRating() },
  { name: "Malcolm", message: "Something new and innovative taste. Loved the packaging.", rating: getRandomRating() },
  { name: "Chetan", message: "Great taste and good quality product.", rating: getRandomRating() },
  { name: "Nikita", message: "Enjoyed every bite and amazing snacks for the kids too.", rating: getRandomRating() },
];



// Duplicate reviews for seamless looping
const marqueeReviews = [...reviews, ...reviews];

export default function CustomerReviewsRibbon() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const animateElement = (
      element: HTMLElement | null,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions
    ) => {
      if (element) {
        element.animate(keyframes, options);
      }
    };

    // Animate heading on mount
    animateElement(
      headingRef.current,
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
  }, []);

  return (
    <section 
      className="relative py-16 px-4 w-full overflow-hidden"
      style={{
        backgroundImage: "url('/Images/bg2.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 " />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 
            ref={headingRef}
            className="opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-red-800"
          >
          Bites They Can’t Stop Talking About
          </h2>
          <p className="text-center text-sm sm:text-base text-red-700 max-w-3xl mx-auto mb-8 sm:mb-12">
            Don't just take our word for it. Here's what our customers have to say about our delicious snacks!
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="whitespace-nowrap animate-marquee">
            {marqueeReviews.map((review, idx) => (
              <div
                key={idx}
                className="inline-flex min-w-[18rem] sm:min-w-[22rem] mx-4 align-top"
              >
                <div className="bg-red-800 backdrop-blur-sm p-8 rounded-xl shadow-lg transition-all duration-300 flex flex-col h-full w-full hover:shadow-xl border border-white/10">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => {
                      if (review.rating >= star) {
                        return (
                          <FiStar
                            key={star}
                            className="w-5 h-5 text-amber-500 fill-current"
                          />
                        );
                      } else if (review.rating >= star - 0.5) {
                        return (
                          <div key={star} className="relative w-5 h-5">
                            <FiStar className="w-5 h-5 text-white" />
                            <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
                              <FiStar className="w-5 h-5 text-amber-500 fill-current" />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <FiStar
                            key={star}
                            className="w-5 h-5 text-white fill-current"
                          />
                        );
                      }
                    })}
                    <span className="ml-2 text-amber-300 text-sm">
                      {review.rating % 1 === 0 ? `${review.rating}.0` : review.rating}
                    </span>
                  </div>
                  <p className="text-white/90 text-base leading-relaxed mb-4 italic flex-grow">
                    "{review.message}"
                  </p>
                  <p className="text-amber-300 font-medium text-sm mt-auto pt-3 border-t border-amber-700/50">
                    — {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 45s linear infinite;
          gap: 2rem;
          align-items: flex-start;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
          cursor: grab;
        }
        .animate-marquee:active {
          cursor: grabbing;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
