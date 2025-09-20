'use client';

import { useCart } from '@/lib/cart-context';
import { products as allProducts, Product } from '@/lib/data/products';
import Image from 'next/image';
import { useState } from 'react';
import NavratriPromoBanner from '../components/PromoBanner/PromoBanner';
  
const ProductsContent = () => {
  const [products] = useState<Product[]>(allProducts);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<string | number, boolean>>({});
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    // Safely extract and parse the price
    const getNumericValue = (priceStr: string | undefined): number => {
      if (!priceStr) return 0;
      const numericStr = priceStr.replace(/[^0-9.]/g, '');
      return parseFloat(numericStr) || 0;
    };

    // Use originalPrice since we removed offerPrice
    const price = getNumericValue(product.originalPrice);

    if (price <= 0) {
      console.error('Invalid price for product:', product.id, product.name);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.image?.startsWith('http') ? product.image :
        (product.image ? `/${product.image}` : '/placeholder.jpg'),
      weight: product.weight,
      description: product.description,
      originalPrice: price, // Using the same price since we don't have offerPrice anymore
      category: product.category,
      // Make these properties optional since they might not exist on all products
      ...(product.color && { color: product.color }),
      ...(product.hoverImage && { hoverImage: product.hoverImage }),
      inStock: product.inStock !== false,
      rating: product.rating,
      numReviews: product.numReviews || 0
    });

    // Show feedback
    setAddedToCart(prev => ({
      ...prev,
      [product.id]: true
    }));

    // Reset feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Products...</h1>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
      <div className="mt-8 mb-12">
          <NavratriPromoBanner />
        </div>
        <h1 className="text-4xl font-bold text-center mb-12 text-red-900">Our Products</h1>
    
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
            {products.map((product, index) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
                      {product.weight && (
                        <span className="text-sm text-gray-500">{product.weight}</span>
                      )}
                    </div>

                  </div>

                  <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={product?.image?.startsWith('http') ?
                        product.image :
                        (product?.image ?
                          (product.image.startsWith('/') ? product.image : `/${product.image}`) :
                          '/placeholder.jpg'
                        )}
                      alt={product?.name || 'Product image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between min-h-[48px]">
                    <div className="flex items-center h-full">
                      {product.originalPrice ? (
                        <div className="flex flex-col justify-center h-full">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.originalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">Price not available</span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!!addedToCart[product.id]}
                        className={`min-w-[100px] sm:min-w-[110px] md:min-w-[120px] px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full font-bold transition-colors h-10 flex items-center justify-center ${addedToCart[product.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-500 text-red-900 hover:bg-amber-400 hover:brightness-110 transition-all duration-300'
                          }`}
                      >
                        {addedToCart[product.id] ? 'Added!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// Export the ProductsContent component directly
export default ProductsContent;
