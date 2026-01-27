"use client";
import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import StepIndicator from "@/components/checkout/StepIndicator";
import PackageCard from "@/components/checkout/PackageCard";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import { useCheckoutWizard } from "@/hooks/checkout/useCheckoutWizard";
import FormInput from "@/components/common/FormInput";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/utils/currency";

import {
  registrationPackages,
  addOns,
  workshopOptions,
  type RegistrationPackage,
  type AddOn
} from "@/data/checkout";

export default function Registration() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentStep,
    checkoutData,
    updateCheckoutData,
    nextStep,
    previousStep,
    getSteps,
    isFirstStep,
    isLastStep
  } = useCheckoutWizard();

  const isThai = user?.country?.toLowerCase() === "thailand";
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    } else {
      // Pre-fill user data
      updateCheckoutData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        country: user?.country || "",
        selectedPackage: user?.delegateType?.includes('student') ? 'student' : 'professional'
      });
      setIsLoading(false);
    }
  }, [isAuthenticated, user, locale, router, updateCheckoutData]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!checkoutData.firstName.trim()) newErrors.firstName = t("validation.firstNameRequired");
      if (!checkoutData.lastName.trim()) newErrors.lastName = t("validation.lastNameRequired");
      if (!checkoutData.email.trim()) newErrors.email = t("validation.emailRequired");
      if (!checkoutData.phone.trim()) newErrors.phone = t("validation.phoneRequired");
      if (!checkoutData.country.trim()) newErrors.country = t("validation.countryRequired");

      // Workshop validation
      if (checkoutData.selectedAddOns.includes('workshop') && !checkoutData.selectedWorkshopTopic) {
        newErrors.workshop = t("validation.workshopRequired");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (isLastStep) {
        handleCheckout();
      } else {
        nextStep();
      }
    }
  };

  const handleCheckout = () => {
    const pkg = registrationPackages.find(p => p.id === checkoutData.selectedPackage);
    const packagePrice = isThai ? pkg?.priceTHB || 0 : pkg?.priceUSD || 0;
    const addOnsPrice = addOns
      .filter(a => checkoutData.selectedAddOns.includes(a.id))
      .reduce((sum, a) => (isThai ? sum + a.priceTHB : sum + a.priceUSD), 0);
    const total = packagePrice + addOnsPrice;

    router.push(`/${locale}/checkout/payment?amount=${total}&package=${checkoutData.selectedPackage}&method=${checkoutData.paymentMethod}`);
  };

  const currentPackage = registrationPackages.find(p => p.id === checkoutData.selectedPackage);

  const orderSummary = useMemo(() => {
    return {
      packageItem: {
        id: checkoutData.selectedPackage,
        name: t(`packages.${checkoutData.selectedPackage}`),
        price: isThai ? currentPackage?.priceTHB || 0 : currentPackage?.priceUSD || 0
      },
      addOns: checkoutData.selectedAddOns.map(id => {
        const addon = addOns.find(a => a.id === id);
        let details = '';

        if (id === 'workshop' && checkoutData.selectedWorkshopTopic) {
          const option = workshopOptions.find(o => o.value === checkoutData.selectedWorkshopTopic);
          if (option) details = option.label;
        }

        if (id === 'gala' && checkoutData.dietaryRequirement) {
          if (checkoutData.dietaryRequirement === 'other' && checkoutData.dietaryOtherText) {
            details = checkoutData.dietaryOtherText;
          } else {
            details = t(`dietaryOptions.${checkoutData.dietaryRequirement}`);
          }
        }

        return {
          id,
          name: t(`addOns.${id}`),
          price: isThai ? addon?.priceTHB || 0 : addon?.priceUSD || 0,
          details
        };
      })
    };
  }, [checkoutData.selectedPackage, checkoutData.selectedAddOns, checkoutData.selectedWorkshopTopic, checkoutData.dietaryRequirement, checkoutData.dietaryOtherText, isThai, currentPackage, t]);

  if (!isAuthenticated || isLoading) {
    return null;
  }



  return (
    <Layout headerStyle={1} footerStyle={1}>
      <div>
        {/* Header */}
        <div className="inner-page-header" style={{ backgroundImage: "url(/assets/img/bg/header-bg16.png)" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-9 m-auto">
                <div className="heading1 text-center">
                  <h1>{t("pageTitle")}</h1>
                  <div className="space20" />
                  <Link href={`/${locale}`}>
                    {tCommon("home")} <i className="fa-solid fa-angle-right" /> <span>{t("breadcrumb")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Page Registration */}
        <div className="sp1" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-lg-8">
                {/* Section 1: Personal Information */}
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #eee'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
                    {t("personalInformation")}
                  </h3>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label={t("firstName")}
                        type="text"
                        name="firstName"
                        value={checkoutData.firstName}
                        onChange={(e) => updateCheckoutData({ firstName: e.target.value })}
                        error={errors.firstName}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label={t("lastName")}
                        type="text"
                        name="lastName"
                        value={checkoutData.lastName}
                        onChange={(e) => updateCheckoutData({ lastName: e.target.value })}
                        error={errors.lastName}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label={t("email")}
                        type="email"
                        name="email"
                        value={checkoutData.email}
                        onChange={(e) => updateCheckoutData({ email: e.target.value })}
                        error={errors.email}
                        icon="fa-solid fa-envelope"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label={t("phone")}
                        type="tel"
                        name="phone"
                        value={checkoutData.phone}
                        onChange={(e) => updateCheckoutData({ phone: e.target.value })}
                        error={errors.phone}
                        icon="fa-solid fa-phone"
                        required
                      />
                    </div>
                  </div>

                  <FormInput
                    label={t("country")}
                    type="text"
                    name="country"
                    value={checkoutData.country}
                    onChange={(e) => updateCheckoutData({ country: e.target.value })}
                    error={errors.country}
                    icon="fa-solid fa-globe"
                    required
                  />
                </div>

                {/* Section 2: Package (Locked) */}
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '2px solid #00C853',
                  boxShadow: '0 4px 15px rgba(0, 200, 83, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '6px 12px',
                    backgroundColor: '#00C85315',
                    color: '#00C853',
                    fontSize: '11px',
                    fontWeight: '700',
                    borderBottomLeftRadius: '12px'
                  }}>
                    {t("selected")}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#00C853',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '20px'
                      }}>
                        <i className="fa-solid fa-lock" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>
                          {t(`packages.${checkoutData.selectedPackage}`)}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                          {t("packageLocked")}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      {currentPackage?.originalPriceUSD && (
                        <div style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through', marginBottom: '2px' }}>
                           {formatCurrency(isThai ? (currentPackage.originalPriceTHB || 0) : (currentPackage.originalPriceUSD || 0), locale)}
                        </div>
                      )}
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#00C853' }}>
                        {formatCurrency(isThai ? (currentPackage?.priceTHB || 0) : (currentPackage?.priceUSD || 0), locale)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Add-ons */}
                <div style={{ marginBottom: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                        {t("addOnsTitle")}
                      </h3>
                      <span style={{ fontSize: '13px', color: '#666', backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' }}>{t("optional")}</span>
                   </div>

                  {addOns.map((addon) => (
                    <label
                      key={addon.id}
                      style={{
                        display: "block",
                        padding: "24px",
                        marginBottom: "16px",
                        border: checkoutData.selectedAddOns.includes(addon.id) ? "2px solid #00C853" : "1px solid #e0e0e0",
                        borderRadius: "16px",
                        cursor: "pointer",
                        backgroundColor: checkoutData.selectedAddOns.includes(addon.id) ? "#f5fcf8" : "#fff",
                        transition: "all 0.3s ease",
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                        <div style={{ paddingTop: '4px' }}>
                           <input
                              type="checkbox"
                              checked={checkoutData.selectedAddOns.includes(addon.id)}
                              onChange={(e) => {
                                const newAddOns = e.target.checked
                                  ? [...checkoutData.selectedAddOns, addon.id]
                                  : checkoutData.selectedAddOns.filter(id => id !== addon.id);

                                const updates: Partial<typeof checkoutData> = { selectedAddOns: newAddOns };
                                if (addon.id === 'workshop' && !e.target.checked) updates.selectedWorkshopTopic = '';
                                if (addon.id === 'gala' && !e.target.checked) updates.dietaryRequirement = 'none';
                                updateCheckoutData(updates);
                              }}
                              style={{ width: "20px", height: "20px", accentColor: '#00C853', cursor: 'pointer' }}
                            />
                        </div>
                        
                        <div style={{ flex: 1, paddingLeft: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                             <div style={{ fontWeight: "700", fontSize: "16px", color: '#1a1a2e' }}>{t(`addOns.${addon.id}`)}</div>
                             <div style={{ fontSize: "18px", fontWeight: "700", color: "#00C853" }}>
                                {formatCurrency(isThai ? addon.priceTHB : addon.priceUSD, locale)}
                             </div>
                          </div>
                          
                          {/* Workshop Sub-options */}
                          {addon.id === 'workshop' && checkoutData.selectedAddOns.includes('workshop') && (
                            <div style={{ marginTop: '20px' }}>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                gap: '12px' 
                              }}>
                                {workshopOptions.map(option => (
                                  <div
                                    key={option.value}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if(!option.isFull) updateCheckoutData({ selectedWorkshopTopic: option.value });
                                    }}
                                    style={{
                                      padding: '16px',
                                      cursor: option.isFull ? 'not-allowed' : 'pointer',
                                      backgroundColor: '#fff',
                                      border: checkoutData.selectedWorkshopTopic === option.value ? '2px solid #00C853' : '1px solid #e0e0e0',
                                      borderRadius: '12px',
                                      transition: 'all 0.2s ease',
                                      opacity: option.isFull ? 0.7 : 1,
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                       <div style={{
                                          width: '20px',
                                          height: '20px',
                                          borderRadius: '50%',
                                          border: checkoutData.selectedWorkshopTopic === option.value ? '6px solid #00C853' : '2px solid #ddd',
                                          flexShrink: 0,
                                          marginTop: '2px'
                                       }} />
                                       <div>
                                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px', lineHeight: 1.4 }}>
                                            {option.label}
                                          </div>
                                          <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fa-solid fa-user-group" style={{ marginRight: '6px' }} />
                                            {option.count ? `${option.count}/50` : '0/50'}
                                          </div>
                                       </div>
                                    </div>
                                    
                                    {option.isFull && (
                                      <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        // backgroundColor: '#ffebee',
                                        color: '#d32f2f',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        // padding: '2px 6px',
                                        // borderRadius: '4px'
                                      }}>
                                    {t("full")}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {errors.workshop && (
                                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }} />
                                  {errors.workshop}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Gala Dinner Sub-options */}
                          {addon.id === 'gala' && checkoutData.selectedAddOns.includes('gala') && (
                            <div style={{ marginTop: '20px' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '12px' }}>{t("selectDietary")}</p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {[
                                  { value: 'vegetarian', label: t("dietaryOptions.vegetarian") },
                                  { value: 'vegan', label: t("dietaryOptions.vegan") },
                                  { value: 'halal', label: t("dietaryOptions.halal") },
                                  { value: 'other', label: t("dietaryOptions.other") }
                                ].map(option => (
                                  <div
                                    key={option.value}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateCheckoutData({
                                        dietaryRequirement: option.value,
                                        dietaryOtherText: option.value !== 'other' ? '' : checkoutData.dietaryOtherText
                                      });
                                    }}
                                    style={{
                                      padding: '12px 16px',
                                      cursor: 'pointer',
                                      backgroundColor: '#fff',
                                      border: checkoutData.dietaryRequirement === option.value ? '2px solid #00C853' : '1px solid #e0e0e0',
                                      borderRadius: '10px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px'
                                    }}
                                  >
                                     <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: checkoutData.dietaryRequirement === option.value ? '5px solid #00C853' : '2px solid #ddd',
                                     }} />
                                     <span style={{ fontSize: '14px', color: '#333' }}>{option.label}</span>
                                  </div>
                                ))}
                              </div>

                              {checkoutData.dietaryRequirement === 'other' && (
                                <div style={{ marginTop: '12px' }}>
                                  <input
                                    type="text"
                                    placeholder={t("pleaseSpecify")}
                                    value={checkoutData.dietaryOtherText}
                                    onChange={(e) => updateCheckoutData({ dietaryOtherText: e.target.value })}
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      border: '1px solid #e0e0e0',
                                      borderRadius: '10px',
                                      fontSize: '14px',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

              </div>

              {/* Order Summary Sidebar */}
              <div className="col-lg-4">
                <div style={{ position: 'sticky', top: '20px' }}>
                  <OrderSummary
                    packageItem={orderSummary.packageItem}
                    addOns={orderSummary.addOns}
                    isThai={isThai}
                    onRemoveAddOn={(id) => {
                      const newAddOns = checkoutData.selectedAddOns.filter(addon => addon !== id);
                      updateCheckoutData({ selectedAddOns: newAddOns });
                    }}
                  />

                  {/* Payment Method Section */}
                  <div className="checkout-card" style={{ marginTop: "20px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a2e" }}>
                      {t("paymentMethod")}
                    </h3>
                    <div className="checkout-grid-2">
                      <PaymentMethodCard
                        id="qr"
                        title={t("qrPayment")}
                        description={t("qrPaymentDesc")}
                        icon="fa-solid fa-mobile-screen-button"
                        isSelected={checkoutData.paymentMethod === "qr"}
                        onSelect={(id) => updateCheckoutData({ paymentMethod: id as 'qr' | 'card' })}
                        processingTime={t("instant")}
                      />
                      <PaymentMethodCard
                        id="card"
                        title={t("cardPayment")}
                        description={t("cardPaymentDesc")}
                        icon="fa-regular fa-credit-card"
                        isSelected={checkoutData.paymentMethod === "card"}
                        onSelect={(id) => updateCheckoutData({ paymentMethod: id as 'qr' | 'card' })}
                        processingTime={t("processingTimeCard")}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      variant="primary"
                      onClick={handleCheckout}
                      icon="fa-solid fa-lock"
                      fullWidth={true}
                      style={{ padding: "16px 24px", fontSize: "16px" }}
                    >
                      {t("proceedToPayment")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
