'use client';

import { User, Mail, Smartphone } from 'lucide-react';
import { BackButton } from '../BackButton';

interface ContactDetails {
  name: string;
  email: string;
  mobile: string;
}

interface AddressDetails {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface SummaryStepProps {
  contactDetails: ContactDetails;
  addressDetails: AddressDetails;
  onContinue: () => void;
  onBack: () => void;
}

export const SummaryStep = ({
  contactDetails,
  addressDetails,
  onContinue,
  onBack,
}: SummaryStepProps) => {
  return (
    <div className="w-full">
      <BackButton onClick={onBack} label="Back to Address" />
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
          onClick={onContinue}
          className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors font-medium whitespace-nowrap"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};
