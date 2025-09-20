import Image from 'next/image';
import type { CartItem as CartItemType } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
}

export const CartItem = ({ item, removeFromCart, updateQuantity }: CartItemProps) => (
  <div className="flex flex-col sm:flex-row gap-3 p-4 border rounded-l bg-white shadow hover:shadow-md transition">
    <div className="relative w-full sm:w-24 sm:h-24 aspect-square bg-gray-100 rounded-lg overflow-hidden">
      {item.image ? (
        <Image
          src={item.image.startsWith('http') ? item.image :
            item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${item.image}` :
              `/${item.image}`}
          alt={item.name || 'Product image'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 128px"
          priority={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            if (target.parentElement) {
              const fallbackSvg = document.createElement('div');
              fallbackSvg.className = 'w-full h-full flex items-center justify-center bg-gray-100';
              fallbackSvg.innerHTML = `
                <svg class="w-1/2 h-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>`;
              target.parentElement.replaceChild(fallbackSvg, target);
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <svg
            className="w-1/2 h-1/2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-2">{item.name}</h3>
          {item.weight && (
            <p className="text-xs text-gray-800">{item.weight}</p>
          )}
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-700 hover:text-red-500 transition text-sm"
          aria-label={`Remove ${item.name}`}
        >
          ✕
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center border-2 border-amber-400 rounded-full overflow-hidden bg-white w-fit">
          <button
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-all duration-150"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <span className="text-lg font-medium text-amber-700">-</span>
          </button>
          <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-all duration-150"
            aria-label={`Increase quantity of ${item.name}`}
          >
            <span className="text-lg font-medium text-amber-700">+</span>
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-800">{formatPrice(Number(item.price))}</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(Number(item.price) * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  </div>
);