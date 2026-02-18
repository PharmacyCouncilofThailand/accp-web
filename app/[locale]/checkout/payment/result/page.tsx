"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCheckoutWizard } from "@/hooks/checkout/useCheckoutWizard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type PaymentStatus = "loading" | "success" | "failed" | "processing";

interface OrderItem {
  type: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
}

interface PaymentData {
  orderNumber?: string;
  orderStatus?: string;
  currency?: string;
  payment?: {
    status: string;
    amount: string;
    paidAt: string | null;
    stripeReceiptUrl: string | null;
    paymentChannel: string | null;
  } | null;
  receiptDownloadUrl?: string | null;
  items?: OrderItem[];
  subtotal?: string;
  fee?: string;
}

export default function PaymentResult() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { resetCheckout } = useCheckoutWizard();

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // Capture search params once to prevent re-render issues
  const paramsRef = useRef({
    orderNumber: searchParams.get("orderNumber") || "",
    redirectStatus: searchParams.get("redirect_status"),
    refNo: searchParams.get("refno"),
    paymentIntentId: searchParams.get("payment_intent"),
  });
  const verifyStarted = useRef(false);

  const orderNumber = paramsRef.current.orderNumber;

  useEffect(() => {
    // Update refs if searchParams become available after initial render
    const refNoParam = searchParams.get("refno");
    const piId = searchParams.get("payment_intent");
    const rs = searchParams.get("redirect_status");
    const on = searchParams.get("orderNumber");
    if ((refNoParam && !paramsRef.current.refNo) || (piId && !paramsRef.current.paymentIntentId)) {
      paramsRef.current = {
        refNo: refNoParam || paramsRef.current.refNo,
        paymentIntentId: piId || paramsRef.current.paymentIntentId,
        redirectStatus: rs,
        orderNumber: on || "",
      };
    }

    if (verifyStarted.current) return;
    if (!token) return; // Still loading auth — don't set failed yet

    const { refNo, paymentIntentId, redirectStatus } = paramsRef.current;

    if (redirectStatus === "failed") {
      setStatus("failed");
      return;
    }

    const verifyKey = refNo || paymentIntentId;
    if (!verifyKey) {
      setStatus("failed");
      return;
    }

    verifyStarted.current = true;
    verifyPayment(verifyKey, token, !!refNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchParams]);

  const verifyPayment = async (verifyKey: string, authToken: string, isRefNo: boolean) => {
    const verifyQuery = isRefNo
      ? `refno=${encodeURIComponent(verifyKey)}`
      : `payment_intent=${encodeURIComponent(verifyKey)}`;

    // Poll up to 10 times (30 seconds total)
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch(
          `${API_URL}/api/payments/verify?${verifyQuery}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await res.json();

        if (data.success && data.data) {
          setPaymentData(data.data);

          if (data.data.payment?.status === "paid" || data.data.orderStatus === "paid") {
            setStatus("success");
            resetCheckout();
            return;
          } else if (data.data.payment?.status === "failed") {
            setStatus("failed");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to verify payment:", err);
      }

      // Wait 3 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // If still processing after 30 seconds
    setStatus("processing");
  };

  const currencyCode = paymentData?.currency || "THB";
  const currencySymbol = currencyCode === "USD" ? "$" : "฿";

  const paymentChannelText = (() => {
    const channel = (paymentData?.payment?.paymentChannel || "").toLowerCase();
    if (channel === "promptpay") return "PromptPay (QR)";
    if (channel === "amex") return "American Express";
    return "Credit / Debit Card";
  })();

  const sortedItems = [...(paymentData?.items || [])].sort((a, b) => {
    const aRank = a.type === "ticket" ? 0 : 1;
    const bRank = b.type === "ticket" ? 0 : 1;
    return aRank - bRank;
  });

  return (
    <Layout headerStyle={1} footerStyle={1}>
      <div
        className="inner-page-header"
        style={{
          backgroundImage: "url(/assets/img/bg/header-bg16.png)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-9 m-auto">
              <div className="heading1 text-center">
                <h1>
                  {status === "success"
                    ? locale === "th" ? "ชำระเงินสำเร็จ" : "Payment Successful"
                    : status === "failed"
                    ? locale === "th" ? "การชำระเงินล้มเหลว" : "Payment Failed"
                    : locale === "th" ? "ตรวจสอบการชำระเงิน" : "Verifying Payment"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sp1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div
                style={{
                  padding: "40px",
                  border: `2px solid ${status === "success" ? "#00C853" : status === "failed" ? "#ff6b6b" : "#e0e0e0"}`,
                  borderRadius: "15px",
                  backgroundColor: status === "success" ? "#f0f9f6" : status === "failed" ? "#fff5f5" : "#fff",
                  textAlign: "center",
                }}
              >
                {/* Loading */}
                {status === "loading" && (
                  <>
                    <i
                      className="fa-solid fa-spinner fa-spin"
                      style={{ fontSize: "60px", color: "#00C853", display: "block", marginBottom: "20px" }}
                    />
                    <h2 style={{ marginBottom: "10px" }}>
                      {locale === "th" ? "กำลังตรวจสอบการชำระเงิน..." : "Verifying payment..."}
                    </h2>
                    <p style={{ color: "#666" }}>
                      {locale === "th" ? "กรุณาอย่าปิดหน้านี้" : "Please do not close this page"}
                    </p>
                  </>
                )}

                {/* Success */}
                {status === "success" && (
                  <>
                    <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
                    <h2 style={{ color: "#00C853", marginBottom: "20px" }}>
                      {locale === "th" ? "ชำระเงินสำเร็จ!" : "Payment Successful!"}
                    </h2>
                    <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
                      {locale === "th"
                        ? "ขอบคุณสำหรับการลงทะเบียน คุณจะได้รับอีเมลยืนยันเร็วๆ นี้"
                        : "Thank you for your registration. You will receive a confirmation email shortly."}
                    </p>

                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "24px",
                        borderRadius: "10px",
                        marginBottom: "30px",
                        textAlign: "left",
                      }}
                    >
                      {/* Order Info */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontWeight: "600", color: "#333" }}>
                          {locale === "th" ? "หมายเลขคำสั่งซื้อ" : "Order Number"}
                        </span>
                        <span style={{ color: "#00C853", fontFamily: "monospace", fontWeight: "600" }}>
                          {paymentData?.orderNumber || orderNumber}
                        </span>
                      </div>
                      {paymentData?.payment?.paidAt && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                          <span style={{ fontWeight: "600", color: "#333" }}>
                            {locale === "th" ? "วันที่ชำระเงิน" : "Payment Date"}
                          </span>
                          <span>{new Date(paymentData.payment.paidAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      )}
                      {paymentData?.payment?.paymentChannel && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                          <span style={{ fontWeight: "600", color: "#333" }}>
                            {locale === "th" ? "ช่องทางชำระเงิน" : "Payment Method"}
                          </span>
                          <span>{paymentChannelText}</span>
                        </div>
                      )}

                      {/* Itemized Breakdown */}
                      {sortedItems.length > 0 && (
                        <>
                          <div style={{ borderTop: "1px solid #e0e0e0", margin: "16px 0", paddingTop: "16px" }}>
                            <p style={{ fontWeight: "700", fontSize: "14px", color: "#333", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {locale === "th" ? "รายละเอียด" : "Items"}
                            </p>
                            {sortedItems.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                                <span style={{ color: "#555" }}>
                                  {item.name}
                                  <span style={{ display: "inline-block", marginLeft: "8px", fontSize: "11px", color: "#999", backgroundColor: "#f5f5f5", padding: "1px 6px", borderRadius: "4px" }}>
                                    {item.type === "ticket" ? (locale === "th" ? "ตั๋ว" : "Ticket") : (locale === "th" ? "เสริม" : "Add-on")}
                                  </span>
                                </span>
                                <span style={{ fontWeight: "500", color: "#333", whiteSpace: "nowrap", marginLeft: "12px" }}>
                                  {currencySymbol}{Number(item.price).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "12px" }}>
                            {/* Subtotal */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
                              <span>{locale === "th" ? "ราคารวม" : "Subtotal"}</span>
                              <span>{currencySymbol}{Number(paymentData?.subtotal ?? 0).toLocaleString()}</span>
                            </div>
                            {/* Fee */}
                            {Number(paymentData?.fee ?? 0) > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
                                <span>{locale === "th" ? "ค่าธรรมเนียมชำระเงิน" : "Payment Processing Fee"}</span>
                                <span>{currencySymbol}{Number(paymentData?.fee ?? 0).toLocaleString()}</span>
                              </div>
                            )}
                            {/* Total */}
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "2px solid #00C853", marginTop: "8px" }}>
                              <span style={{ fontWeight: "700", fontSize: "16px", color: "#333" }}>
                                {locale === "th" ? "ยอดชำระทั้งหมด" : "Total Paid"}
                              </span>
                              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#00C853" }}>
                                {currencySymbol}{Number(paymentData?.payment?.amount ?? 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Fallback: no items (old orders) */}
                      {sortedItems.length === 0 && paymentData?.payment?.amount && (
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e0e0e0", paddingTop: "12px", marginTop: "12px" }}>
                          <span style={{ fontWeight: "700", color: "#333" }}>
                            {locale === "th" ? "ยอดชำระทั้งหมด" : "Total Paid"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#00C853" }}>
                            {currencySymbol}{Number(paymentData.payment.amount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {paymentData?.receiptDownloadUrl && (
                      <div style={{ marginBottom: "20px" }}>
                        <a
                          href={`${paymentData.receiptDownloadUrl}${paymentData.receiptDownloadUrl.includes("?") ? "&" : "?"}v=${Date.now()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#00C853",
                            textDecoration: "underline",
                            fontSize: "14px",
                          }}
                        >
                          <i className="fa-solid fa-file-pdf" style={{ marginRight: "6px" }} />
                          {locale === "th" ? "ดาวน์โหลดใบเสร็จ (PDF)" : "Download Receipt (PDF)"}
                        </a>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                      <div
                        onClick={() => router.push(`/${locale}/my-tickets`)}
                        style={{
                          padding: "12px 30px",
                          background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
                          color: "#fff",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        {locale === "th" ? "ดูตั๋วของฉัน" : "View My Tickets"}
                      </div>
                      <Link
                        href={`/${locale}`}
                        style={{
                          padding: "12px 30px",
                          border: "2px solid #00C853",
                          color: "#00C853",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontWeight: "600",
                          backgroundColor: "#fff",
                        }}
                      >
                        {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
                      </Link>
                    </div>
                  </>
                )}

                {/* Failed */}
                {status === "failed" && (
                  <>
                    <div style={{ fontSize: "80px", marginBottom: "20px" }}>❌</div>
                    <h2 style={{ color: "#ff6b6b", marginBottom: "20px" }}>
                      {locale === "th" ? "การชำระเงินล้มเหลว" : "Payment Failed"}
                    </h2>
                    <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
                      {locale === "th"
                        ? "ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองอีกครั้ง"
                        : "We were unable to process your payment. Please try again."}
                    </p>
                    <Link
                      href={`/${locale}/checkout`}
                      style={{
                        padding: "12px 30px",
                        background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
                        color: "#fff",
                        borderRadius: "8px",
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                    >
                      {locale === "th" ? "ลองอีกครั้ง" : "Try Again"}
                    </Link>
                  </>
                )}

                {/* Processing (webhook pending) */}
                {status === "processing" && (
                  <>
                    <div style={{ fontSize: "80px", marginBottom: "20px" }}>⏳</div>
                    <h2 style={{ color: "#ffa000", marginBottom: "20px" }}>
                      {locale === "th" ? "กำลังดำเนินการ" : "Payment Processing"}
                    </h2>
                    <p style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
                      {locale === "th"
                        ? "การชำระเงินกำลังได้รับการยืนยัน อาจใช้เวลาสักครู่ คุณจะได้รับอีเมลยืนยันเมื่อเสร็จสิ้น"
                        : "Your payment is being confirmed. This may take a moment. You will receive a confirmation email when complete."}
                    </p>
                    {orderNumber && (
                      <p style={{ fontSize: "14px", color: "#999" }}>
                        {locale === "th" ? "หมายเลขคำสั่งซื้อ" : "Order"}: <strong>{orderNumber}</strong>
                      </p>
                    )}
                    <Link
                      href={`/${locale}`}
                      style={{
                        display: "inline-block",
                        marginTop: "20px",
                        padding: "12px 30px",
                        border: "2px solid #ffa000",
                        color: "#ffa000",
                        borderRadius: "8px",
                        fontWeight: "600",
                        textDecoration: "none",
                        backgroundColor: "#fff",
                      }}
                    >
                      {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
