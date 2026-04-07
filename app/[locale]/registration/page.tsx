"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { api, TicketType } from "@/lib/api";
import { useEffect, useState } from "react";
import RegistrationImportantDates from "@/components/sections/registration/RegistrationImportantDates";
import RegistrationInternationalFees from "@/components/sections/registration/RegistrationInternationalFees";
import RegistrationThaiFees from "@/components/sections/registration/RegistrationThaiFees";
import toast from "react-hot-toast";

export default function Registration() {
  const t = useTranslations("registration");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.tickets.list();
        setTickets(response.tickets);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // Determine which pricing to show based on user role
  const isThai = user?.isThai === true;
  const isStudent =
    user?.delegateType === "thai_student" ||
    user?.delegateType === "international_student";

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
                      {tCommon("home")}{" "}
                      <i className="fa-solid fa-angle-right" />{" "}
                      <span>{t("pageTitle")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RegistrationImportantDates />

          {/* Download Documents Section */}
          <section style={{ padding: "60px 0", backgroundColor: "#f8f9fa" }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 m-auto text-center">
                  <h3 style={{ marginBottom: "10px", fontWeight: 700 }}>
                    {locale === "th"
                      ? "เอกสารประกอบการประชุม"
                      : "Conference Documents"}
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "30px",
                      fontSize: "15px",
                    }}
                  >
                    {locale === "th"
                      ? "ดาวน์โหลดหนังสือขอความอนุเคราะห์ประชาสัมพันธ์การประชุม ACCP 2026"
                      : "Download official letters for ACCP 2026 conference publicity"}
                  </p>
                </div>
              </div>
              <div className="row justify-content-center" style={{ gap: "16px" }}>
                {[
                  {
                    name: "สสจ_นส ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026",
                    file: "/assets/documents/สสจ_นส ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026.pdf",
                  },
                  {
                    name: "ผอ.รพ._นส.ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026",
                    file: "/assets/documents/ผอ.รพ._นส.ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026.pdf",
                  },
                  {
                    name: "คณบดี_นส.ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026_คณบดี",
                    file: "/assets/documents/คณบดี_นส.ขอความอนุเคราะห์ประชาสัมพันธ์การประชุมACCP2026_คณบดี.pdf",
                  },
                ].map((doc, i) => {
                  const docKey = `reg-${i}`;
                  const isDownloading = downloadingDoc === docKey;
                  return (
                    <div
                      key={i}
                      className="col-lg-3 col-md-5 col-sm-10"
                      style={{ padding: "0 8px" }}
                    >
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={async () => {
                          setDownloadingDoc(docKey);
                          try {
                            const res = await fetch(doc.file);
                            if (!res.ok) throw new Error("Download failed");
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = doc.file.split("/").pop() || doc.name + ".pdf";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                            toast.success(
                              locale === "th"
                                ? `ดาวน์โหลด ${doc.name} สำเร็จ`
                                : `Downloaded ${doc.name}`,
                            );
                          } catch {
                            toast.error(
                              locale === "th"
                                ? "ดาวน์โหลดไม่สำเร็จ"
                                : "Download failed",
                            );
                          } finally {
                            setDownloadingDoc(null);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px 20px",
                          backgroundColor: isDownloading ? "#eef2ff" : "#fff",
                          borderRadius: "12px",
                          border: `1px solid ${isDownloading ? "#6366f140" : "#e5e7eb"}`,
                          color: "#333",
                          cursor: isDownloading ? "wait" : "pointer",
                          width: "100%",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                          opacity: isDownloading ? 0.7 : 1,
                        }}
                      >
                        {isDownloading ? (
                          <i
                            className="fa-solid fa-spinner fa-spin"
                            style={{
                              fontSize: "24px",
                              color: "#e53e3e",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <i
                            className="fa-solid fa-file-pdf"
                            style={{
                              fontSize: "24px",
                              color: "#e53e3e",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              display: "block",
                              marginBottom: "2px",
                            }}
                          >
                            {isDownloading
                              ? (locale === "th" ? "กำลังดาวน์โหลด..." : "Downloading...")
                              : doc.name}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#999",
                            }}
                          >
                            PDF
                          </span>
                        </div>
                        <i
                          className={`fa-solid ${isDownloading ? "fa-spinner fa-spin" : "fa-download"}`}
                          style={{
                            fontSize: "16px",
                            color: "#999",
                            flexShrink: 0,
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Show pricing based on user nationality */}
          {isAuthenticated && user ? (
            // Logged in: Show only relevant pricing
            isThai ? (
              <RegistrationThaiFees tickets={tickets} />
            ) : (
              <RegistrationInternationalFees tickets={tickets} />
            )
          ) : (
            // Not logged in: Show both pricing sections
            <>
              <RegistrationInternationalFees tickets={tickets} />
              <RegistrationThaiFees tickets={tickets} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
