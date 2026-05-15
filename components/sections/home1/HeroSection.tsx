"use client";
import { useTranslations, useLocale } from "next-intl";
import Countdown from "@/components/elements/Countdown";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTickets } from "@/context/TicketContext";
import { useTicketSelector } from "@/hooks/useTicketSelector";
import { api } from "@/lib/api";
import { ABSTRACT_SUBMISSION_IS_CLOSED } from "@/lib/abstractSubmissionStatus";
import { useEffect, useState } from "react";

const heroStyles = {
  mainTitle: {
    fontSize: "80px",
    lineHeight: "1.1",
    fontWeight: "700",
    marginBottom: "20px",
  },
  titleWhite: {
    color: "#fff",
  },
  titleGold: {
    background:
      "linear-gradient(135deg, #F5E6D3 0%, #E8D4A0 50%, #D4AF37 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "50px",
    lineHeight: "1.2",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase" as const,
    marginBottom: "40px",
    letterSpacing: "1px",
    marginTop: "0px",
    whiteSpace: "nowrap" as const,
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#fff",
    marginBottom: "0",
  },
} as const;

// Format date for display
function formatAvailableDate(
  dateString: string | null,
  locale: string,
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", options);
}

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, isAuthenticated, token } = useAuth();
  const { tickets } = useTickets();

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

  // Determine currency based on user's nationality
  const isThai = user?.isThai ?? true;
  const currency = isThai ? "THB" : "USD";

  // Filter tickets by user's currency and select best primary ticket
  const filteredTickets = tickets.filter((t) => t.currency === currency);
  const { studentTicket, professionalTicket, addonTickets } =
    useTicketSelector(filteredTickets);

  // Count total add-on groups available (e.g. workshop, gala)
  const addonGroupNames = new Set(
    addonTickets.map((t) => t.groupName || t.name),
  );
  const totalAddonGroups = addonGroupNames.size;

  // Determine which primary ticket to use based on user's delegate type
  const getUserPrimaryTicket = () => {
    if (!isAuthenticated || !user) {
      // Not logged in: use whichever ticket is available (prefer professional)
      return professionalTicket || studentTicket;
    }
    const isStudent =
      user.delegateType === "thai_student" ||
      user.delegateType === "international_student";
    return isStudent ? studentTicket : professionalTicket;
  };

  const primaryTicket = getUserPrimaryTicket();

  // Render the register button based on ticket state
  const renderRegisterButton = () => {
    if (isAuthenticated && hasPrimaryTicket) {
      // Has primary ticket — check if all add-ons are also purchased
      const allAddonsPurchased = purchasedAddOns.length >= totalAddonGroups;

      if (allAddonsPurchased) {
        // ✅ All purchased (primary + all add-ons)
        return (
          <span
            className="vl-btn1"
            style={{
              background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
              color: "#fff",
              cursor: "default",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(33, 150, 243, 0.4)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fa-solid fa-circle-check"
              style={{ marginRight: "8px" }}
            ></i>
            {locale === "th" ? "ลงทะเบียนแล้ว" : "Registered"}
          </span>
        );
      }

      // 🟠 Has primary but still has unpurchased add-ons → Register Now (addon mode)
      return (
        <Link
          href={`/${locale}/checkout?mode=addon`}
          className="vl-btn1"
          style={{
            background: "linear-gradient(135deg, #00C853 0%, #00A344 100%)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0, 200, 83, 0.4)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i className="fa-solid fa-ticket" style={{ marginRight: "8px" }}></i>
          {t("common.registerNow")}
        </Link>
      );
    }

    if (primaryTicket?.isAvailable) {
      // 🟢 Sale started - show Register Now
      return (
        <Link
          href={`/${locale}/checkout`}
          className="vl-btn1"
          style={{
            background: "linear-gradient(135deg, #00C853 0%, #00A344 100%)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0, 200, 83, 0.4)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i className="fa-solid fa-ticket" style={{ marginRight: "8px" }}></i>
          {t("common.registerNow")}
        </Link>
      );
    }

    // 📅 Not available yet - show Available on date
    const dateText = primaryTicket?.saleStartDate
      ? formatAvailableDate(primaryTicket.saleStartDate, locale)
      : locale === "th"
        ? "เร็วๆ นี้"
        : "Coming Soon";

    return (
      <span
        className="vl-btn1"
        style={{
          background: "linear-gradient(135deg, #FFBA00 0%, #FF8C00 100%)",
          color: "#fff",
          cursor: "default",
          fontWeight: "600",
          boxShadow: "0 4px 15px rgba(255, 186, 0, 0.4)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <i
          className="fa-regular fa-calendar"
          style={{ marginRight: "8px" }}
        ></i>
        {locale === "th"
          ? `เปิดจำหน่าย ${dateText}`
          : `Available on ${dateText}`}
      </span>
    );
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                /* Mobile Responsive Fixes */
                @media (max-width: 1399px) {
                    .hero1-section-area {
                        min-height: 100vh; /* Full screen height */
                        padding-top: 100px;
                        display: flex;
                        align-items: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .bg1 {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                    }

                    .header-bg1 {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: 70% center; /* Show Wat Arun more clearly on mobile */
                    }

                    .hero1-header {
                        margin-left: 0 !important;
                        margin-top: 0 !important;
                        text-align: center;
                        padding: 0 15px;
                    }

                    /* Adjust Headline Sizes */
                    .hero1-header h1 {
                        font-size: 48px !important;
                        margin-bottom: 5px !important;
                    }
                    
                    .hero1-header h2 {
                        font-size: 24px !important;
                        margin-bottom: 20px !important;
                    }
                    
                    .hero1-header p {
                        font-size: 16px !important;
                        margin-bottom: 24px !important;
                    }

                    /* Center Buttons */
                    .btn-area1 {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 15px;
                    }

                    /* Timer Responsive Fixes */
                    .timer {
                        position: relative !important;
                        top: 0 !important;
                        right: auto !important;
                        width: 100% !important;
                        display: flex !important;
                        justify-content: center !important;
                        margin-top: 40px !important;
                        flex-wrap: wrap !important;
                        gap: 15px !important;
                    }

                    .timer .time-box {
                        margin: 0 !important;
                    }

                    .timer .space14 {
                        display: none !important;
                    }
                }

                /* Large Screen Scaling (PC 1600px+) */
                @media (min-width: 1600px) {
                    .hero1-header h1 {
                        font-size: 100px !important;
                        margin-bottom: 24px !important;
                    }
                    .hero1-header h2 {
                        font-size: 64px !important;
                        margin-bottom: 32px !important;
                    }
                    .hero1-header p {
                        font-size: 22px !important;
                        line-height: 1.6 !important;
                        max-width: 80%;
                    }
                    .btn-area1 .vl-btn1, 
                    .btn-area1 .vl-btn2 {
                        padding: 18px 36px !important;
                        font-size: 18px !important;
                    }
                }
            `,
        }}
      />
      <div className="hero1-section-area">
        <div className="container">
          <div className="row">
            <div className="col-xxl-6">
              <div className="hero1-header heading1">
                <h5 data-aos="fade-left" data-aos-duration={800}>
                  {t("hero.subtitle")}
                </h5>
                <div className="space16" />
                <h1
                  className="text-anime-style-3"
                  style={{ marginBottom: "0" }}
                >
                  ACCP <span className="gold-text">2026</span>
                </h1>
                <h2 style={heroStyles.subtitle}>{t("hero.location")}</h2>
                <p
                  data-aos="fade-left"
                  data-aos-duration={900}
                  style={heroStyles.description}
                >
                  {t("hero.theme")}
                </p>
                <div className="space32" />
                <div
                  className="btn-area1"
                  data-aos="fade-left"
                  data-aos-duration={1100}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {renderRegisterButton()}
                  {ABSTRACT_SUBMISSION_IS_CLOSED ? (
                    <span
                      className="vl-btn2"
                      aria-disabled="true"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.72,
                        cursor: "not-allowed",
                      }}
                    >
                      <i
                        className="fa-solid fa-ban"
                        style={{ marginRight: "8px" }}
                      />
                      {t("abstractSubmission.closed.button")}
                    </span>
                  ) : (
                    <Link
                      href="/call-for-abstracts"
                      className="vl-btn2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {t("common.submitAbstract")}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="col-xxl-1">
              <Countdown />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
