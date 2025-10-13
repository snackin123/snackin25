import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ShoppingBag, Tag, Zap, Sparkles } from 'lucide-react';

interface SpecialOfferBannerProps {
  itemCount: number;
  minPacketsForDiscount?: number;
}

const ProgressBar = ({ progress, isEligible }: { progress: number; isEligible: boolean }) => (
  <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      className={`h-full rounded-full ${
        isEligible
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
          : 'bg-gradient-to-r from-amber-400 to-orange-500'
      } shadow-sm`}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
);

export const SpecialOfferBanner = ({ itemCount, minPacketsForDiscount = 4 }: SpecialOfferBannerProps) => {
  const progress = Math.min(100, (itemCount / minPacketsForDiscount) * 100);
  const packetsNeeded = minPacketsForDiscount - itemCount;
  const isEligible = itemCount >= minPacketsForDiscount;

  return (
    <div className="relative w-full">
      {/* Diwali Badge */}
      <div className="mb-2 flex justify-center">
        <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full border border-orange-200 shadow-sm">
          Diwali Special
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${
          isEligible
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200'
            : 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200'
        }`}
      >
        {/* Decorative blurred background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-8 -right-8 h-32 w-32 bg-yellow-200/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-orange-200/20 rounded-full blur-2xl" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Icon */}
          <div className={`p-4 rounded-full shadow-lg ${
            isEligible
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-200'
              : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-200'
          }`}>
            {isEligible ? <Gift className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className={`text-lg font-semibold ${
                isEligible ? 'text-orange-800' : 'text-amber-800'
              }`}>
                {isEligible ? 'Diwali Offer Unlocked!' : 'Diwali Special Offer'}
              </h3>

              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                <Zap className="w-3 h-3 text-orange-600" />
                Limited Time
              </span>
            </div>

            <p className="text-sm text-gray-700">
              Get <span className="font-bold text-orange-700">₹100 OFF</span> on 4+ snackin' packs
            </p>

            <AnimatePresence mode="wait">
              {!isEligible ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  <div className="flex justify-between items-center text-sm font-medium text-amber-800">
                    <span>{itemCount} of {minPacketsForDiscount} packs</span>
                    <span className="text-orange-700">{packetsNeeded} more to unlock</span>
                  </div>

                  <ProgressBar progress={progress} isEligible={isEligible} />

                  <p className="text-xs text-gray-600 text-center sm:text-left">
                    Add <span className="font-semibold text-orange-700">{packetsNeeded} more snackin' pack{packetsNeeded !== 1 ? 's' : ''}</span> to save ₹100!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200"
                >
                  <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    ₹100 OFF Applied!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
