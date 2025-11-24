'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, X } from 'lucide-react';
import Image from 'next/image';
import { products } from '@/lib/data/products';

interface FreeItemSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectionComplete: (selectedItems: string[]) => void;
  maxSelections: number;
}

export const FreeItemSelector = ({ 
  isVisible, 
  onClose, 
  onSelectionComplete, 
  maxSelections = 2 
}: FreeItemSelectorProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filter products to show only eligible free items (you can customize this)
  const freeItems = products.filter(product => {
    const price = parseFloat(product.originalPrice?.replace('₹', '') || '0');
    return price <= 200 && product.inStock !== false; // Only show items under ₹200 and in stock
  });

  const handleToggleSelection = (productId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < maxSelections) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleConfirmSelection = () => {
    if (selectedItems.length === maxSelections) {
      onSelectionComplete(selectedItems);
      onClose();
      setSelectedItems([]);
    }
  };

  const getItemName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || '';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-black text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-300" />
              <div>
                <h2 className="text-2xl font-bold">Select Your FREE Items</h2>
                <p className="text-red-200 text-sm mt-1">
                  Choose {maxSelections} items absolutely FREE (Black Friday Deal!)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Selection Counter */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-red-800 font-medium">
              Selected: {selectedItems.length} / {maxSelections}
            </span>
            {selectedItems.length === maxSelections && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Ready to confirm!
              </span>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeItems.map((product) => {
              const isSelected = selectedItems.includes(product.id);
              const canSelect = selectedItems.length < maxSelections || isSelected;

              return (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: canSelect ? 1.02 : 1 }}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50'
                      : canSelect
                      ? 'border-gray-200 hover:border-red-300 bg-white'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => canSelect && handleToggleSelection(product.id)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                    <Image
                      src={
                        product?.image?.startsWith('http')
                          ? product.image
                          : product?.image
                          ? product.image.startsWith('/')
                            ? product.image
                            : `/${product.image}`
                          : '/placeholder.jpg'
                      }
                      alt={product?.name || 'Product image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          FREE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600 line-through">
                      {product.originalPrice}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      FREE!
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                You've selected {selectedItems.length} free item{selectedItems.length !== 1 ? 's' : ''}
              </p>
              {selectedItems.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedItems.map(id => getItemName(id)).join(', ')}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={selectedItems.length !== maxSelections}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedItems.length === maxSelections
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
