'use client';

import { useCart } from '@/lib/cart-context';
import { products as allProducts, Product } from '@/lib/data/products';
import Image from 'next/image';
import { useState } from 'react';
import DiwaliPromoBanner from '../components/PromoBanner/productBanner/ProductBanner';

const ProductsContent = () => {
  const [products] = useState<Product[]>(allProducts);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<string | number, boolean>>({});
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    const getNumericValue = (priceStr: string | undefined): number => {
      if (!priceStr) return 0;
      const numericStr = priceStr.replace(/[^0-9.]/g, '');
      return parseFloat(numericStr) || 0;
    };

    const price = getNumericValue(product.originalPrice);

    if (price <= 0) {
      console.error('Invalid price for product:', product.id, product.name);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: product.image?.startsWith('http')
        ? product.image
        : product.image
        ? `/${product.image}`
        : '/placeholder.jpg',
      weight: product.weight,
      description: product.description,
      originalPrice: price,
      category: product.category,
      ...(product.color && { color: product.color }),
      ...(product.hoverImage && { hoverImage: product.hoverImage }),
      inStock: product.inStock !== false,
      rating: product.rating,
      numReviews: product.numReviews || 0,
    });

    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [product.id]: false,
      }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Products...</h1>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
                  <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <DiwaliPromoBanner />
        </div>

        <h1 className="text-4xl font-extrabold text-center mb-12 text-red-900">
          Our Products
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  {/* Product Title + Weight */}
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h2>
                    {product.weight && (
                      <span className="text-sm text-gray-500">{product.weight}</span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
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
                      priority={index < 3}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Price + Button */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-auto">
                    {product.originalPrice ? (
                      <span className="text-lg md:text-xl font-bold text-gray-900">
                        {product.originalPrice}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Price not available</span>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!!addedToCart[product.id]}
                      className={`w-full md:w-auto px-4 py-2 text-sm sm:text-base rounded-full font-semibold transition-all duration-300 ${
                        addedToCart[product.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-500 text-red-900 hover:bg-amber-400'
                      }`}
                    >
                      {addedToCart[product.id] ? 'Added!' : 'Add to Cart'}
                    </button>
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

export default ProductsContent;
