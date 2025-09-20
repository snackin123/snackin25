'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/lib/cart-context';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Use the cart context directly
  const { cartCount } = useCart?.() || { cartCount: 0 };
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const hasItems = isClient && cartCount > 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    if (isMenuOpen) {
      const handleRouteChange = () => setIsMenuOpen(false);
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [isMenuOpen]);

  return (
    <div className={`fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 w-[96%] sm:w-[90%] max-w-6xl z-50 transition-transform duration-300 ${visible ? '' : '-translate-y-full'}`}>
      <nav className="bg-black/40 backdrop-blur-lg rounded-full shadow-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left - Mobile Cart Icon */}
          <div className="lg:hidden w-10 flex-shrink-0">
            <Link 
              href="/cart" 
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 transition"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {isClient && hasItems && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <Link href="/" className="relative w-24 sm:w-28 md:w-32 h-10 md:h-12 mx-auto lg:mx-0">
              {isClient && (
                <Image
                  src="/Images/WhiteLogo.webp"
                  alt="SnackIn Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 120px, 180px"
                  priority={false}
                  loading="lazy"
                  unoptimized={process.env.NODE_ENV !== 'production'}
                />
              )}
            </Link>
          </div>

          {/* Right - Hamburger Menu */}
          <div className="lg:hidden w-10 flex-shrink-0 flex justify-end">
            <button
              onClick={toggleMenu}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>

          {/* Desktop Nav Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {[
              { href: '/', label: 'Home' },
              { href: '/our-story', label: 'Our Story' },
              { href: '/products', label: 'Products' },
              { href: '/contact-us', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white hover:text-amber-400 transition text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            
            {/* Social Icons - Desktop */}
            <div className="flex items-center space-x-3 ml-2 border-l border-white/20 pl-4">
              <a 
                href="https://www.instagram.com/snackin_india/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-500 text-white hover:opacity-90 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/snackin-official" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <Link 
                href="/cart" 
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 transition"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="w-5 h-5" />
                {isClient && hasItems && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-lg rounded-xl mt-2 mx-auto w-full max-w-md p-6">
          <nav className="flex flex-col space-y-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/our-story', label: 'Our Story' },
              { href: '/products', label: 'Products' },
              { href: '/contact-us', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base text-white hover:text-amber-400 transition py-2 px-4 rounded hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-sm text-gray-300 mb-4">Connect with us</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.instagram.com/snackin_india/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-500 text-white hover:opacity-90 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/snackin-official" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
