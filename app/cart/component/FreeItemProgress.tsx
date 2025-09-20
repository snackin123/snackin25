import type { CartItem } from '@/lib/cart-context';

interface FreeItemProgressProps {
  cartItems: CartItem[];
  freeItemThreshold: number;
  freeItemName: string;
}

export const FreeItemProgress = ({ cartItems, freeItemThreshold, freeItemName }: FreeItemProgressProps) => {
  const calculateProgress = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const hasEarnedFreeItem = totalItems >= freeItemThreshold;
    const itemsNeeded = hasEarnedFreeItem ? 0 : freeItemThreshold - totalItems;
    const progress = hasEarnedFreeItem ? 100 : (totalItems / freeItemThreshold) * 100;
    return { progress, itemsNeeded };
  };

  const { progress, itemsNeeded } = calculateProgress();

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <p className="text-sm text-yellow-700 mb-3">
        Buy {freeItemThreshold} or more flavours and get 1 pack of {freeItemName} absolutely free!
      </p>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-yellow-800 font-medium text-center">
        {itemsNeeded === 0 ? (
          <span>🎉 You've earned a free {freeItemName}!</span>
        ) : (
          <span>{itemsNeeded} more item{itemsNeeded !== 1 ? 's' : ''} to go!</span>
        )}
      </p>
    </div>
  );
};