"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocale } from "next-intl";

interface StripePaymentFormProps {
  amount: number;
  currency: "THB" | "USD";
  orderId: number;
  orderNumber: string;
  preferredMethod?: "qr" | "card";
  onCancel?: () => void;
  isCancelling?: boolean;
}

export default function StripePaymentForm({
  amount,
  currency,
  orderId,
  orderNumber,
  preferredMethod,
  onCancel,
  isCancelling,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const locale = useLocale();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currencySymbol = currency === "THB" ? "฿" : "$";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/checkout/payment/result?orderId=${orderId}&orderNumber=${orderNumber}`,
      },
    });

    // This point is reached only if there's an immediate error
    // (e.g., card declined before redirect)
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "Payment failed");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={
          {
            layout: "tabs",
            paymentMethodOrder:
              preferredMethod === "qr"
                ? ["promptpay", "card"]
                : ["card", "promptpay"],
          } as any
        }
      />

      {errorMessage && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: "#fff0f0",
            border: "1px solid #ff6b6b",
            borderRadius: "8px",
            color: "#ff6b6b",
            fontSize: "14px",
          }}
        >
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "8px" }}
          />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: "100%",
          padding: "18px",
          background: isProcessing
            ? "#ccc"
            : "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          fontWeight: "600",
          cursor: isProcessing ? "not-allowed" : "pointer",
          marginTop: "25px",
          transition: "opacity 0.3s ease",
        }}
      >
        {isProcessing ? (
          <>
            <i
              className="fa-solid fa-spinner fa-spin"
              style={{ marginRight: "10px" }}
            />
            {locale === "th" ? "กำลังดำเนินการ..." : "Processing..."}
          </>
        ) : (
          <>
            <i className="fa-solid fa-lock" style={{ marginRight: "10px" }} />
            {locale === "th" ? "ชำระเงิน" : "Complete Payment"} —{" "}
            {currencySymbol}
            {amount.toLocaleString()}
          </>
        )}
      </button>

      {onCancel && (
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#ff4444",
              backgroundColor: "transparent",
              border: "none",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isCancelling ? "not-allowed" : "pointer",
              opacity: isCancelling ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <i
              className={
                isCancelling
                  ? "fa-solid fa-spinner fa-spin"
                  : "fa-solid fa-times-circle"
              }
              style={{ marginRight: "8px" }}
            />
            {isCancelling ? "Cancelling..." : "Cancel Payment"}
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
          fontSize: "13px",
          color: "#666",
        }}
      >
        <i
          className="fa-solid fa-shield"
          style={{ color: "#00C853", marginRight: "5px" }}
        />
        {locale === "th"
          ? "การชำระเงินปลอดภัยด้วย Stripe"
          : "Secure payment powered by Stripe"}
      </div>
    </form>
  );
}
