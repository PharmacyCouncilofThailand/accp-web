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
import { useTickets } from "@/context/TicketContext";
import type { ResolvedPackage, ResolvedAddOn } from "@/utils/tickets";
import { api } from "@/lib/api";
import type { LinkedSession } from "@/lib/api";

export default function Registration() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { isAuthenticated, user, token } = useAuth();
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
    isLastStep,
  } = useCheckoutWizard();

  const isThai = user?.delegateType?.startsWith("thai") ?? false;

  // Auto-switch QR to card for USD users (QR is THB-only)
  useEffect(() => {
    if (!isThai && checkoutData.paymentMethod === "qr") {
      updateCheckoutData({ paymentMethod: "card" });
    }
  }, [isThai, checkoutData.paymentMethod, updateCheckoutData]);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    tickets,
    packages: registrationPackages,
    addOns,
    loading: ticketsLoading,
  } = useTickets();

  // Addon-only mode: detected from URL ?mode=addon
  const isAddonOnly = searchParams.get("mode") === "addon";
  const [purchasedAddOns, setPurchasedAddOns] = useState<string[]>([]);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<{
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  // Fetch user's existing purchases to know which addons are already bought
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    api.payments
      .myPurchases(token)
      .then((res) => {
        if (res.data) {
          setPurchasedAddOns(res.data.purchasedAddOns);
          // If addon-only mode but user has no primary ticket, redirect back
          if (isAddonOnly && !res.data.hasPrimaryTicket) {
            router.push(`/${locale}/checkout`);
          }
          // Update checkout data with addon-only flag
          if (isAddonOnly) {
            updateCheckoutData({
              isAddonOnly: true,
              purchasedAddOns: res.data.purchasedAddOns,
            });
          } else {
            // Clear stale addon-only flag from previous sessions
            updateCheckoutData({
              isAddonOnly: false,
              purchasedAddOns: res.data.purchasedAddOns,
            });
          }
        }
      })
      .catch(() => {});
  }, [isAuthenticated, token, isAddonOnly]);

  // Derive workshop options dynamically from ticket sessions
  const workshopOptions = useMemo(() => {
    // Find addon tickets with groupName "workshop" that have linked sessions
    const workshopTickets = tickets.filter(
      (t) =>
        t.category === "addon" &&
        (t.groupName || "").toLowerCase() === "workshop" &&
        t.sessions &&
        t.sessions.length > 0,
    );
    // Collect all unique sessions across workshop ticket variants (THB/USD)
    const sessionMap = new Map<number, LinkedSession>();
    for (const t of workshopTickets) {
      for (const s of t.sessions!) {
        if (!sessionMap.has(s.sessionId)) {
          sessionMap.set(s.sessionId, s);
        }
      }
    }
    return Array.from(sessionMap.values()).map((s) => ({
      value: String(s.sessionId),
      label: s.sessionName,
      isFull: s.isFull,
      count: s.enrolledCount,
      maxCapacity: s.maxCapacity,
    }));
  }, [tickets]);

  // Determine if each addon is fully sold out
  const addonFullMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const addon of addOns) {
      if (addon.id === "workshop") {
        // Workshop is full only when ALL sessions are full (or no sessions exist)
        map.workshop =
          workshopOptions.length > 0
            ? workshopOptions.every((o) => o.isFull)
            : false;
      } else if (addon.id === "gala") {
        // Gala: check ticket-level soldCount vs quota
        const galaTickets = tickets.filter(
          (t) =>
            t.category === "addon" &&
            (t.groupName || "").toLowerCase() === "gala",
        );
        // Full if ALL currency variants are sold out
        map.gala =
          galaTickets.length > 0
            ? galaTickets.every((t) => t.quota > 0 && t.soldCount >= t.quota)
            : false;
      }
    }
    return map;
  }, [addOns, workshopOptions, tickets]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    // Pre-fill user data
    updateCheckoutData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      country: user?.country || "",
      selectedPackage: user?.delegateType?.includes("student")
        ? "student"
        : "professional",
    });

    // Fetch phone from profile API (not stored in AuthContext)
    if (token) {
      api.user
        .getProfile(token)
        .then((res) => {
          const profile = res.user as Record<string, unknown>;
          if (profile?.phone) {
            updateCheckoutData({ phone: String(profile.phone) });
          }
        })
        .catch(() => {});
    }

    setIsLoading(false);
  }, [isAuthenticated, user, locale, router, updateCheckoutData, token]);

  const isWorkshopSelected = checkoutData.selectedAddOns.includes("workshop");
  const hasValidWorkshopSelection = workshopOptions.some(
    (option) =>
      !option.isFull &&
      option.value === checkoutData.selectedWorkshopTopic,
  );

  const selectedAddOnCount = checkoutData.selectedAddOns.filter(
    (id) => !purchasedAddOns.includes(id),
  ).length;
  const hasSelectedTickets = isAddonOnly
    ? selectedAddOnCount > 0
    : Boolean(checkoutData.selectedPackage);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!checkoutData.firstName.trim())
      newErrors.firstName = t("validation.firstNameRequired");
    if (!checkoutData.lastName.trim())
      newErrors.lastName = t("validation.lastNameRequired");
    if (!checkoutData.email.trim())
      newErrors.email = t("validation.emailRequired");
    if (!checkoutData.phone.trim())
      newErrors.phone = t("validation.phoneRequired");
    if (!checkoutData.country.trim())
      newErrors.country = t("validation.countryRequired");

    // Workshop validation: must pick a valid session from current options
    if (isWorkshopSelected && !hasValidWorkshopSelection) {
      newErrors.workshop = t("validation.workshopRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim() || !token) return;
    setPromoLoading(true);
    setPromoError(null);

    try {
      const currency = isThai ? "THB" : "USD";
      const res = await api.payments.preview(token, {
        packageId: isAddonOnly ? undefined : checkoutData.selectedPackage,
        addOnIds: checkoutData.selectedAddOns,
        currency: currency as "THB" | "USD",
        promoCode: promoInput.trim(),
        paymentMethod: checkoutData.paymentMethod,
      });

      if (res.data?.promoValid) {
        setPromoDiscount({
          code: promoInput.trim().toUpperCase(),
          discountType: res.data.discountType as "percentage" | "fixed",
          discountValue: res.data.discountValue!,
          discountAmount: res.data.discountAmount,
        });
        setPromoError(null);
      } else {
        setPromoDiscount(null);
        setPromoError(res.data?.promoError || t("promoInvalid"));
      }
    } catch (err: any) {
      setPromoDiscount(null);
      setPromoError(err?.message || t("promoInvalid"));
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoDiscount(null);
    setPromoInput("");
    setPromoError(null);
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
    if (!hasSelectedTickets) return;

    // Hard guard: never navigate to payment when workshop is selected without session
    if (isWorkshopSelected && !hasValidWorkshopSelection) {
      setErrors((prev) => ({
        ...prev,
        workshop: t("validation.workshopRequired"),
      }));
      return;
    }

    if (!validateStep()) return;

    const pkg = registrationPackages.find(
      (p) => p.id === checkoutData.selectedPackage,
    );
    const packagePrice = isAddonOnly
      ? 0
      : isThai
        ? pkg?.priceTHB || 0
        : pkg?.priceUSD || 0;
    const addOnsPrice = addOns
      .filter((a) => checkoutData.selectedAddOns.includes(a.id))
      .reduce((sum, a) => (isThai ? sum + a.priceTHB : sum + a.priceUSD), 0);
    const total = packagePrice + addOnsPrice;

    const params = new URLSearchParams({
      amount: String(total),
      package: isAddonOnly ? "" : checkoutData.selectedPackage,
      method: checkoutData.paymentMethod,
    });
    if (isAddonOnly) params.set("mode", "addon");
    if (promoDiscount) params.set("promoCode", promoDiscount.code);
    router.push(`/${locale}/checkout/payment?${params.toString()}`);
  };

  const currentPackage = registrationPackages.find(
    (p) => p.id === checkoutData.selectedPackage,
  );

  const orderSummary = useMemo(() => {
    return {
      packageItem: isAddonOnly
        ? {
            id: "addon-only",
            name: locale === "th" ? "ซื้อ Add-on เพิ่ม" : "Add-on Purchase",
            price: 0,
          }
        : {
            id: checkoutData.selectedPackage,
            name: t(`packages.${checkoutData.selectedPackage}`),
            price: isThai
              ? currentPackage?.priceTHB || 0
              : currentPackage?.priceUSD || 0,
          },
      addOns: checkoutData.selectedAddOns.map((id) => {
        const addon = addOns.find((a) => a.id === id);
        let details = "";

        if (id === "workshop" && checkoutData.selectedWorkshopTopic) {
          const option = workshopOptions.find(
            (o) => o.value === checkoutData.selectedWorkshopTopic,
          );
          if (option) details = option.label;
        }

        if (id === "gala" && checkoutData.dietaryRequirement) {
          if (
            checkoutData.dietaryRequirement === "other" &&
            checkoutData.dietaryOtherText
          ) {
            details = checkoutData.dietaryOtherText;
          } else {
            details = t(`dietaryOptions.${checkoutData.dietaryRequirement}`);
          }
        }

        return {
          id,
          name: t(`addOns.${id}`),
          price: isThai ? addon?.priceTHB || 0 : addon?.priceUSD || 0,
          details,
        };
      }),
    };
  }, [
    checkoutData.selectedPackage,
    checkoutData.selectedAddOns,
    checkoutData.selectedWorkshopTopic,
    checkoutData.dietaryRequirement,
    checkoutData.dietaryOtherText,
    isThai,
    currentPackage,
    t,
  ]);

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Layout headerStyle={1} footerStyle={1}>
      <div>
        {/* Header */}
        <div
          className="inner-page-header"
          style={{ backgroundImage: "url(/assets/img/bg/header-bg16.png)" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-9 m-auto">
                <div className="heading1 text-center">
                  <h1>{t("pageTitle")}</h1>
                  <div className="space20" />
                  <Link href={`/${locale}`}>
                    {tCommon("home")} <i className="fa-solid fa-angle-right" />{" "}
                    <span>{t("breadcrumb")}</span>
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
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    border: "1px solid #eee",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "20px",
                      color: "#1a1a2e",
                    }}
                  >
                    {t("personalInformation")}
                  </h3>

                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label={t("firstName")}
                        type="text"
                        name="firstName"
                        value={checkoutData.firstName}
                        onChange={(e) =>
                          updateCheckoutData({ firstName: e.target.value })
                        }
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
                        onChange={(e) =>
                          updateCheckoutData({ lastName: e.target.value })
                        }
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
                        onChange={(e) =>
                          updateCheckoutData({ email: e.target.value })
                        }
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
                        onChange={(e) =>
                          updateCheckoutData({ phone: e.target.value })
                        }
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
                    onChange={(e) =>
                      updateCheckoutData({ country: e.target.value })
                    }
                    error={errors.country}
                    icon="fa-solid fa-globe"
                    required
                  />
                </div>

                {/* Section 2: Package (Locked) — hidden in addon-only mode */}
                {isAddonOnly ? (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      padding: "24px",
                      marginBottom: "24px",
                      border: "2px solid #FF9800",
                      boxShadow: "0 4px 15px rgba(255, 152, 0, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          backgroundColor: "#FF9800",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "20px",
                        }}
                      >
                        <i className="fa-solid fa-plus" />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#1a1a2e",
                            marginBottom: "4px",
                          }}
                        >
                          {locale === "th"
                            ? "ซื้อ Add-on เพิ่มเติม"
                            : "Purchase Additional Add-ons"}
                        </h3>
                        <p
                          style={{ fontSize: "13px", color: "#666", margin: 0 }}
                        >
                          {locale === "th"
                            ? "คุณมีตั๋วลงทะเบียนแล้ว เลือก add-on ที่ต้องการด้านล่าง"
                            : "You already have a registration ticket. Select add-ons below."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      padding: "24px",
                      marginBottom: "24px",
                      border: "2px solid #00C853",
                      boxShadow: "0 4px 15px rgba(0, 200, 83, 0.05)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        padding: "6px 12px",
                        backgroundColor: "#00C85315",
                        color: "#00C853",
                        fontSize: "11px",
                        fontWeight: "700",
                        borderBottomLeftRadius: "12px",
                      }}
                    >
                      {t("selected")}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "#00C853",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px",
                          }}
                        >
                          <i className="fa-solid fa-lock" />
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#1a1a2e",
                              marginBottom: "4px",
                            }}
                          >
                            {t(`packages.${checkoutData.selectedPackage}`)}
                          </h3>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#666",
                              margin: 0,
                            }}
                          >
                            {t("packageLocked")}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        {(isThai
                          ? currentPackage?.originalPriceTHB
                          : currentPackage?.originalPriceUSD) && (
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#999",
                              textDecoration: "line-through",
                              marginBottom: "2px",
                            }}
                          >
                            {formatCurrency(
                              isThai
                                ? currentPackage?.originalPriceTHB || 0
                                : currentPackage?.originalPriceUSD || 0,
                              isThai ? "th" : "en",
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#00C853",
                          }}
                        >
                          {formatCurrency(
                            isThai
                              ? currentPackage?.priceTHB || 0
                              : currentPackage?.priceUSD || 0,
                            isThai ? "th" : "en",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Add-ons */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        margin: 0,
                      }}
                    >
                      {t("addOnsTitle")}
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        backgroundColor: "#eee",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {t("optional")}
                    </span>
                  </div>

                  {addOns.map((addon) => {
                    const isFull = addonFullMap[addon.id] || false;
                    const alreadyPurchased = purchasedAddOns.includes(addon.id);
                    const isDisabled = isFull || alreadyPurchased;
                    return (
                      <label
                        key={addon.id}
                        style={{
                          display: "block",
                          padding: "24px",
                          marginBottom: "16px",
                          border: alreadyPurchased
                            ? "2px solid #2196F3"
                            : checkoutData.selectedAddOns.includes(addon.id)
                              ? "2px solid #00C853"
                              : "1px solid #e0e0e0",
                          borderRadius: "16px",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          backgroundColor: alreadyPurchased
                            ? "#e3f2fd"
                            : isFull
                              ? "#f5f5f5"
                              : checkoutData.selectedAddOns.includes(addon.id)
                                ? "#f5fcf8"
                                : "#fff",
                          opacity: isDisabled ? 0.7 : 1,
                          transition: "all 0.3s ease",
                          position: "relative",
                        }}
                      >
                        {alreadyPurchased && (
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "16px",
                              color: "#1976D2",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            <i
                              className="fa-solid fa-circle-check"
                              style={{ marginRight: "4px" }}
                            />
                            {locale === "th" ? "ซื้อแล้ว" : "Purchased"}
                          </div>
                        )}
                        {isFull && !alreadyPurchased && (
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "16px",
                              color: "#d32f2f",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {t("full")}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            width: "100%",
                          }}
                        >
                          <div style={{ paddingTop: "4px" }}>
                            <input
                              type="checkbox"
                              disabled={isDisabled}
                              checked={
                                alreadyPurchased ||
                                checkoutData.selectedAddOns.includes(addon.id)
                              }
                              onChange={(e) => {
                                if (alreadyPurchased) return;
                                const newAddOns = e.target.checked
                                  ? [...checkoutData.selectedAddOns, addon.id]
                                  : checkoutData.selectedAddOns.filter(
                                      (id) => id !== addon.id,
                                    );

                                const updates: Partial<typeof checkoutData> = {
                                  selectedAddOns: newAddOns,
                                };
                                if (
                                  addon.id === "workshop" &&
                                  !e.target.checked
                                )
                                  updates.selectedWorkshopTopic = "";
                                if (addon.id === "gala" && !e.target.checked)
                                  updates.dietaryRequirement = "none";
                                updateCheckoutData(updates);
                              }}
                              style={{
                                width: "20px",
                                height: "20px",
                                accentColor: alreadyPurchased
                                  ? "#2196F3"
                                  : "#00C853",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                              }}
                            />
                          </div>

                          <div style={{ flex: 1, paddingLeft: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "700",
                                  fontSize: "16px",
                                  color: "#1a1a2e",
                                }}
                              >
                                {t(`addOns.${addon.id}`)}
                              </div>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "700",
                                  color: "#00C853",
                                }}
                              >
                                {formatCurrency(
                                  isThai ? addon.priceTHB : addon.priceUSD,
                                  isThai ? "th" : "en",
                                )}
                              </div>
                            </div>

                            {/* Workshop Sub-options */}
                            {addon.id === "workshop" &&
                              checkoutData.selectedAddOns.includes(
                                "workshop",
                              ) && (
                                <div style={{ marginTop: "20px" }}>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fit, minmax(280px, 1fr))",
                                      gap: "12px",
                                      padding: errors.workshop ? '12px' : undefined,
                                      border: errors.workshop ? '2px solid #d32f2f' : undefined,
                                      borderRadius: errors.workshop ? '16px' : undefined,
                                      transition: 'border 0.3s ease',
                                    }}
                                  >
                                    {workshopOptions.map((option) => (
                                      <div
                                        key={option.value}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (!option.isFull) {
                                            updateCheckoutData({
                                              selectedWorkshopTopic:
                                                option.value,
                                            });
                                            setErrors((prev) => {
                                              const { workshop, ...rest } = prev;
                                              return rest;
                                            });
                                          }
                                        }}
                                        style={{
                                          padding: "16px",
                                          cursor: option.isFull
                                            ? "not-allowed"
                                            : "pointer",
                                          backgroundColor: "#fff",
                                          border:
                                            checkoutData.selectedWorkshopTopic ===
                                            option.value
                                              ? "2px solid #00C853"
                                              : errors.workshop
                                                ? "1px solid #d32f2f"
                                                : "1px solid #e0e0e0",
                                          borderRadius: "12px",
                                          transition: "all 0.2s ease",
                                          opacity: option.isFull ? 0.7 : 1,
                                          position: "relative",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "12px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                              borderRadius: "50%",
                                              border:
                                                checkoutData.selectedWorkshopTopic ===
                                                option.value
                                                  ? "6px solid #00C853"
                                                  : "2px solid #ddd",
                                              flexShrink: 0,
                                              marginTop: "2px",
                                            }}
                                          />
                                          <div>
                                            <div
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                color: "#333",
                                                marginBottom: "4px",
                                                lineHeight: 1.4,
                                              }}
                                            >
                                              {option.label}
                                            </div>
                                            <div
                                              style={{
                                                fontSize: "12px",
                                                color: "#666",
                                              }}
                                            >
                                              <i
                                                className="fa-solid fa-user-group"
                                                style={{ marginRight: "6px" }}
                                              />
                                              {`${option.count || 0}/${option.maxCapacity || 0}`}
                                            </div>
                                          </div>
                                        </div>

                                        {option.isFull && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "12px",
                                              right: "12px",
                                              // backgroundColor: '#ffebee',
                                              color: "#d32f2f",
                                              fontSize: "10px",
                                              fontWeight: "700",
                                              // padding: '2px 6px',
                                              // borderRadius: '4px'
                                            }}
                                          >
                                            {t("full")}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {errors.workshop && (
                                    <p
                                      style={{
                                        color: "#d32f2f",
                                        fontSize: "13px",
                                        marginTop: "8px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <i
                                        className="fa-solid fa-circle-exclamation"
                                        style={{ marginRight: "6px" }}
                                      />
                                      {errors.workshop}
                                    </p>
                                  )}
                                </div>
                              )}

                            {/* Gala Dinner - Dietary Requirement */}
                            {addon.id === "gala" &&
                              checkoutData.selectedAddOns.includes("gala") && (
                                <div style={{ marginTop: "16px" }}>
                                  <input
                                    type="text"
                                    placeholder="Dietary Requirement (e.g. Vegetarian, Halal, Allergy)"
                                    value={checkoutData.dietaryOtherText}
                                    onChange={(e) =>
                                      updateCheckoutData({
                                        dietaryRequirement: "other",
                                        dietaryOtherText: e.target.value,
                                      })
                                    }
                                    onClick={(e) => e.preventDefault()}
                                    style={{
                                      width: "100%",
                                      padding: "12px 16px",
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "10px",
                                      fontSize: "14px",
                                      outline: "none",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="col-lg-4">
                <div style={{ position: "sticky", top: "20px" }}>
                  <OrderSummary
                    packageItem={orderSummary.packageItem}
                    addOns={orderSummary.addOns}
                    isThai={isThai}
                    paymentMethod={checkoutData.paymentMethod}
                    promoDiscount={promoDiscount}
                    onRemoveAddOn={(id) => {
                      const newAddOns = checkoutData.selectedAddOns.filter(
                        (addon) => addon !== id,
                      );
                      updateCheckoutData({ selectedAddOns: newAddOns });
                    }}
                  />

                  {/* Promo Code Section */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#1a1a2e",
                        marginBottom: "12px",
                      }}
                    >
                      <i className="fa-solid fa-tag" style={{ marginRight: "8px", color: "#00C853" }} />
                      {t("promoCode")}
                    </h4>

                    {promoDiscount ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          backgroundColor: "#e8f5e9",
                          borderRadius: "8px",
                          border: "1px solid #00C853",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: "700", color: "#00C853", fontSize: "14px" }}>
                            {promoDiscount.code}
                          </span>
                          <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
                            {promoDiscount.discountType === "percentage"
                              ? `${promoDiscount.discountValue}% off`
                              : `${isThai ? "฿" : "$"}${promoDiscount.discountAmount.toLocaleString()} off`}
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d32f2f",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "4px",
                          }}
                          title="Remove"
                        >
                          <i className="fa-solid fa-times-circle" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value.toUpperCase());
                            if (promoError) setPromoError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleApplyPromo();
                          }}
                          placeholder={t("promoPlaceholder")}
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            border: promoError ? "1px solid #d32f2f" : "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            textTransform: "uppercase",
                          }}
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoInput.trim()}
                          style={{
                            padding: "10px 18px",
                            backgroundColor: promoLoading || !promoInput.trim() ? "#ccc" : "#00C853",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: promoLoading || !promoInput.trim() ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {promoLoading ? (
                            <i className="fa-solid fa-spinner fa-spin" />
                          ) : (
                            t("promoApply")
                          )}
                        </button>
                      </div>
                    )}

                    {promoError && (
                      <p style={{ marginTop: "8px", color: "#d32f2f", fontSize: "13px", fontWeight: "500" }}>
                        <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "6px" }} />
                        {promoError}
                      </p>
                    )}
                  </div>

                  {/* Payment Method Section */}
                  <div className="checkout-card" style={{ marginTop: "20px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "16px",
                        color: "#1a1a2e",
                      }}
                    >
                      {t("paymentMethod")}
                    </h3>
                    <div className="checkout-grid-2">
                      {/* QR PromptPay — only available for THB */}
                      {isThai && (
                        <PaymentMethodCard
                          id="qr"
                          title={t("qrPayment")}
                          description={t("qrPaymentDesc")}
                          icon="fa-solid fa-mobile-screen-button"
                          isSelected={checkoutData.paymentMethod === "qr"}
                          onSelect={(id) =>
                            updateCheckoutData({
                              paymentMethod: id as "qr" | "card",
                            })
                          }
                          processingTime={t("instant")}
                        />
                      )}
                      <PaymentMethodCard
                        id="card"
                        title={t("cardPayment")}
                        description={t("cardPaymentDesc")}
                        icon="fa-regular fa-credit-card"
                        isSelected={checkoutData.paymentMethod === "card"}
                        onSelect={(id) =>
                          updateCheckoutData({
                            paymentMethod: id as "qr" | "card",
                          })
                        }
                        processingTime={t("processingTimeCard")}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      variant="primary"
                      onClick={handleCheckout}
                      disabled={!hasSelectedTickets}
                      icon="fa-solid fa-lock"
                      fullWidth={true}
                      style={{ padding: "16px 24px", fontSize: "16px" }}
                    >
                      {t("proceedToPayment")}
                    </Button>
                    {!hasSelectedTickets && (
                      <p
                        style={{
                          marginTop: "10px",
                          color: "#d32f2f",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        <i
                          className="fa-solid fa-circle-exclamation"
                          style={{ marginRight: "6px" }}
                        />
                        {t("validation.ticketRequired")}
                      </p>
                    )}
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
