"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  details?: string;
}

interface PromoDiscount {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface OrderSummaryProps {
  packageItem: OrderItem;
  addOns: OrderItem[];
  isThai: boolean;
  discount?: number;
  promoDiscount?: PromoDiscount | null;
  onRemoveAddOn?: (id: string) => void;
  paymentMethod?: "qr" | "card";
}

// Fee config matching backend paySolutionsFee.ts
const FEE_CONFIG = {
  promptpay: { rate: 0.0135, vat: 0.07, minFee: 5 },
  card: { rate: 0.028, vat: 0.07, minFee: 0 },
  usd_card: { rate: 0.03, vat: 0.07, minFee: 0 },
} as const;

type FeeMethod = keyof typeof FEE_CONFIG;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toSatang(value: number): number {
  return Math.round(round2(value) * 100);
}

function calculateNetFromGross(grossSatang: number, method: FeeMethod) {
  const cfg = FEE_CONFIG[method];
  const gross = grossSatang / 100;
  const rawFee = round2(gross * cfg.rate);
  const processingFee = cfg.minFee > 0 ? Math.max(rawFee, cfg.minFee) : rawFee;
  const processingVat = round2(processingFee * cfg.vat);
  const net = round2(gross - processingFee - processingVat);

  return {
    netSatang: toSatang(net),
    total: gross,
    fee: round2(processingFee + processingVat),
  };
}

function calculateFee(
  netAmount: number,
  isThai: boolean,
  paymentMethod: "qr" | "card",
) {
  let method: FeeMethod;
  if (!isThai) method = "usd_card";
  else if (paymentMethod === "qr") method = "promptpay";
  else method = "card";

  const targetNetSatang = toSatang(netAmount);
  if (targetNetSatang <= 0) {
    return { fee: 0, total: 0 };
  }

  const cfg = FEE_CONFIG[method];
  const approxGross = Math.ceil(
    (targetNetSatang / 100) / (1 - cfg.rate * (1 + cfg.vat)) * 100,
  );

  const minGross = Math.max(1, approxGross - 10000);
  const maxGross = approxGross + 10000;

  for (let grossSatang = minGross; grossSatang <= maxGross; grossSatang++) {
    const calc = calculateNetFromGross(grossSatang, method);
    if (calc.netSatang === targetNetSatang) {
      return { fee: calc.fee, total: calc.total };
    }
  }

  for (let grossSatang = approxGross; grossSatang <= maxGross; grossSatang++) {
    const calc = calculateNetFromGross(grossSatang, method);
    if (calc.netSatang >= targetNetSatang) {
      return { fee: calc.fee, total: calc.total };
    }
  }

  const fallback = calculateNetFromGross(maxGross, method);
  return { fee: fallback.fee, total: fallback.total };
}

export default function OrderSummary({
  packageItem,
  addOns,
  isThai,
  discount = 0,
  promoDiscount,
  onRemoveAddOn,
  paymentMethod = "card",
}: OrderSummaryProps) {
  const t = useTranslations("checkout");
  const currency = isThai ? "฿" : "$";
  const currencyLabel = isThai ? "THB" : "USD";

  const subtotal =
    packageItem.price + addOns.reduce((sum, addon) => sum + addon.price, 0);

  // Promo discount takes priority over legacy percentage discount
  let discountAmount: number;
  if (promoDiscount) {
    discountAmount = promoDiscount.discountAmount;
  } else {
    discountAmount = subtotal * (discount / 100);
  }

  const netAmount = subtotal - discountAmount;
  const { fee, total: totalWithFee } =
    netAmount > 0
      ? calculateFee(netAmount, isThai, paymentMethod)
      : { fee: 0, total: 0 };
  const total = totalWithFee;

  return (
    <div
      style={{
        position: "sticky",
        top: "100px",
        padding: "25px",
        border: "2px solid #00C853",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 20px rgba(0, 200, 83, 0.1)",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        <i
          className="fa-solid fa-receipt"
          style={{
            fontSize: "24px",
            color: "#00C853",
          }}
        />
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1a1a2e",
            margin: 0,
          }}
        >
          {t("orderSummary")}
        </h3>
      </div>

      {/* Package */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#1a1a2e",
                marginBottom: "4px",
              }}
            >
              {packageItem.id === "addon-only"
                ? packageItem.name
                : t(`packages.${packageItem.id}`) || packageItem.name}
            </div>
            {packageItem.id !== "addon-only" && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#00C853",
                  fontWeight: "600",
                }}
              >
                <i
                  className="fa-solid fa-badge-check"
                  style={{ marginRight: "4px" }}
                />
                {t("registrationPackage")}
              </div>
            )}
          </div>
          {packageItem.id !== "addon-only" && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a1a2e",
              }}
            >
              {currency}
              {packageItem.price.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#666",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {t("addOnsTitle")}
          </div>
          {addOns.map((addon) => (
            <div
              key={addon.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {t(`addOns.${addon.id}`)}
                </div>
                {addon.details && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "2px",
                      fontStyle: "italic",
                    }}
                  >
                    {addon.details}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                  }}
                >
                  {currency}
                  {addon.price.toLocaleString()}
                </div>
                {onRemoveAddOn && (
                  <button
                    onClick={() => onRemoveAddOn(addon.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "4px",
                    }}
                    title="Remove"
                  >
                    <i className="fa-solid fa-times-circle" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingTop: "16px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <span style={{ fontSize: "14px", color: "#666" }}>{t("subtotal")}</span>
        <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
          {currency}
          {subtotal.toLocaleString()}
        </span>
      </div>

      {/* Discount */}
      {discountAmount > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{ fontSize: "14px", color: "#00C853", fontWeight: "600" }}
          >
            <i className="fa-solid fa-tag" style={{ marginRight: "6px" }} />
            {promoDiscount
              ? `${t("discount")} (${promoDiscount.code}${promoDiscount.discountType === "percentage" ? ` ${promoDiscount.discountValue}%` : ""})`
              : `${t("discount")} (${discount}%)`}
          </span>
          <span
            style={{ fontSize: "15px", fontWeight: "600", color: "#00C853" }}
          >
            -{currency}
            {discountAmount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Processing Fee */}
      {subtotal > 0 && fee > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#666" }}>
            <i
              className="fa-solid fa-credit-card"
              style={{ marginRight: "6px", fontSize: "12px" }}
            />
            Processing Fee
          </span>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
            {currency}
            {fee.toLocaleString()}
          </span>
        </div>
      )}

      {/* Total */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "linear-gradient(135deg, #f0f9f6 0%, #e8f5e9 100%)",
          borderRadius: "12px",
          border: "2px solid #00C853",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {t("totalAmount")}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#00C853",
                lineHeight: 1,
              }}
            >
              {currency}
              {total.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              {currencyLabel}
            </div>
          </div>
          <i
            className="fa-solid fa-circle-check"
            style={{
              fontSize: "40px",
              color: "#00C853",
              opacity: 0.3,
            }}
          />
        </div>
      </div>

      {/* Security Badge */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <i
          className="fa-solid fa-shield-halved"
          style={{
            color: "#00C853",
            marginRight: "6px",
          }}
        />
        {t("securePaymentFooter")}
      </div>
    </div>
  );
}
