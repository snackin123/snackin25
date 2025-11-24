import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ShoppingBag, Tag, Zap, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { FreeItemSelector } from './FreeItemSelector';

interface SpecialOfferBannerProps {
  itemCount: number;
  minPacketsForDiscount?: number;
  onFreeItemsSelected?: (selectedItems: string[]) => void;
  triggerFreeItemSelector?: () => void; // Add prop to trigger selector
}

const ProgressBar = ({ progress, isEligible }: { progress: number; isEligible: boolean }) => (
  <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      className={`h-full rounded-full ${
        isEligible || progress >= 100
          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
          : 'bg-gradient-to-r from-amber-400 to-orange-500'
      } shadow-sm`}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
);

export const SpecialOfferBanner = ({ 
  itemCount, 
  minPacketsForDiscount = 2,
  onFreeItemsSelected,
  triggerFreeItemSelector
}: SpecialOfferBannerProps) => {
  const [showFreeItemSelector, setShowFreeItemSelector] = useState(false);
  const [autoPopupShown, setAutoPopupShown] = useState(false);
  const [freeItemsSelected, setFreeItemsSelected] = useState(false);
  const [currentFreeItems, setCurrentFreeItems] = useState<string[]>([]);
  const prevItemCountRef = useRef(itemCount);
  const prevFreeItemsSelectedRef = useRef(freeItemsSelected);
  
  // Handle external trigger to show free item selector
  useEffect(() => {
    if (triggerFreeItemSelector && isEligible && !freeItemsSelected) {
      setShowFreeItemSelector(true);
    }
  }, [triggerFreeItemSelector, isEligible, freeItemsSelected]);
  
  // Reset free items selection if cart count drops below minimum or becomes eligible again
  useEffect(() => {
    const prevItemCount = prevItemCountRef.current;
    const prevFreeItemsSelected = prevFreeItemsSelectedRef.current;
    
    // Update refs
    prevItemCountRef.current = itemCount;
    prevFreeItemsSelectedRef.current = freeItemsSelected;
    
    // Only run logic when itemCount actually changes
    if (prevItemCount !== itemCount) {
      if (itemCount < minPacketsForDiscount) {
        // User lost eligibility - clear everything
        setFreeItemsSelected(false);
        setCurrentFreeItems([]);
        setShowFreeItemSelector(false);
        setAutoPopupShown(false); // Reset auto-popup so it can trigger again
        // Notify parent component that free items are cleared
        if (onFreeItemsSelected) {
          onFreeItemsSelected([]);
        }
      } else if (itemCount >= minPacketsForDiscount && !freeItemsSelected) {
        // User became eligible again but hasn't selected items yet
        // Reset auto-popup to allow it to trigger again
        setAutoPopupShown(false);
      }
    }
  }, [itemCount, minPacketsForDiscount, freeItemsSelected, onFreeItemsSelected]);
  
  const progress = Math.min(100, (itemCount / minPacketsForDiscount) * 100);
  const packetsNeeded = Math.max(0, minPacketsForDiscount - itemCount);
  const isEligible = itemCount >= minPacketsForDiscount;

  // Auto-popup logic: Show free item selector after 3 seconds when eligible and not already selected
  useEffect(() => {
    if (isEligible && !autoPopupShown && !showFreeItemSelector && !freeItemsSelected) {
      const timer = setTimeout(() => {
        setShowFreeItemSelector(true);
        setAutoPopupShown(true);
      }, 3000); // 3 seconds delay

      return () => clearTimeout(timer);
    }
  }, [isEligible, autoPopupShown, showFreeItemSelector]); // Remove freeItemsSelected from dependencies

  const handleFreeItemsSelection = (selectedItems: string[]) => {
    if (onFreeItemsSelected) {
      onFreeItemsSelected(selectedItems);
      // Mark that free items have been selected to prevent future popups
      setFreeItemsSelected(true);
      // Store current selection for future changes
      setCurrentFreeItems(selectedItems);
    }
  };

  const handleSelectFreeItems = () => {
    setShowFreeItemSelector(true);
  };

  return (
    <div className="relative w-full">
      {/* Black Friday Badge */}
      <div className="mb-2 flex justify-center">
        <span className="inline-block bg-gradient-to-r from-red-600 to-black text-white text-xs sm:text-sm font-semibold px-4 py-1 rounded-full border border-red-500/30 shadow-sm">
          Black Friday Special
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl transition-all ${
          isEligible
            ? 'bg-gradient-to-br from-red-900/90 to-black/90 border border-red-500/30 text-white'
            : 'bg-gradient-to-br from-red-800/80 to-black/80 border border-red-500/20 text-white'
        }`}
      >
        {/* Decorative blurred background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-8 -right-8 h-32 w-32 bg-red-600/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-yellow-600/20 rounded-full blur-2xl" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          {/* Icon */}
          <div className={`p-3 sm:p-4 rounded-full shadow-lg ${
            isEligible
              ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white shadow-red-500/50'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
          }`}>
            {isEligible ? <Gift className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className={`text-base sm:text-lg font-semibold ${
                isEligible ? 'text-yellow-300' : 'text-red-200'
              }`}>
                {isEligible ? 'Black Friday Deal Unlocked!' : 'Black Friday Special Offer'}
              </h3>

              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-red-600/20 to-yellow-600/20 text-yellow-300 border border-yellow-500/30">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="hidden sm:inline">Limited Time</span>
                <span className="sm:hidden">Limited</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-red-200">
              Buy <span className="font-bold text-yellow-300">2 or more Snackin' items</span> and get <span className="font-bold text-yellow-300">2 absolutely FREE</span>
            </p>

            <AnimatePresence mode="wait">
              {!isEligible ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 sm:mt-3 space-y-2 overflow-hidden"
                >
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-red-200">
                    <span>{itemCount} of {minPacketsForDiscount} items</span>
                    <span className="text-yellow-300">{packetsNeeded} more to unlock</span>
                  </div>

                  <ProgressBar progress={progress} isEligible={isEligible} />

                  <p className="text-xs text-red-300 text-center sm:text-left">
                    Add <span className="font-semibold text-yellow-300">{packetsNeeded} more Snackin' item{packetsNeeded !== 1 ? 's' : ''}</span> to get 2 absolutely FREE!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 sm:mt-3 space-y-2"
                >
                  <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                    <p className="text-xs sm:text-sm font-medium text-green-300 flex items-center gap-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      {freeItemsSelected ? '2 FREE Items Selected! 🎉' : '2 FREE Items Applied! (Buy 2 or more, get 2 FREE)'}
                    </p>
                  </div>

                  {/* Always show selector button - allow users to change their selection */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSelectFreeItems}
                    className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-black text-white rounded-lg font-medium text-xs sm:text-sm hover:from-red-700 hover:to-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {freeItemsSelected ? 'Change Your FREE Items' : 'Select Your 2 FREE Items'}
                    </span>
                    <span className="sm:hidden">
                      {freeItemsSelected ? 'Change FREE Items' : 'Select 2 FREE Items'}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Free Item Selector Modal */}
      <FreeItemSelector
        isVisible={showFreeItemSelector}
        onClose={() => setShowFreeItemSelector(false)}
        onSelectionComplete={handleFreeItemsSelection}
        maxSelections={2}
        isAutoPopup={autoPopupShown && showFreeItemSelector}
        currentSelection={currentFreeItems}
      />
    </div>
  );
};
