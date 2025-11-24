
'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import { CreditCard, Mail, MapPin, Building, Home, Locate, ShieldCheck, User, Smartphone, X, Gift } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { useCoupon } from '@/hooks/useCoupon';
import type { CartItem } from '@/lib/cart-context';
import { CART } from '@/lib/constants';
import { products as allProducts } from '@/lib/data/products';

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  theme: { color: string; backdropColor: string };
  modal: { ondismiss: () => void; escape: boolean; backdropclose: boolean };
  config: { display: { blocks: any; sequence: string[]; preferences: { show_default_blocks: boolean } } };
  checkout: { method: { [key: string]: string } };
  prefill: { name: string; email: string; contact: string };
  notes: { [key: string]: string };
  retry: { enabled: boolean; max_count: number };
  timeout: number;
  remember_customer: boolean;
}

declare const Razorpay: {
  new(options: RazorpayOptions): {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
    close: () => void;
  };
};

interface CheckoutModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  checkoutStep: 'cart' | 'contact' | 'address' | 'summary' | 'payment';
  setCheckoutStep: (step: 'cart' | 'contact' | 'address' | 'summary' | 'payment') => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  couponState: ReturnType<typeof useCoupon>;
  setOrderPlaced: (placed: boolean) => void;
  setOrderDetails: (details: any) => void;
  clearCart: () => void;
  freeItems?: string[]; 
}

