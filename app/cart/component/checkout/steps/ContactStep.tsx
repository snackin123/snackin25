'use client';

import { User, Mail, Smartphone } from 'lucide-react';
import { BackButton } from '../BackButton';

interface ContactDetails {
  name: string;
  email: string;
  mobile: string;
}

interface ContactStepProps {
  contactDetails: ContactDetails;
  setContactDetails: (details: ContactDetails) => void;
  nameError?: string;
  mobileError?: string;
  emailError?: string;
  onContinue: () => void;
  onBack: () => void;
}

export const ContactStep = ({
  contactDetails,
  setContactDetails,
  nameError,
  mobileError,
  emailError,
  onContinue,
  onBack,
}: ContactStepProps) => {
  return (
    <div>
      <BackButton onClick={onBack} label="Back to Cart" />
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
        onClick={onContinue}
        className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg mt-6 hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 text-base font-medium"
        aria-label="Continue to address step"
      >
        Continue
      </button>
    </div>
  );
};
