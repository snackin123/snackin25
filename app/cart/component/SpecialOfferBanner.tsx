"use client";

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Snowflake, Gift, Tag, Sparkles } from "lucide-react";

/* ---------------------------------------------------------
   OFFER STATE MACHINE
--------------------------------------------------------- */
enum OfferState {
  NotEligible = "NotEligible",
  Eligible = "Eligible",
}

type Action =
  | { type: "BECAME_ELIGIBLE" }
  | { type: "LOST_ELIGIBILITY" };

interface State {
  offerState: OfferState;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "BECAME_ELIGIBLE":
      return { ...state, offerState: OfferState.Eligible };
    case "LOST_ELIGIBILITY":
      return { offerState: OfferState.NotEligible };
    default:
      return state;
  }
}

/* ---------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */
export const SpecialOfferBanner = ({
  itemCount,
  minPacketsForDiscount = 2,
  onFreeItemsSelected,
}: {
  itemCount: number;
  minPacketsForDiscount?: number;
  onFreeItemsSelected?: (selected: string[]) => void;
}) => {
  const reducedMotion = useReducedMotion();
  const minCount = minPacketsForDiscount;

  const [snowflakes, setSnowflakes] = useState<
    { top: string; left: string; duration: string; delay: string }[]
  >([]);

  const [state, dispatch] = useReducer(reducer, {
    offerState:
      itemCount >= minCount ? OfferState.Eligible : OfferState.NotEligible,
  });

  const prevCount = useRef(itemCount);

  const isEligible = itemCount >= minCount;
  const progress = Math.min(100, (itemCount / minCount) * 100);
  const packetsNeeded = Math.max(0, minCount - itemCount);

  /* ---------------------------------------------------------
     SNOWFLAKE GENERATION
  --------------------------------------------------------- */
  useEffect(() => {
    const flakes = Array.from({ length: 16 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 4}s`,
    }));
    setSnowflakes(flakes);
  }, []);

  /* ---------------------------------------------------------
     HANDLE ELIGIBILITY CHANGES
  --------------------------------------------------------- */
  useEffect(() => {
    const prev = prevCount.current;
    prevCount.current = itemCount;

    if (itemCount >= minCount && prev < minCount) {
      dispatch({ type: "BECAME_ELIGIBLE" });
    } else if (itemCount < minCount && prev >= minCount) {
      dispatch({ type: "LOST_ELIGIBILITY" });
    }
  }, [itemCount, minCount]);

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <section
      className="
        relative w-full rounded-2xl sm:rounded-3xl 
        overflow-hidden shadow-xl
        bg-gradient-to-b from-[#0d1117] via-[#14212e] to-[#0d1117]
        text-white py-10 sm:py-12 px-6 sm:px-10 mt-10
      "
    >
      {/* SNOW */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {snowflakes.map((f, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-white rounded-full animate-snow"
            style={{
              top: f.top,
              left: f.left,
              animationDuration: f.duration,
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>

      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_70%)]"></div>

      {/* LABEL */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-blue-200/90 uppercase tracking-widest text-xs sm:text-sm mb-4 text-center"
      >
        <div className="flex justify-center items-center gap-2">
          <Snowflake className="w-4 h-4" />
          Christmas Special
          <Snowflake className="w-4 h-4" />
        </div>
      </motion.div>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
      >
        <span>Enjoy Christmas Savings</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
          25% OFF on ₹250+
        </span>
      </motion.h1>

      {/* SUBTEXT */}
      <p className="text-center text-white/85 max-w-xl mx-auto text-sm sm:text-base mb-8">
        A little Christmas gift from us to you — save big this festive season!
      </p>

      {/* OFFER LOGIC */}
      <AnimatePresence mode="wait">
        {/* NOT ELIGIBLE */}
        {!isEligible && (
          <motion.div
            key="not-eligible"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="text-center space-y-3"
          >
            <p className="text-blue-200 text-sm">
              Add <span className="font-semibold text-blue-100">{packetsNeeded}</span> more items to unlock 25% OFF
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-300 to-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ELIGIBLE / SELECTED OFFER */}
        {isEligible && (
          <motion.div
            key="eligible"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="text-center space-y-4"
          >
            <div className="px-3 py-2 bg-blue-900/20 backdrop-blur-md border border-blue-400/20 rounded-lg max-w-md mx-auto">
              <p className="text-blue-200 flex justify-center items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-blue-300" />
                Christmas Deal Applied! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER ICONS */}
      <div className="flex justify-center gap-4 text-white/60 mt-6 text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4" /> Limited Time
        </div>
        <div className="flex items-center gap-1">
          <Gift className="w-4 h-4 text-blue-200" /> Festive Perks
        </div>
      </div>

      
      {/* KEYFRAMES */}
      <style>{`
        @keyframes snow {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        .animate-snow {
          animation-name: snow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  );
};
