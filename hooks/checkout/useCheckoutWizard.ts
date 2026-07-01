import { useState, useEffect, useCallback } from "react";

export interface CheckoutStep {
  number: number;
  title: string;
  isComplete: boolean;
  isCurrent: boolean;
}

export interface CheckoutData {
  // Step 1: Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;

  // Step 2: Package & Add-ons
  selectedPackage: string;
  selectedAddOns: string[];

  dietaryRequirement: string;
  dietaryOtherText: string;

  // Step 4: Payment
  paymentMethod: "qr" | "card" | "alipay";

  // Dynamic fields
  currency?: "THB" | "USD";
  selectedWorkshopTopic?: string;

  // Addon-only mode
  isAddonOnly?: boolean;
  purchasedAddOns?: string[];

  // Tax invoice
  needTaxInvoice: boolean;
  taxName: string;
  taxId: string;
  taxAddress: string;
  taxSubDistrict: string;
  taxDistrict: string;
  taxProvince: string;
  taxPostalCode: string;
}

const STORAGE_KEY = "accp_checkout_data_v2";

/**
 * Custom hook to manage the Multi-step Checkout Wizard state.
 * Handles form data, validation, navigation, and persistence via localStorage.
 *
 * @param totalSteps - Total number of steps in the wizard (default: 4)
 * @returns Object containing current state and handler functions
 */
export function useCheckoutWizard(totalSteps: number = 4) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    selectedPackage: "professional",
    selectedAddOns: [],
    dietaryRequirement: "",
    dietaryOtherText: "",
    paymentMethod: "card",
    currency: "USD",
    selectedWorkshopTopic: "",
    needTaxInvoice: false,
    taxName: "",
    taxId: "",
    taxAddress: "",
    taxSubDistrict: "",
    taxDistrict: "",
    taxProvince: "",
    taxPostalCode: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const savedCheckoutData = data.checkoutData || {};
        const normalizedPaymentMethod =
          savedCheckoutData.paymentMethod === "qr" ||
          savedCheckoutData.paymentMethod === "card" ||
          savedCheckoutData.paymentMethod === "alipay"
            ? savedCheckoutData.paymentMethod
            : "card";
        const normalizedNeedTaxInvoice = savedCheckoutData.needTaxInvoice === true;

        setCheckoutData((prev) => ({
          ...prev,
          ...savedCheckoutData,
          paymentMethod: normalizedPaymentMethod,
          needTaxInvoice: normalizedNeedTaxInvoice,
        }));
        setCurrentStep(data.currentStep || 1);
      } catch (e) {
        console.error("Failed to load checkout data:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    const dataToSave = {
      checkoutData,
      currentStep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [checkoutData, currentStep, isInitialized]);

  const updateCheckoutData = useCallback((updates: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const resetCheckout = useCallback(() => {
    setCurrentStep(1);
    setCheckoutData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      selectedPackage: "professional",
      selectedAddOns: [],
      dietaryRequirement: "",
      dietaryOtherText: "",
      paymentMethod: "card",
      currency: "USD",
      selectedWorkshopTopic: "",
      needTaxInvoice: false,
      taxName: "",
      taxId: "",
      taxAddress: "",
      taxSubDistrict: "",
      taxDistrict: "",
      taxProvince: "",
      taxPostalCode: "",
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getSteps = (): CheckoutStep[] => {
    return Array.from({ length: totalSteps }, (_, i) => ({
      number: i + 1,
      title: getStepTitle(i + 1),
      isComplete: i + 1 < currentStep,
      isCurrent: i + 1 === currentStep,
    }));
  };

  const getStepTitle = (step: number): string => {
    const titles = {
      1: "Personal Info",
      2: "Package",
      3: "Requirements",
      4: "Payment",
    };
    return titles[step as keyof typeof titles] || `Step ${step}`;
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  return {
    currentStep,
    checkoutData,
    isInitialized,
    updateCheckoutData,
    nextStep,
    previousStep,
    goToStep,
    resetCheckout,
    getSteps,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,
  };
}
