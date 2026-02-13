"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  details?: string;
}

interface OrderSummaryProps {
  packageItem: OrderItem;
  addOns: OrderItem[];
  isThai: boolean;
  discount?: number;
  onRemoveAddOn?: (id: string) => void;
  paymentMethod?: "qr" | "card";
}

// Fee config matching backend stripeFee.ts exactly
const FEE_CONFIG = {
  promptpay: { rate: 0.0165, fixedFee: 0, vat: 0.07 },
  thai_card: { rate: 0.0365, fixedFee: 10, vat: 0.07 },
  international_card: { rate: 0.0675, fixedFee: 0.3, vat: 0.07 },
} as const;

function calculateFee(
  netAmount: number,
  isThai: boolean,
  paymentMethod: "qr" | "card",
) {
  let method: keyof typeof FEE_CONFIG;
  if (!isThai) method = "international_card";
  else if (paymentMethod === "qr") method = "promptpay";
  else method = "thai_card";

  const config = FEE_CONFIG[method];
  const vatMultiplier = 1 + config.vat;
  const denominator = 1 - config.rate * vatMultiplier;
  const numerator = netAmount + config.fixedFee * vatMultiplier;
  const total = Math.ceil((numerator / denominator) * 100) / 100;
  const fee = Math.round((total - netAmount) * 100) / 100;
  return { fee, total };
}

export default function OrderSummary({
  packageItem,
  addOns,
  isThai,
  discount = 0,
  onRemoveAddOn,
  paymentMethod = "card",
}: OrderSummaryProps) {
  const t = useTranslations("checkout");
  const currency = isThai ? "฿" : "$";
  const currencyLabel = isThai ? "THB" : "USD";

  const subtotal =
    packageItem.price + addOns.reduce((sum, addon) => sum + addon.price, 0);
  const discountAmount = subtotal * (discount / 100);
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
      {discount > 0 && (
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
            {t("discount")} ({discount}%)
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