export const CheckoutModal = ({
  showModal,
  setShowModal,
  checkoutStep,
  setCheckoutStep,
  cartItems,
  subtotal,
  discount,
  shipping,
  finalTotal,
  couponState,
  setOrderPlaced,
  setOrderDetails,
  clearCart,
  freeItems = [],
}: CheckoutModalProps) => {
  const { checkoutStep: currentStep, contactDetails, setContactDetails, addressDetails, setAddressDetails, validateContact, validateAddress, errorMessage, setErrorMessage, mobileError, emailError, nameError, line1Error, cityError, stateError, pincodeError } = useCheckoutState();
  const { couponCode, setCouponCode, isCouponApplied, showCouponInput, setShowCouponInput, isApplyingCoupon, couponError, setCouponError, successMessage, handleApplyCoupon, handleRemoveCoupon, setDiscount, setShipping } = couponState;
  const razorpayScriptLoaded = useRef(false);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.id = 'razorpay-checkout-script';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }, []);

  const checkRazorpayHealth = (): boolean => {
    try {
      if (typeof window === 'undefined' || !(window as any).Razorpay) return false;
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) return false;
      return true;
    } catch {
      return false;
    }
  };

  const handleCheckout = async () => {
    if (checkoutStep === 'contact') {
      if (validateContact()) {
        setCheckoutStep('address');
      }
    } else if (checkoutStep === 'address') {
      if (validateAddress()) {
        setCheckoutStep('summary');
      }
    } else if (checkoutStep === 'payment') {
      setErrorMessage('');
      try {
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) throw new Error('Payment gateway is not configured');
        if (cartItems.length === 0) throw new Error('Your cart is empty');

        const response = await fetch('/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            currency: 'INR',
            contactDetails,
            addressDetails,
            cartItems,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create order');
        }

        const order = await response.json();
        await loadRazorpayScript();

        if (!(window as any).Razorpay) {
          throw new Error('Payment gateway not available');
        }

        const generateOrderDescription = (items: CartItem[]): string => {
          if (items.length === 0) return 'Order Payment';
          const itemsSummary = items.reduce<Record<string, number>>((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
          }, {});
          const description = Object.entries(itemsSummary)
            .map(([name, quantity]) => `${quantity}x ${name}`)
            .join(', ');
          return description.length > 100 ? description.substring(0, 97) + '...' : description;
        };

        const options: RazorpayOptions = {
          key: razorpayKey,
          amount: Math.round(finalTotal * 100),
          currency: 'INR',
          name: 'The Snackin Company',
          description: generateOrderDescription(cartItems),
          order_id: order.id,
          handler: (response: any) => {
            const orderData = {
              id: order.id,
              date: new Date().toISOString(),
              total: finalTotal,
              customerEmail: contactDetails.email,
              customerName: contactDetails.name,
              customerPhone: contactDetails.mobile,
              shippingAddress: addressDetails,
              paymentStatus: 'paid',
              status: 'confirmed',
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                weight: item.weight,
              })),
              subtotal,
              shipping,
              discount,
            };

            setOrderPlaced(true);
            setOrderDetails({ ...orderData, razorpay_order_id: order.id, razorpay_payment_id: response.razorpay_payment_id });

            localStorage.setItem('currentOrder', JSON.stringify({
              ...orderData,
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              customerEmail: contactDetails.email,
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                weight: item.weight,
              })),
              subtotal,
              shipping,
              total: finalTotal,
              shippingAddress: addressDetails,
              contactDetails,
            }));

            const orderHistory = JSON.parse(localStorage.getItem('snackin_orders') || '[]');
            orderHistory.push(orderData);
            localStorage.setItem('snackin_orders', JSON.stringify(orderHistory));

            clearCart();
            setShowModal(false);
            window.location.href = `/order-success?order_id=${order.id}&payment_id=${response.razorpay_payment_id}`;
          },
          theme: { color: '#F59E0B', backdropColor: '#FFFBEB' },
          modal: { ondismiss: () => {}, escape: false, backdropclose: false },
          config: {
            display: {
              blocks: {
                upi: { name: 'UPI', instruments: [{ method: 'upi', flows: ['collect', 'intent', 'qr'] }] },
                netbanking: { name: 'Net Banking', instruments: [{ method: 'netbanking' }] },
                card: { name: 'Credit/Debit Card', instruments: [{ method: 'card' }] },
                wallet: { name: 'Wallets', instruments: [{ method: 'wallet' }] },
                paylater: { name: 'Pay Later', instruments: [{ method: 'paylater' }] },
              },
              sequence: ['block.upi', 'block.card', 'block.netbanking', 'block.wallet', 'block.paylater'],
              preferences: { show_default_blocks: true },
            },
          },
          checkout: { method: { netbanking: '1', card: '1', upi: '1', wallet: '1' } },
          prefill: {
            name: contactDetails.name || contactDetails.mobile,
            email: contactDetails.email,
            contact: contactDetails.mobile.replace(/\s/g, ''),
          },
          notes: { 
            source: 'snackin_web_checkout', 
            customer_email: contactDetails.email,
            customer_name: contactDetails.name,
            customer_phone: contactDetails.mobile,
            order_total: `₹${finalTotal}`,
            cart_items: cartItems.map(item => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join(', '),
            cart_summary: `${cartItems.length} item(s) - ₹${subtotal}`,
            shipping_address: `${addressDetails.line1}, ${addressDetails.city}, ${addressDetails.state} - ${addressDetails.pincode}`,
            free_items_count: freeItems.length.toString(),
            free_items_value: freeItems.length > 0 ? `₹${freeItems.length * 129}` : '₹0',
            created_at: new Date().toISOString()
          },
          retry: { enabled: true, max_count: 4 },
          timeout: 900,
          remember_customer: true,
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          const error = response.error || {};
          let userMessage = 'Payment failed. ';
          if (error.code === 'PAYMENT_CANCELLED') {
            userMessage = 'Payment was cancelled. Please try again.';
          } else if (error.code === 'NETWORK_ISSUE') {
            userMessage = 'Network issue occurred. Please check your internet connection.';
          } else if (error.code === 'INSUFFICIENT_FUNDS') {
            userMessage = 'Insufficient funds. Please try a different payment method.';
          } else if (error.code === 'INVALID_CARD_DETAILS') {
            userMessage = 'Invalid card details. Please check and try again.';
          } else if (error.description) {
            userMessage += error.description;
          } else {
            userMessage += 'Please try again or use a different payment method.';
          }
          setErrorMessage(userMessage);
        });
        rzp.open();
      } catch (error: any) {
        setErrorMessage(`Payment Error: ${error.message || 'Failed to process payment'}. Please try again.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-8 overflow-y-auto">
      <div className="relative flex flex-col md:flex-row rounded-2xl shadow-2xl max-w-4xl w-full mx-auto border-4 border-amber-500 bg-white overflow-hidden animate-fadeIn max-h-[90vh] my-8">
        <div className={`bg-amber-50 ${checkoutStep === 'summary' ? 'md:w-2/5' : 'md:w-1/2'} w-full p-6 flex flex-col justify-between overflow-y-auto`}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/Images/favicon-32x32.png"
                alt="The Snackin Company"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-bold text-lg text-amber-950">The Snackin Company</span>
            </div>
            <div className="text-xs text-green-700 mb-4">Shipped more than 100 orders last month</div>
            <div className="bg-white rounded-lg p-4 shadow mb-4">
              <h2 className="text-base font-semibold mb-2 text-red-900">Your Order</h2>
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="flex items-center gap-3 mb-2">
                  <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                      priority={false}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-700">Qty. {item.quantity}</div>
                  </div>
                  <div className="font-bold text-sm text-gray-900">{formatPrice((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity)}</div>
                </div>
              ))}
              
              {/* Free Items Display */}
              {freeItems.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-2 pt-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-sm text-green-600">
                      Free Items ({freeItems.length}): FREE
                    </span>
                  </div>
                  {freeItems.map((itemId: string, index: number) => {
                    const product = allProducts.find((p: any) => p.id === itemId);
                    return product ? (
                      <div key={itemId} className="flex items-center gap-3 mb-2 ml-6">
                        <div className="relative w-10 h-10 bg-green-50 rounded overflow-hidden border border-green-200">
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
                            sizes="40px"
                            priority={false}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-green-700">{product.name}</div>
                          <div className="text-xs text-green-600 line-through">{product.originalPrice}</div>
                        </div>
                        <div className="font-bold text-sm text-green-600">FREE</div>
                      </div>
                    ) : null;
                  })}
                </>
              )}
              
              <hr className="my-2" />
              <div className="flex justify-between text-xs mb-1 text-gray-800">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 text-sm">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-800">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base mt-2 text-amber-600">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {CART.COUPON_FEATURE_ENABLED && showCouponInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-gray-800"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    disabled={isApplyingCoupon || isCouponApplied}
                  />
                  <button
                    onClick={isCouponApplied ? () => handleRemoveCoupon() : handleApplyCoupon}
                    className={`px-4 py-2 rounded-lg font-medium ${isCouponApplied ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-white`}
                    disabled={isApplyingCoupon || (!couponCode.trim() && !isCouponApplied)}
                  >
                    {isApplyingCoupon ? 'Applying...' : isCouponApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
              ) : CART.COUPON_FEATURE_ENABLED ? (
                <div className="flex justify-between items-center">
                  <p className="text-amber-700">
                    {isCouponApplied ? `Coupon ${couponCode} applied` : 'Have a coupon code?'}
                  </p>
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-amber-600 hover:underline text-sm font-medium"
                  >
                    {isCouponApplied ? 'Change' : 'Apply'}
                  </button>
                </div>
              ) : null}
              {(couponError || successMessage) && (
                <div className={`text-sm ${couponError ? 'text-red-600' : 'text-green-600'}`}>
                  {couponError || successMessage}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <ShieldCheck className="w-5 h-5 text-amber-900" />
            <span className="ml-2 text-xs text-amber-900">Secured & Encrypted Checkout</span>
          </div>
        </div>
        <div className={`bg-white ${checkoutStep === 'summary' ? 'md:w-3/5' : 'md:w-1/2'} w-full p-6 flex flex-col overflow-y-auto relative`}>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            onClick={() => {
              setShowModal(false);
              setCheckoutStep('cart');
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex items-center justify-center mb-8 pt-2">
            <div className="flex gap-2 sm:gap-4 text-center justify-center flex-wrap">
              <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'contact' ? 'text-amber-600' : 'text-gray-600'}`}>Contact</span>
              <span className="text-gray-300">|</span>
              <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'address' ? 'text-amber-600' : 'text-gray-600'}`}>Address</span>
              <span className="text-gray-300">|</span>
              <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'summary' ? 'text-amber-600' : 'text-gray-600'}`}>Summary</span>
              <span className="text-gray-300">|</span>
              <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'payment' ? 'text-amber-600' : 'text-gray-600'}`}>Payment</span>
            </div>
          </div>
          {checkoutStep === 'contact' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setCheckoutStep('cart');
                }}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-4 group"
              >
                <svg
                  className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Cart
              </button>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Contact details</h2>
              <p className="text-gray-700 text-sm mb-6">Enter mobile & email to continue</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${nameError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      className="w-full outline-none p-0 text-sm text-gray-900"
                      placeholder="Enter your full name"
                      value={contactDetails.name}
                      onChange={e => {
                        setContactDetails({ ...contactDetails, name: e.target.value });
                      }}
                      required
                    />
                  </div>
                  {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                </div>
                <div>
                  <label htmlFor="mobile-number" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${mobileError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-800 text-sm">+91</span>
                    <input
                      id="mobile-number"
                      type="text"
                      value={contactDetails.mobile}
                      onChange={e => setContactDetails({ ...contactDetails, mobile: e.target.value.replace(/\D/g, '') })}
                      className="flex-1 outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="Mobile number"
                      aria-label="Mobile number"
                      maxLength={10}
                    />
                  </div>
                  {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
                </div>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className={`border rounded-lg p-3 transition-all flex items-center gap-2 ${emailError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <Mail className="w-5 h-5 text-gray-500" />
                    <input
                      id="email-address"
                      type="email"
                      value={contactDetails.email}
                      onChange={e => {
                        setContactDetails({ ...contactDetails, email: e.target.value });
                      }}
                      className="w-full outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="your.email@example.com"
                      aria-label="Email address"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg mt-6 hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 text-base font-medium"
                aria-label="Continue to address step"
              >
                Continue
              </button>
            </div>
          )}
          {checkoutStep === 'address' && (
            <div>
              <button
                type="button"
                onClick={() => setCheckoutStep('contact')}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-4 group"
              >
                <svg
                  className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Contact
              </button>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Shipping Address</h2>
              <p className="text-gray-700 text-sm mb-6">Enter your address to continue</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${line1Error ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <input
                      id="line1-address"
                      name="line1"
                      type="text"
                      value={addressDetails.line1}
                      onChange={e => {
                        setAddressDetails({ ...addressDetails, line1: e.target.value });
                      }}
                      className="flex-1 outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="Street Address"
                      aria-label="Street Address"
                    />
                  </div>
                  {line1Error && <p className="text-red-500 text-xs mt-1">{line1Error}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${cityError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <Building className="w-5 h-5 text-gray-500" />
                    <input
                      id="city"
                      type="text"
                      value={addressDetails.city}
                      onChange={e => {
                        setAddressDetails({ ...addressDetails, city: e.target.value });
                      }}
                      className="flex-1 outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="City"
                      aria-label="City"
                    />
                  </div>
                  {cityError && <p className="text-red-500 text-xs mt-1">{cityError}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${stateError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <Home className="w-5 h-5 text-gray-500" />
                    <input
                      id="state"
                      type="text"
                      value={addressDetails.state}
                      onChange={e => {
                        setAddressDetails({ ...addressDetails, state: e.target.value });
                      }}
                      className="flex-1 outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="State"
                      aria-label="State"
                    />
                  </div>
                  {stateError && <p className="text-red-500 text-xs mt-1">{stateError}</p>}
                </div>
                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <div className={`flex items-center gap-2 border rounded-lg p-3 transition-all ${pincodeError ? 'border-red-500 ring-red-500' : 'focus-within:ring-amber-500'}`}>
                    <Locate className="w-5 h-5 text-gray-500" />
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={addressDetails.pincode}
                      onChange={e => {
                        setAddressDetails({ ...addressDetails, pincode: e.target.value });
                      }}
                      className="flex-1 outline-none text-gray-800 text-sm placeholder-gray-500 bg-transparent"
                      placeholder="Postal Code"
                      aria-label="Postal Code"
                    />
                  </div>
                  {pincodeError && <p className="text-red-500 text-xs mt-1">{pincodeError}</p>}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-all duration-200 text-base font-medium"
                  aria-label="Review order"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}
          {checkoutStep === 'summary' && (
            <div className="w-full">
              <button
                type="button"
                onClick={() => setCheckoutStep('address')}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-6 group"
              >
                <svg
                  className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Address
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    {contactDetails.name}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {contactDetails.email}
                  </p>
                  <p className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                    +91 {contactDetails.mobile}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Shipping Address</h3>
                <div className="space-y-2 text-gray-700">
                  <p>{addressDetails.line1}</p>
                  <p>{addressDetails.city}, {addressDetails.state} - {addressDetails.pincode}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors font-medium whitespace-nowrap"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
          {checkoutStep === 'payment' && (
            <div className="flex flex-col items-center text-center p-4">
              <button
                type="button"
                onClick={() => setCheckoutStep('summary')}
                className="self-start flex items-center text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-4 group"
              >
                <svg
                  className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Preview
              </button>
              <CreditCard className="w-12 h-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Secure Payment</h2>
              <p className="text-gray-700 text-base mb-6">Your payment is securely processed by Razorpay.</p>
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg mt-6 hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 text-base font-medium"
                aria-label="Pay securely"
              >
                Pay {formatPrice(finalTotal)}
              </button>
              <p className="text-xs text-gray-500 mt-4">By clicking 'Pay', you agree to Razorpay's terms and conditions.</p>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> {successMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
