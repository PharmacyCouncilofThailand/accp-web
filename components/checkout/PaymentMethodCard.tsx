"use client";
import React from "react";
import Image from "next/image";

interface PaymentMethodCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  processingTime?: string;
  currency?: "THB" | "USD";
}

const PAYMENT_ICONS: Record<
  string,
  { src: string; href: string; maxWidth: number; maxHeight: number }
> = {
  qr: {
    src: "https://s3-payso-images.s3.ap-southeast-1.amazonaws.com/image-logocode/PromptPay-3.png",
    href: "https://www.paysolutions.asia",
    maxWidth: 160,
    maxHeight: 40,
  },
  card: {
    src: "https://s3-payso-images.s3.ap-southeast-1.amazonaws.com/image-logocode/credit-3.png",
    href: "https://www.paysolutions.asia",
    maxWidth: 240,
    maxHeight: 90,
  },
};

// Fee rate labels — rate + VAT 7%, matching paySolutionsFee.ts FEE_CONFIG
const FEE_LABEL: Record<string, string> = {
  qr: "Fee 1%",
  card_thb: "Fee 2.8%",
  card_usd: "Fee 3%",
};

export default function PaymentMethodCard({
  id,
  title,
  description,
  isSelected,
  onSelect,
  currency = "THB",
}: PaymentMethodCardProps) {
  const payIcon = PAYMENT_ICONS[id];
  const feeLabel =
    id === "qr"
      ? FEE_LABEL.qr
      : currency === "USD"
        ? FEE_LABEL.card_usd
        : FEE_LABEL.card_thb;

  return (
    <div
      onClick={() => onSelect(id)}
      role="radio"
      aria-checked={isSelected}
      style={{
        width: "100%",
        padding: "20px 16px 16px",
        border: isSelected ? "2px solid #00C853" : "1px solid #e0e0e0",
        borderRadius: "12px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#f5fcf8" : "#fff",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isSelected
          ? "0 6px 16px -4px rgba(0, 200, 83, 0.15)"
          : "0 2px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#b9e6ca";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 12px -3px rgba(0,0,0,0.07)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#e0e0e0";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow =
            "0 2px 6px -1px rgba(0, 0, 0, 0.05)";
        }
      }}
    >
      {/* Fee badge — top right corner */}
      <span
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 9px",
          borderRadius: "100px",
          backgroundColor: "#fff1f1",
          color: "#c62828",
          fontSize: "11px",
          fontWeight: "600",
          whiteSpace: "nowrap",
        }}
      >
        <i className="fa-solid fa-percent" style={{ fontSize: "9px" }} />
        {feeLabel}
      </span>

      {/* Row 1: Logo */}
      <div style={{ marginBottom: "14px" }}>
        {payIcon ? (
          <div style={{ display: "inline-block" }}>
            <Image
              src={payIcon.src}
              alt={title}
              width={payIcon.maxWidth}
              height={payIcon.maxHeight}
              sizes={`${payIcon.maxWidth}px`}
              style={{
                maxWidth: `${payIcon.maxWidth}px`,
                maxHeight: `${payIcon.maxHeight}px`,
                objectFit: "contain",
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : (
          <i
            className="fa-solid fa-credit-card"
            style={{ fontSize: "40px", color: "#64748b" }}
          />
        )}
      </div>

      {/* Title + Description on same line */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a2e" }}>
          {title}
        </span>
        <span style={{ color: "#cbd5e1", fontSize: "12px" }}>·</span>
        <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.4 }}>
          {description}
        </span>
      </div>
    </div>
  );
}
