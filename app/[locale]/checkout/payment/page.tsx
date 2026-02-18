"use client";
import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckoutWizard } from "@/hooks/checkout/useCheckoutWizard";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useTickets } from "@/context/TicketContext";
import type { LinkedSession } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Payment() {
  const t = useTranslations("payment");
  const tCheckout = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use checkout data from hook
  const { checkoutData, resetCheckout, isInitialized } = useCheckoutWizard();

  // Addon-only mode
  const isAddonOnly =
    searchParams.get("mode") === "addon" || checkoutData.isAddonOnly === true;

  // Determine currency based on delegate type (role)
  const isThaiPayment = user?.delegateType?.startsWith("thai") ?? false;
  const currency: "THB" | "USD" = isThaiPayment ? "THB" : "USD";

  // Ticket data from context (cached, single fetch)
  const { tickets, packages: apiPackages, addOns: apiAddOns } = useTickets();

  // Derive workshop options dynamically from ticket sessions
  const workshopOptions = useMemo(() => {
    const workshopTickets = tickets.filter(
      (t) =>
        t.category === "addon" &&
        (t.groupName || "").toLowerCase() === "workshop" &&
        t.sessions &&
        t.sessions.length > 0,
    );
    const sessionMap = new Map<number, LinkedSession>();
    for (const t of workshopTickets) {
      for (const s of t.sessions!) {
        if (!sessionMap.has(s.sessionId)) sessionMap.set(s.sessionId, s);
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

  // Calculate total amount from API data
  const currentPackage = apiPackages.find(
    (p) => p.id === checkoutData.selectedPackage,
  );
  const packagePrice = isAddonOnly
    ? 0
    : isThaiPayment
      ? currentPackage?.priceTHB || 0
      : currentPackage?.priceUSD || 0;
  const addOnsPrice = apiAddOns
    .filter((a) => checkoutData.selectedAddOns.includes(a.id))
    .reduce(
      (sum, a) => (isThaiPayment ? sum + a.priceTHB : sum + a.priceUSD),
      0,
    );
  const totalAmount = packagePrice + addOnsPrice;

  // Prepare OrderSummary props
  const orderPackageItem = isAddonOnly
    ? {
        id: "addon-only",
        name: locale === "th" ? "ซื้อ Add-on เพิ่ม" : "Add-on Purchase",
        price: 0,
      }
    : {
        id: checkoutData.selectedPackage || "professional",
        name: tCheckout(
          `packages.${checkoutData.selectedPackage || "professional"}`,
        ),
        price: packagePrice,
      };

  const orderAddOns = useMemo(() => {
    return checkoutData.selectedAddOns
      .map((addOnId) => {
        const addon = apiAddOns.find((a) => a.id === addOnId);
        if (!addon) return null;

        let details = "";
        if (addOnId === "workshop" && checkoutData.selectedWorkshopTopic) {
          const option = workshopOptions.find(
            (o) => o.value === checkoutData.selectedWorkshopTopic,
          );
          if (option) details = option.label;
        } else if (addOnId === "gala" && checkoutData.dietaryRequirement) {
          if (
            checkoutData.dietaryRequirement === "other" &&
            checkoutData.dietaryOtherText
          ) {
            details = checkoutData.dietaryOtherText;
          } else {
            details = tCheckout(
              `dietaryOptions.${checkoutData.dietaryRequirement}`,
            );
          }
        }

        return {
          id: addOnId,
          name: tCheckout(`addOns.${addOnId}`),
          price: isThaiPayment ? addon.priceTHB : addon.priceUSD,
          details,
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          name: string;
          price: number;
          details: string;
        } => item !== null,
      );
  }, [
    checkoutData.selectedAddOns,
    checkoutData.selectedWorkshopTopic,
    checkoutData.dietaryRequirement,
    checkoutData.dietaryOtherText,
    apiAddOns,
    isThaiPayment,
    tCheckout,
  ]);

  // Payment gateway state
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentRefNo, setPaymentRefNo] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [intentError, setIntentError] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [chargeTotal, setChargeTotal] = useState<number>(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<{
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  // Refresh detection and warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (paymentUrl && orderId) {
        e.preventDefault();
        e.returnValue = '';
        setShowRefreshModal(true);
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [paymentUrl, orderId]);

  // Confirm refresh with cancellation
  const confirmRefresh = async () => {
    if (!orderId || !token) return;

    setShowRefreshModal(false);
    setIsRefreshing(true);
    
    try {
      // Cancel the payment intent
      await fetch(`${API_URL}/api/payments/cancel-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      // Reset checkout and redirect
      resetCheckout();
      router.push(`/${locale}/registration`);
    } catch (err) {
      console.error("Failed to cancel on refresh:", err);
      // Still redirect even if cancellation fails
      router.push(`/${locale}/registration`);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Cancel refresh action (stay on page)
  const cancelRefresh = () => {
    setShowRefreshModal(false);
  };
  const confirmCancelPayment = async () => {
    if (!orderId || !token) return;

    setShowCancelModal(false);
    setIsCancelling(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/cancel-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payment cancelled successfully");
        resetCheckout();
        router.push(`/${locale}/registration`);
      } else {
        toast.error(data.error || "Failed to cancel payment");
      }
    } catch (err) {
      console.error("Cancel payment failed:", err);
      toast.error("Failed to cancel payment");
    } finally {
      setIsCancelling(false);
    }
  };

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, router, locale]);

  // Create PaymentIntent on mount
  useEffect(() => {
    if (!isInitialized || !token || paymentUrl) return;
    // For full mode, need selectedPackage; for addon-only, need at least one addon
    if (!isAddonOnly && !checkoutData.selectedPackage) return;
    if (isAddonOnly && checkoutData.selectedAddOns.length === 0) return;

    const createIntent = async () => {
      setIsCreatingIntent(true);
      setIntentError(null);

      try {
        const res = await fetch(`${API_URL}/api/payments/create-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packageId: isAddonOnly ? "" : checkoutData.selectedPackage,
            addOnIds: checkoutData.selectedAddOns,
            currency,
            paymentMethod: checkoutData.paymentMethod,
            promoCode: searchParams.get("promoCode") || undefined,
            workshopSessionId: checkoutData.selectedWorkshopTopic
              ? parseInt(checkoutData.selectedWorkshopTopic)
              : undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setIntentError(data.error || "Failed to initialize payment");
          return;
        }

        setPaymentUrl(data.data.paymentUrl);
        setPaymentRefNo(data.data.refno || null);
        setOrderId(data.data.orderId);
        setOrderNumber(data.data.orderNumber);
        setFeeAmount(data.data.fee || 0);
        setChargeTotal(data.data.total || totalAmount);

        // Set promo discount info if present
        if (data.data.discountAmount > 0 && data.data.discountType) {
          const promoCodeParam = searchParams.get("promoCode") || "";
          setPromoDiscount({
            code: promoCodeParam,
            discountType: data.data.discountType as "percentage" | "fixed",
            discountValue: data.data.discountValue || 0,
            discountAmount: data.data.discountAmount,
          });
        }

        if (data.data.paymentUrl) {
          setIsRedirecting(true);
          window.location.assign(data.data.paymentUrl);
        }
      } catch (err) {
        console.error("Failed to create payment intent:", err);
        setIntentError("Failed to connect to payment server");
        setIsRedirecting(false);
      } finally {
        setIsCreatingIntent(false);
      }
    };

    createIntent();
  }, [
    isInitialized,
    token,
    checkoutData.selectedPackage,
    checkoutData.selectedAddOns,
    currency,
    paymentUrl,
    isAddonOnly,
    locale,
  ]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
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
                    {tCheckout("breadcrumb")} <i className="fa-solid fa-angle-right" />{" "}
                    <span>{t("breadcrumb")}</span>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="sp1">
            <div className="container">
              <div className="row">
                {/* Left Column - Payment Gateway */}
                <div className="col-lg-8">
                  {/* Loading state */}
                  {isCreatingIntent && (
                    <div
                      style={{
                        padding: "60px 30px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        textAlign: "center",
                      }}
                    >
                      <i
                        className="fa-solid fa-spinner fa-spin"
                        style={{
                          fontSize: "40px",
                          color: "#00C853",
                          marginBottom: "20px",
                          display: "block",
                        }}
                      />
                      <p style={{ color: "#666", fontSize: "16px" }}>
                        {locale === "th"
                          ? "กำลังเตรียมระบบชำระเงิน..."
                          : "Preparing payment..."}
                      </p>
                    </div>
                  )}

                  {/* Error state */}
                  {intentError && (
                    <div
                      style={{
                        padding: "30px",
                        border: "2px solid #ff6b6b",
                        borderRadius: "12px",
                        backgroundColor: "#fff0f0",
                        textAlign: "center",
                      }}
                    >
                      <i
                        className="fa-solid fa-circle-exclamation"
                        style={{
                          fontSize: "40px",
                          color: "#ff6b6b",
                          marginBottom: "15px",
                          display: "block",
                        }}
                      />
                      <p
                        style={{
                          color: "#ff6b6b",
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "10px",
                        }}
                      >
                        {intentError}
                      </p>
                      <button
                        onClick={() => {
                          setPaymentUrl(null);
                          setPaymentRefNo(null);
                          setIntentError(null);
                        }}
                        style={{
                          padding: "10px 25px",
                          backgroundColor: "#00C853",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {locale === "th" ? "ลองอีกครั้ง" : "Try Again"}
                      </button>
                    </div>
                  )}

                  {/* Pay Solutions Redirect Panel */}
                  {paymentUrl && orderId && (
                    <div
                      style={{
                        padding: "30px",
                        border: "2px solid #00C853",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: "25px",
                          fontSize: "18px",
                          fontWeight: "600",
                        }}
                      >
                        {locale === "th" ? "กำลังไปยังหน้าชำระเงิน" : "Redirecting to Payment"}
                      </h4>

                      {paymentRefNo && (
                        <p style={{ marginBottom: "16px", fontSize: "13px", color: "#666" }}>
                          {locale === "th" ? "รหัสอ้างอิง" : "Reference No."}: <strong>{paymentRefNo}</strong>
                        </p>
                      )}

                      {/* Fee Breakdown */}
                      {feeAmount > 0 && (
                        <div
                          style={{
                            padding: "16px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            fontSize: "14px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                              color: "#333",
                            }}
                          >
                            <span>
                              {locale === "th" ? "ราคาสินค้า" : "Subtotal"}
                            </span>
                            <span>
                              {isThaiPayment ? "฿" : "$"}
                              {totalAmount.toLocaleString()}
                              {!isThaiPayment ? " USD" : ""}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                              color: "#666",
                            }}
                          >
                            <span>
                              {locale === "th"
                                ? "ค่าธรรมเนียมชำระเงิน"
                                : "Payment Processing Fee"}
                            </span>
                            <span>
                              {isThaiPayment ? "฿" : "$"}
                              {feeAmount.toLocaleString()}
                              {!isThaiPayment ? " USD" : ""}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              paddingTop: "8px",
                              borderTop: "1px solid #ddd",
                              fontWeight: "700",
                              color: "#1a1a2e",
                            }}
                          >
                            <span>
                              {locale === "th" ? "ยอดชำระทั้งหมด" : "Total"}
                            </span>
                            <span style={{ color: "#00C853" }}>
                              {isThaiPayment ? "฿" : "$"}
                              {chargeTotal.toLocaleString()}
                              {!isThaiPayment ? " USD" : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      <div style={{ display: "grid", gap: "10px" }}>
                        <button
                          onClick={() => {
                            setIsRedirecting(true);
                            window.location.assign(paymentUrl);
                          }}
                          disabled={isRedirecting}
                          style={{
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: isRedirecting ? "not-allowed" : "pointer",
                            opacity: isRedirecting ? 0.8 : 1,
                          }}
                        >
                          {isRedirecting
                            ? locale === "th"
                              ? "กำลังเปิดหน้าชำระเงิน..."
                              : "Opening payment page..."
                            : locale === "th"
                              ? "ไปยังหน้าชำระเงิน"
                              : "Continue to Payment"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowCancelModal(true)}
                          disabled={isCancelling}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "1px solid #ff6b6b",
                            backgroundColor: "#fff",
                            color: "#ff6b6b",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: isCancelling ? "not-allowed" : "pointer",
                          }}
                        >
                          {locale === "th" ? "ยกเลิกรายการชำระเงิน" : "Cancel Payment"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Order Summary */}
                <div className="col-lg-4">
                  <OrderSummary
                    packageItem={orderPackageItem}
                    addOns={orderAddOns}
                    isThai={isThaiPayment}
                    paymentMethod={checkoutData.paymentMethod}
                    promoDiscount={promoDiscount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Refresh Warning Modal */}
      {showRefreshModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              animation: "fadeInScale 0.2s ease-out",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#fff3cd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <i
                className="fa-solid fa-arrows-rotate"
                style={{ fontSize: "28px", color: "#856404" }}
              />
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1a1a2e",
                marginBottom: "12px",
              }}
            >
              {locale === "th" ? "เตือนการรีเฟรชหน้า" : "Refresh Warning"}
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              {locale === "th"
                ? "การรีเฟรชหน้านี้จะทำให้การชำระเงินถูกยกเลิก คุณต้องการดำเนินการต่อหรือไม่?"
                : "Refreshing this page will cancel your payment. Do you want to continue?"}
            </p>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={cancelRefresh}
                disabled={isRefreshing}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  color: "#666",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isRefreshing ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshing) e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  if (!isRefreshing) e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                {locale === "th" ? "อยู่บนหน้านี้ต่อ" : "Stay on Page"}
              </button>
              <button
                onClick={confirmRefresh}
                disabled={isRefreshing}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#ff9800",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isRefreshing ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshing) e.currentTarget.style.backgroundColor = "#e68900";
                }}
                onMouseLeave={(e) => {
                  if (!isRefreshing) e.currentTarget.style.backgroundColor = "#ff9800";
                }}
              >
                {isRefreshing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    {locale === "th" ? "กำลังยกเลิก..." : "Cancelling..."}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrows-rotate" />
                    {locale === "th" ? "รีเฟรชและยกเลิก" : "Refresh & Cancel"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Payment Confirmation Modal */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              animation: "fadeInScale 0.2s ease-out",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#fff0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ fontSize: "28px", color: "#ff4444" }}
              />
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1a1a2e",
                marginBottom: "12px",
              }}
            >
              Cancel Payment
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              Are you sure you want to cancel this payment? Your current
              transaction will be voided and you will be redirected to the
              registration page.
            </p>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  color: "#666",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                Go Back
              </button>
              <button
                onClick={confirmCancelPayment}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#ff4444",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e03333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff4444";
                }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
