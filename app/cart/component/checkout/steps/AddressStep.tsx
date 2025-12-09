'use client';

import { MapPin, Building, Home, Locate } from 'lucide-react';
import { BackButton } from '../BackButton';

interface AddressDetails {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface AddressStepProps {
  addressDetails: AddressDetails;
  setAddressDetails: (details: AddressDetails) => void;
  line1Error?: string;
  cityError?: string;
  stateError?: string;
  pincodeError?: string;
  onContinue: () => void;
  onBack: () => void;
}

export const AddressStep = ({
  addressDetails,
  setAddressDetails,
  line1Error,
  cityError,
  stateError,
  pincodeError,
  onContinue,
  onBack,
}: AddressStepProps) => {
  return (
    <div>
      <BackButton onClick={onBack} label="Back to Contact" />
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
          onClick={onContinue}
          className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-all duration-200 text-base font-medium"
          aria-label="Review order"
        >
          Review Order
        </button>
      </div>
    </div>
  );
};
