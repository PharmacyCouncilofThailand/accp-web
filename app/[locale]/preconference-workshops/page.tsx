"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface WorkshopTicket {
  id: number;
  name: string;
  price: string;
  currency: string;
  allowedRoles: string[] | null;
  saleStartDate: string | null;
}

interface Workshop {
  id: string;
  sessionId: number;
  eventId: number;
  title: string;
  description: string | null;
  date: string;
  time: string;
  duration: "fullDay" | "halfDay";
  venue: string;
  capacity: number;
  enrolled: number;
  fee: string; // Deprecated, use tickets logic
  tickets: WorkshopTicket[];
  instructors: { name: string; affiliation?: string }[];
  color: string;
  icon: string;
  isFull: boolean;
  saleStartDate: string | null;
}

export default function PreconferenceWorkshops() {
  const tCommon = useTranslations("common");
  const tProgram = useTranslations("program");
  const t = useTranslations("workshops");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const { user, isAuthenticated } = useAuth();

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setIsLoading(true);
        const response = await api.workshops.list();
        setWorkshops(response.workshops);
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
        setError("Failed to load workshops");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        <div>
          {/* Hero Header */}
          <div
            className="inner-page-header"
            style={{ backgroundImage: "url(/assets/img/bg/header-bg5.png)" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-6 m-auto">
                  <div className="heading1 text-center">
                    <h1>{t("pageTitle")}</h1>
                    <div className="space20" />
                    <Link href={`/${locale}`}>
                      {tCommon("home")}{" "}
                      <i className="fa-solid fa-angle-right" />{" "}
                      <span>{tProgram("pageTitle")}</span>{" "}
                      <i className="fa-solid fa-angle-right" />{" "}
                      <span>{tCommon("workshops")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="service1-section-area sp1">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 m-auto">
                  <div className="heading2 text-center space-margin60">
                    <h5 data-aos="fade-up" data-aos-duration={800}>
                      {t("introTitle")}
                    </h5>
                    <div className="space16" />
                    <h2 className="text-anime-style-3">{t("introSubtitle")}</h2>
                    <div className="space16" />
                    <p data-aos="fade-up" data-aos-duration={1000}>
                      {t("introDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="container" style={{ marginBottom: "40px" }}>
            <div className="row">
              <div className="col-lg-10 m-auto">
                <div
                  className="pricing-boxarea"
                  data-aos="fade-up"
                  data-aos-duration={800}
                  style={{
                    background:
                      "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                    border: "2px solid #F59E0B",
                  }}
                >
                  <p style={{ margin: 0, color: "#92400E" }}>
                    <i
                      className="fa-solid fa-circle-info"
                      style={{ marginRight: "10px", fontSize: "18px" }}
                    />
                    <strong>Note:</strong> {t("note")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshops Grid */}
          <div
            className="service2-section-area sp2"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="container">
              {/* Loading State */}
              {isLoading && (
                <div className="row">
                  <div
                    className="col-12 text-center"
                    style={{ padding: "60px 0" }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "20px", color: "#666" }}>
                      Loading workshops...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="row">
                  <div
                    className="col-12 text-center"
                    style={{ padding: "60px 0" }}
                  >
                    <i
                      className="fa-solid fa-exclamation-circle"
                      style={{
                        fontSize: "48px",
                        color: "#EF4444",
                        marginBottom: "20px",
                      }}
                    />
                    <p style={{ color: "#666" }}>{error}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && workshops.length === 0 && (
                <div className="row">
                  <div
                    className="col-12 text-center"
                    style={{ padding: "60px 0" }}
                  >
                    <i
                      className="fa-solid fa-calendar-xmark"
                      style={{
                        fontSize: "48px",
                        color: "#999",
                        marginBottom: "20px",
                      }}
                    />
                    <h4 style={{ color: "#666" }}>
                      No workshops available yet
                    </h4>
                    <p style={{ color: "#999" }}>
                      Check back later for upcoming workshops.
                    </p>
                  </div>
                </div>
              )}

              {/* Workshops */}
              {!isLoading && !error && workshops.length > 0 && (
                <div className="row">
                  {workshops.map((workshop, index) => {
                    // Calculate duration
                    const durationText =
                      workshop.duration === "fullDay"
                        ? t("fullDay")
                        : t("halfDay");
                    // Calculate hours from time string (e.g., "09:00 - 17:00")
                    const timeMatch = workshop.time.match(
                      /(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/,
                    );
                    let durationHours = "";
                    if (timeMatch) {
                      const startHour = parseInt(timeMatch[1]);
                      const startMin = parseInt(timeMatch[2]);
                      const endHour = parseInt(timeMatch[3]);
                      const endMin = parseInt(timeMatch[4]);
                      const totalMins =
                        endHour * 60 + endMin - (startHour * 60 + startMin);
                      const hours = Math.floor(totalMins / 60);
                      const mins = totalMins % 60;
                      durationHours =
                        hours > 0
                          ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
                          : `${mins}m`;
                    }

                    // Determine Price & Availability based on User Role (Frontend Logic)
                    let selectedTicket: WorkshopTicket | null = null;
                    let guestDisplayFee = "";
                    let guestSaleStart: Date | null = null;
                    const now = new Date();

                    if (workshop.tickets && workshop.tickets.length > 0) {
                      if (isAuthenticated && user) {
                        // LOGGED IN: Specific Role Logic
                        // 1. Filter candidates based on role/currency
                        let candidateTickets = [];
                        if (user.isThai) {
                          candidateTickets = workshop.tickets.filter(
                            (t) => t.currency === "THB",
                          );
                        } else {
                          candidateTickets = workshop.tickets.filter(
                            (t) => t.currency !== "THB",
                          );
                        }
                        // Fallback
                        if (candidateTickets.length === 0)
                          candidateTickets = workshop.tickets;

                        // 2. Separate into Available vs Future
                        const availableCandidates = candidateTickets.filter(
                          (t) => {
                            const start = t.saleStartDate
                              ? new Date(t.saleStartDate)
                              : null;
                            return !start || now >= start;
                          },
                        );

                        if (availableCandidates.length > 0) {
                          availableCandidates.sort(
                            (a, b) => parseFloat(a.price) - parseFloat(b.price),
                          );
                          selectedTicket = availableCandidates[0];
                        } else {
                          candidateTickets.sort((a, b) => {
                            const dateA = a.saleStartDate
                              ? new Date(a.saleStartDate).getTime()
                              : 0;
                            const dateB = b.saleStartDate
                              ? new Date(b.saleStartDate).getTime()
                              : 0;
                            return dateA - dateB;
                          });
                          selectedTicket = candidateTickets[0];
                        }
                      } else {
                        // GUEST: Show Both Types logic
                        // Find best THB option
                        const thbTickets = workshop.tickets.filter(
                          (t) => t.currency === "THB",
                        );
                        const usdTickets = workshop.tickets.filter(
                          (t) => t.currency !== "THB",
                        ); // Assuming non-THB is USD/Intl

                        // Helper to pick best ticket from a list
                        const pickBest = (tickets: WorkshopTicket[]) => {
                          if (tickets.length === 0) return null;
                          const available = tickets.filter((t) => {
                            const start = t.saleStartDate
                              ? new Date(t.saleStartDate)
                              : null;
                            return !start || now >= start;
                          });
                          if (available.length > 0) {
                            available.sort(
                              (a, b) =>
                                parseFloat(a.price) - parseFloat(b.price),
                            );
                            return available[0];
                          }
                          // None available, pick soonest
                          tickets.sort((a, b) => {
                            const dateA = a.saleStartDate
                              ? new Date(a.saleStartDate).getTime()
                              : 0;
                            const dateB = b.saleStartDate
                              ? new Date(b.saleStartDate).getTime()
                              : 0;
                            return dateA - dateB;
                          });
                          return tickets[0];
                        };

                        const bestTHB = pickBest(thbTickets);
                        const bestUSD = pickBest(usdTickets);

                        // Build Display String
                        const parts = [];
                        if (bestTHB)
                          parts.push(
                            `${bestTHB.currency} ${parseFloat(bestTHB.price).toLocaleString()}`,
                          );
                        if (bestUSD)
                          parts.push(
                            `${bestUSD.currency} ${parseFloat(bestUSD.price).toLocaleString()}`,
                          );
                        guestDisplayFee = parts.join(" / ");

                        // Determine Availability (Earliest valid date logic)
                        // If either is available NOW, then it's available.
                        // If both are future, take the EARLIEST future date.

                        const dateTHB = bestTHB?.saleStartDate
                          ? new Date(bestTHB.saleStartDate)
                          : null;
                        const dateUSD = bestUSD?.saleStartDate
                          ? new Date(bestUSD.saleStartDate)
                          : null;

                        const isTHBReady = !dateTHB || now >= dateTHB;
                        const isUSDReady = !dateUSD || now >= dateUSD;

                        if (
                          (bestTHB && isTHBReady) ||
                          (bestUSD && isUSDReady)
                        ) {
                          // At least one is ready -> Available Now
                          guestSaleStart = null; // null implies "now" in our logic usually, or we ensure check passes
                        } else {
                          // Both are future (or one future, one missing). Pick earliest future.
                          const validDates = [dateTHB, dateUSD].filter(
                            (d) => d !== null,
                          ) as Date[];
                          if (validDates.length > 0) {
                            validDates.sort(
                              (a, b) => a.getTime() - b.getTime(),
                            );
                            guestSaleStart = validDates[0];
                          }
                        }
                      }
                    }

                    // Finalize values for Render
                    let finalDisplayFee = workshop.fee || "Free";
                    let finalSaleStart: Date | null = null;

                    if (isAuthenticated && user) {
                      // Authenticated
                      if (selectedTicket) {
                        finalDisplayFee = `${selectedTicket.currency} ${parseFloat(selectedTicket.price).toLocaleString()}`;
                        finalSaleStart = selectedTicket.saleStartDate
                          ? new Date(selectedTicket.saleStartDate)
                          : null;
                      }
                    } else {
                      // Guest
                      if (guestDisplayFee) finalDisplayFee = guestDisplayFee;
                      finalSaleStart = guestSaleStart;
                    }

                    // Fallback to workshop global date if ticket date is missing/undefined but we need a restriction
                    // (Logic: If we have a ticket but no specific date, we check workshop date.
                    // But if we already determined "Available Now" (guestSaleStart = null), we double check workshop date?
                    // No, simpler: if finalSaleStart is null, it means "Now".
                    // BUT if the workshop itself has a future date, we should respect it?
                    // Actually the Workshop global date IS derived from tickets in backend usually, or manually set.
                    // Let's be safe: If finalSaleStart is NULL (meaning ticket is open), check Workshop Date.

                    const workshopDate = workshop.saleStartDate
                      ? new Date(workshop.saleStartDate)
                      : null;
                    const effectiveSaleStart = finalSaleStart || workshopDate;

                    // Re-evaluate availability based on Effective Date
                    const isAvailable = effectiveSaleStart
                      ? now >= effectiveSaleStart
                      : true;
                    const formattedSaleDate = effectiveSaleStart
                      ? effectiveSaleStart.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "";

                    return (
                      <div
                        key={workshop.id}
                        className="col-lg-6"
                        data-aos="fade-up"
                        data-aos-duration={800}
                        data-aos-delay={index * 100}
                      >
                        <div
                          style={{
                            marginBottom: "30px",
                            backgroundColor: "white",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            transition: "all 0.3s ease",
                            position: "relative",
                          }}
                          className="workshop-card"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 12px 40px rgba(0,0,0,0.15)";
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 4px 20px rgba(0,0,0,0.08)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          {workshop.isFull && (
                            <div
                              style={{
                                position: "absolute",
                                top: "20px",
                                right: "-30px",
                                backgroundColor: "#EF4444",
                                color: "white",
                                padding: "5px 40px",
                                transform: "rotate(45deg)",
                                fontSize: "12px",
                                fontWeight: "bold",
                                zIndex: 10,
                              }}
                            >
                              {t("full")}
                            </div>
                          )}

                          {/* Header with gradient */}
                          <div
                            style={{
                              background: `linear-gradient(135deg, ${workshop.color} 0%, ${workshop.color}dd 100%)`,
                              color: "white",
                              padding: "25px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "15px",
                              }}
                            >
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                  borderRadius: "12px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <i
                                  className="fa-solid fa-calendar-days"
                                  style={{ fontSize: "22px" }}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span
                                  style={{
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    padding: "3px 10px",
                                    borderRadius: "10px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {workshop.id}
                                </span>
                                <h5
                                  style={{
                                    color: "white",
                                    margin: "10px 0 0 0",
                                    fontSize: "17px",
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {workshop.title}
                                </h5>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div style={{ padding: "25px" }}>
                            {/* Info Grid */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "15px",
                                marginBottom: "20px",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    margin: "0 0 3px 0",
                                    fontSize: "11px",
                                    color: "#999",
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("date")}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    fontSize: "13px",
                                  }}
                                >
                                  {workshop.date}
                                  <br />
                                  {workshop.time}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    margin: "0 0 3px 0",
                                    fontSize: "11px",
                                    color: "#999",
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("duration")}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    fontSize: "13px",
                                  }}
                                >
                                  {durationHours || durationText}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    margin: "0 0 3px 0",
                                    fontSize: "11px",
                                    color: "#999",
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                  }}
                                >
                                  {tContact("venue")}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    fontSize: "13px",
                                  }}
                                >
                                  {workshop.venue || "TBA"}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    margin: "0 0 3px 0",
                                    fontSize: "11px",
                                    color: "#999",
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("fee")}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color:
                                      workshop.fee === "Free"
                                        ? "#10B981"
                                        : workshop.color,
                                  }}
                                >
                                  {finalDisplayFee}
                                </p>
                              </div>
                            </div>

                            {/* Instructor(s) */}
                            <div style={{ marginBottom: "20px" }}>
                              <p
                                style={{
                                  margin: "0 0 10px 0",
                                  fontSize: "11px",
                                  color: "#999",
                                  textTransform: "uppercase",
                                  fontWeight: 600,
                                }}
                              >
                                <i
                                  className="fa-solid fa-microphone"
                                  style={{ marginRight: "5px" }}
                                />
                                {t("instructor")}
                              </p>
                              {workshop.instructors.length > 0 ? (
                                workshop.instructors.map((instructor, i) => (
                                  <div key={i} style={{ marginBottom: "8px" }}>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {instructor.name}
                                    </p>
                                    {instructor.affiliation && (
                                      <p
                                        style={{
                                          margin: 0,
                                          fontSize: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        {instructor.affiliation}
                                      </p>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#999",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No instructors assigned
                                </p>
                              )}
                            </div>

                            {/* Learning Objectives (Description) */}
                            <div style={{ marginBottom: "20px" }}>
                              <p
                                style={{
                                  margin: "0 0 10px 0",
                                  fontSize: "11px",
                                  color: "#999",
                                  textTransform: "uppercase",
                                  fontWeight: 600,
                                }}
                              >
                                <i
                                  className="fa-solid fa-bullseye"
                                  style={{ marginRight: "5px" }}
                                />
                                {t("learningObjectives")}
                              </p>
                              {workshop.description ? (
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#555",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {workshop.description}
                                </p>
                              ) : (
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#999",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No objectives specified
                                </p>
                              )}
                            </div>

                            {/* Footer - Enrolled + Button */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "15px",
                                borderTop: "1px solid #eee",
                                paddingTop: "20px",
                              }}
                            >
                              <div>
                                <span
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  <i
                                    className="fa-solid fa-users"
                                    style={{ marginRight: "5px" }}
                                  />
                                  {workshop.enrolled}/{workshop.capacity || "∞"}{" "}
                                  {t("enrolled")}
                                </span>
                                {workshop.capacity > 0 && (
                                  <div
                                    style={{
                                      backgroundColor: "#e0e0e0",
                                      height: "6px",
                                      width: "100px",
                                      borderRadius: "3px",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: workshop.isFull
                                          ? "#EF4444"
                                          : workshop.color,
                                        height: "100%",
                                        width: `${Math.min(100, (workshop.enrolled / workshop.capacity) * 100)}%`,
                                        borderRadius: "3px",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              {isAvailable ? (
                                /* <Link
                                                                    href={workshop.isFull ? "#" : "/registration"}
                                                                    style={{
                                                                        backgroundColor: workshop.isFull ? '#ccc' : workshop.color,
                                                                        color: 'white',
                                                                        padding: '10px 20px',
                                                                        borderRadius: '8px',
                                                                        fontSize: '13px',
                                                                        fontWeight: 600,
                                                                        cursor: workshop.isFull ? 'not-allowed' : 'pointer',
                                                                        textDecoration: 'none',
                                                                        display: 'inline-block'
                                                                    }}
                                                                >
                                                                    {workshop.isFull ? t('workshopFull') : t('registerNow')}
                                                                </Link> */
                                <span
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #FFBA00 0%, #FF8C00 100%)",
                                    color: "white",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "default",
                                    display: "inline-block",
                                    boxShadow:
                                      "0 4px 15px rgba(255, 186, 0, 0.4)",
                                  }}
                                >
                                  <i
                                    className="fa-regular fa-calendar"
                                    style={{ marginRight: "6px" }}
                                  ></i>
                                  Available on 18 Feb
                                </span>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#6b7280",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    border: "1px solid #e5e7eb",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  Available on {formattedSaleDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
