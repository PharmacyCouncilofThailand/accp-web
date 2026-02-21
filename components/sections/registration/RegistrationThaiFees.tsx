"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { TicketType, api } from "@/lib/api";
import { useTicketSelector } from "@/hooks/useTicketSelector";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RegistrationThaiFeesProps {
  tickets?: TicketType[];
}

// Format date for display
function formatAvailableDate(
  dateString: string | null,
  locale: string,
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: locale === "th" ? "short" : "short",
    year: "numeric",
  };
  return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", options);
}

export default function RegistrationThaiFees({
  tickets = [],
}: RegistrationThaiFeesProps) {
  const t = useTranslations("registration");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { user, isAuthenticated, token } = useAuth();

  // Purchase status
  const [hasPrimaryTicket, setHasPrimaryTicket] = useState(false);
  const [purchasedAddOns, setPurchasedAddOns] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    api.payments
      .myPurchases(token)
      .then((res) => {
        if (res.data) {
          setHasPrimaryTicket(res.data.hasPrimaryTicket);
          setPurchasedAddOns(res.data.purchasedAddOns);
        }
      })
      .catch(() => {});
  }, [isAuthenticated, token]);

  // กรอง THB + ใช้ hook เลือกตั๋วที่ดีที่สุด (EB → Regular อัตโนมัติ)
  const thbTickets = tickets.filter((t) => t.currency === "THB");
  const { studentTicket, professionalTicket, addonTickets } =
    useTicketSelector(thbTickets);

  // Determine user type
  const isThaiStudent = user?.delegateType === "thai_student";
  const isThaiPharmacist = user?.delegateType === "thai_pharmacist";

  // หา addon tickets ตามสกุลเงิน THB
  const workshopTicket = addonTickets.find(
    (t) => t.groupName === "workshop" && t.currency === "THB",
  );
  const galaTicket = addonTickets.find(
    (t) => t.groupName === "gala" && t.currency === "THB",
  );

  // Format price with locale
  const formatPrice = (price: string) => {
    return `฿${parseFloat(price).toLocaleString()}`;
  };

  // Format original price (strikethrough)
  const formatOriginalPrice = (price: string | null) => {
    if (!price) return null;
    return `฿${parseFloat(price).toLocaleString()}`;
  };

  // ✅ Handle กรณีไม่มีตั๋วเลย
  if (!studentTicket && !professionalTicket) {
    return (
      <div className="pricing-lan-section-area sp1">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <div className="heading2 text-center space-margin60">
                <h5>{t("thaiDelegates")}</h5>
                <div className="space18" />
                <h2>{t("registrationFees")} (THB)</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <div
                className="p-5 rounded-4"
                style={{
                  background:
                    "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                  border: "2px solid #ddd",
                }}
              >
                <i
                  className="fa-solid fa-ticket mb-3"
                  style={{ fontSize: "48px", color: "#999" }}
                />
                <h3>Registration Closed</h3>
                <p className="mb-0">Please contact us for more information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build pricing options
  const pricingOptions = [
    {
      type: "student",
      show: !isAuthenticated || isThaiStudent,
      title: locale === "th" ? "นักศึกษาไทย" : "Thai Student",
      ticket: studentTicket,
      price: studentTicket ? formatPrice(studentTicket.price) : null,
      originalPrice: studentTicket
        ? formatOriginalPrice(studentTicket.originalPrice)
        : null,
      badge: studentTicket?.badgeText || null,
      features: studentTicket?.features?.length
        ? studentTicket.features
        : [
            t("fullConferenceAccess"),
            t("conferenceMaterials"),
            t("certificateAttendance"),
          ],
      isAvailable: studentTicket?.isAvailable ?? false,
      availableDate: studentTicket?.saleStartDate || null,
    },
    {
      type: "professional",
      show: !isAuthenticated || isThaiPharmacist,
      title: locale === "th" ? "เภสัชกรไทย" : "Thai Professional",
      ticket: professionalTicket,
      price: professionalTicket ? formatPrice(professionalTicket.price) : null,
      originalPrice: professionalTicket
        ? formatOriginalPrice(professionalTicket.originalPrice)
        : null,
      badge: professionalTicket?.badgeText || null,
      features: professionalTicket?.features?.length
        ? professionalTicket.features
        : [
            t("fullConferenceAccess"),
            t("conferenceMaterials"),
            t("certificateAttendance"),
            t("networkingEvents"),
          ],
      highlighted: true,
      isAvailable: professionalTicket?.isAvailable ?? false,
      availableDate: professionalTicket?.saleStartDate || null,
    },
    {
      type: "addons",
      show: true,
      title: t("addons"),
      addons: [
        {
          name: "Workshop",
          price: workshopTicket ? formatPrice(workshopTicket.price) : null,
          features: workshopTicket?.features?.length
            ? workshopTicket.features
            : [
                t("preConferenceWorkshop"),
                `9 ${locale === "th" ? "ก.ค. 2569" : "July 2026"}`,
                t("handsOnTraining"),
              ],
        },
        {
          name: "Gala Dinner",
          price: galaTicket ? formatPrice(galaTicket.price) : null,
          features: galaTicket?.features?.length
            ? galaTicket.features
            : [
                t("networkingDinner"),
                `10 ${locale === "th" ? "ก.ค. 2569" : "July 2026"}`,
                t("entertainment"),
              ],
        },
      ],
    },
  ];

  const filteredOptions = pricingOptions.filter((option) => option.show);

  return (
    <div className="pricing-lan-section-area sp1">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            <div className="heading2 text-center space-margin60">
              <h5>{t("thaiDelegates")}</h5>
              <div className="space18" />
              <h2>{t("registrationFees")} (THB)</h2>
            </div>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {filteredOptions.map((option) => (
            <div
              key={option.type}
              className={`col-lg-${
                filteredOptions.length === 1
                  ? "12"
                  : filteredOptions.length === 2
                    ? "6"
                    : "4"
              } col-md-6`}
            >
              <div
                className="pricing-boxarea h-100 d-flex flex-column"
                style={{
                  ...(option.highlighted
                    ? { border: "2px solid #FFBA00" }
                    : {}),
                }}
              >
                {option.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background:
                        "linear-gradient(135deg, #FFBA00 0%, #FF8C00 100%)",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {option.badge}
                  </div>
                )}
                <h5>{option.title}</h5>
                <div className="space20" />
                {option.price && (
                  <>
                    {option.originalPrice && (
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#999",
                          textDecoration: "line-through",
                          marginBottom: "4px",
                        }}
                      >
                        {option.originalPrice}
                      </div>
                    )}
                    <h2>{option.price}</h2>
                    <div className="space8" />
                  </>
                )}
                <ul>
                  {option.features &&
                    option.features.map((feature, idx) => (
                      <li key={idx}>
                        <img src="/assets/img/icons/check2.svg" alt="" />
                        {feature}
                      </li>
                    ))}
                </ul>
                {option.addons && (
                  <>
                    {option.addons.map((addon, addonIdx) => (
                      <div key={addonIdx}>
                        {addonIdx > 0 && <div className="space20" />}
                        <h3
                          style={{ whiteSpace: "nowrap", fontSize: "1.5rem" }}
                        >
                          {addon.name}: {addon.price || "-"}
                        </h3>
                        <ul>
                          {addon.features.map((feature, idx) => (
                            <li key={idx}>
                              <img src="/assets/img/icons/check2.svg" alt="" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
                {option.type !== "addons" && (
                  <div className="mt-auto">
                    <span
                      style={{
                        color: "#FFBA00",
                        fontSize: "18px",
                        fontWeight: "600",
                        fontStyle: "italic",
                        marginTop: "12px",
                        marginBottom: "0",
                        display: "block",
                      }}
                    >
                      Include 2026 ACCP membership
                    </span>
                    <div className="space28" />
                    <div className="btn-area1">
                      {isAuthenticated && hasPrimaryTicket ? (
                        // ✅ Already registered
                        <span
                          className="vl-btn1"
                          style={{
                            background:
                              "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                            color: "#fff",
                            cursor: "default",
                            boxShadow: "0 4px 15px rgba(33, 150, 243, 0.4)",
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <i
                            className="fa-solid fa-circle-check"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {locale === "th" ? "ลงทะเบียนแล้ว" : "Registered"}
                        </span>
                      ) : option.isAvailable ? (
                        // ✅ Sale started - show Register Now button
                        <Link
                          href={`/${locale}/checkout`}
                          className="vl-btn1"
                          style={{
                            background:
                              "linear-gradient(135deg, #00C853 0%, #00A344 100%)",
                            color: "#fff",
                            boxShadow: "0 4px 15px rgba(0, 200, 83, 0.4)",
                          }}
                        >
                          <i
                            className="fa-solid fa-ticket"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {tCommon("registerNow")}
                        </Link>
                      ) : (
                        // ⏳ Sale not started - show Available on date
                        <span
                          className="vl-btn1"
                          style={{
                            background:
                              "linear-gradient(135deg, #FFBA00 0%, #FF8C00 100%)",
                            color: "#fff",
                            cursor: "default",
                            boxShadow: "0 4px 15px rgba(255, 186, 0, 0.4)",
                          }}
                        >
                          <i
                            className="fa-regular fa-calendar"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {locale === "th"
                            ? `เปิดจำหน่าย ${
                                option.availableDate
                                  ? formatAvailableDate(
                                      option.availableDate,
                                      locale,
                                    )
                                  : "เร็วๆ นี้"
                              }`
                            : `Available on ${
                                option.availableDate
                                  ? formatAvailableDate(
                                      option.availableDate,
                                      locale,
                                    )
                                  : "Coming Soon"
                              }`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {/* Buy Add-ons button on the addons card */}
                {option.type === "addons" &&
                  isAuthenticated &&
                  hasPrimaryTicket &&
                  purchasedAddOns.length < 2 && (
                    <div className="mt-auto">
                      <div className="space28" />
                      <div className="btn-area1">
                        <Link
                          href={`/${locale}/checkout?mode=addon`}
                          className="vl-btn1"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                            color: "#fff",
                            boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <i
                            className="fa-solid fa-plus"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {locale === "th"
                            ? "ซื้อ Add-on เพิ่ม"
                            : "Buy Add-ons"}
                        </Link>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
