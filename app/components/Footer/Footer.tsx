'use client';

import Image from 'next/image';
import { FaEnvelope, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        {/* Bigger Logo */}
        <div className="relative w-44 h-16 sm:w-52 sm:h-20">
          <Image
            src="/Images/WhiteLogo.webp"
            alt="SnackIn Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-sm text-center text-gray-400 max-w-md leading-relaxed">
          Crafted with love, snackin' brings you delicious, healthy bites for every moment.
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4 text-gray-300">
          <a 
            href="mailto:hello@snackinofficial.com" 
            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
            aria-label="Email us"
          >
            <FaEnvelope className="w-4 h-4" />
            <span className="text-sm">hello@snackinofficial.com</span>
          </a>
          <a 
            href="tel:+919028654048" 
            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
            aria-label="Call us"
          >
            <FaPhone className="w-4 h-4" />
            <span className="text-sm">+91 90286-54048</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center space-x-4 mt-4">
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

        {/* Copyright */}
        <p className="text-xs text-gray-500 mt-2">{new Date().getFullYear()} The snackin' Company</p>
      </div>
    </footer>
  );
}
