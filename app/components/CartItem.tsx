'use client';

import Image, { type ImageProps } from 'next/image';
import { type ReactNode } from 'react';

interface CartItemType {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight?: string;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    onUpdateQuantity(item.id, newQty);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = '/Images/Plastic_Pouch_1.avif';
  };

  return (
    <div className="flex items-center space-x-4 p-4 md:p-6 border-b last:border-0">
      <div className="w-24 h-24 md:w-32 md:h-32 relative">
        <Image
          priority
          src={item.image?.startsWith('http') ? item.image : item.image.startsWith('/') ? item.image : `/${item.image}`}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100px, 128px"
          className="object-cover rounded-lg"
          onError={handleImageError}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.weight || '100g'}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => onRemove(item.id)}
              className="text-sm text-red-500 hover:text-red-700 mt-1"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}