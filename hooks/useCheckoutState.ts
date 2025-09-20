
import { useState } from 'react';
import { VALIDATION } from '@/lib/constants';

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

interface CheckoutState {
  checkoutStep: 'cart' | 'contact' | 'address' | 'summary' | 'payment';
  setCheckoutStep: (step: 'cart' | 'contact' | 'address' | 'summary' | 'payment') => void;
  contactDetails: ContactDetails;
  setContactDetails: (details: ContactDetails) => void;
  addressDetails: AddressDetails;
  setAddressDetails: (details: AddressDetails) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  mobileError: string;
  emailError: string;
  nameError: string;
  line1Error: string;
  cityError: string;
  stateError: string;
  pincodeError: string;
  validateContact: () => boolean;
  validateAddress: () => boolean;
}

export const useCheckoutState = (): CheckoutState => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'contact' | 'address' | 'summary' | 'payment'>('cart');
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    name: '',
    email: '',
    mobile: '',
  });
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [line1Error, setLine1Error] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  const validateContact = () => {
    setMobileError('');
    setEmailError('');
    setNameError('');

    let isValid = true;
    if (!contactDetails.name.trim()) {
      setNameError('Please enter your full name');
      isValid = false;
    }
    if (!VALIDATION.MOBILE.test(contactDetails.mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    }
    if (!VALIDATION.EMAIL.test(contactDetails.email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }
    return isValid;
  };

  const validateAddress = () => {
    let isValid = true;
    setLine1Error('');
    setCityError('');
    setStateError('');
    setPincodeError('');

    if (!addressDetails.line1) {
      setLine1Error('Address line 1 is required');
      isValid = false;
    }
    if (!addressDetails.city) {
      setCityError('City is required');
      isValid = false;
    }
    if (!addressDetails.state) {
      setStateError('State is required');
      isValid = false;
    }
    if (!addressDetails.pincode) {
      setPincodeError('Pincode is required');
      isValid = false;
    } else if (!/^\d{6}$/.test(addressDetails.pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      isValid = false;
    }
    return isValid;
  };

  return {
    checkoutStep,
    setCheckoutStep,
    contactDetails,
    setContactDetails,
    addressDetails,
    setAddressDetails,
    errorMessage,
    setErrorMessage,
    mobileError,
    emailError,
    nameError,
    line1Error,
    cityError,
    stateError,
    pincodeError,
    validateContact,
    validateAddress,
  };
};
