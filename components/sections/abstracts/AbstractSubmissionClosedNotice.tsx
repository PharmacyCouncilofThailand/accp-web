"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ABSTRACT_SUBMISSION_DEADLINE_LABEL } from "@/lib/abstractSubmissionStatus";

interface AbstractSubmissionClosedNoticeProps {
  variant?: "page" | "inline" | "banner";
  showActions?: boolean;
}

export default function AbstractSubmissionClosedNotice({
  variant = "page",
  showActions = true,
}: AbstractSubmissionClosedNoticeProps) {
  const t = useTranslations("abstractSubmission.closed");
  const isInline = variant === "inline";

  if (variant === "banner") {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #fffaf2 0%, #ffffff 100%)",
          border: "1px solid #f4c064",
          borderLeft: "6px solid #d97706",
          borderRadius: "12px",
          padding: "18px 22px",
          boxShadow: "0 8px 24px rgba(217, 119, 6, 0.08)",
          margin: "0 0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            minWidth: "280px",
            flex: "1 1 520px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "rgba(217, 119, 6, 0.12)",
              color: "#b45309",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <i className="fa-solid fa-lock" style={{ fontSize: "20px" }} />
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                color: "#92400e",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "4px",
              }}
            >
              <i className="fa-solid fa-circle-info" />
              {t("badge")}
            </div>
            <h3
              style={{
                color: "#1a237e",
                fontSize: "21px",
                fontWeight: 800,
                lineHeight: 1.25,
                margin: "0 0 4px",
              }}
            >
              {t("title")}
            </h3>
            <p
              style={{
                color: "#4b5563",
                fontSize: "14px",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {t("description")}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            flex: "0 1 auto",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#7c2d12",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "999px",
              padding: "9px 13px",
              fontSize: "13px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <i
              className="fa-regular fa-calendar-xmark"
              style={{ marginRight: "7px" }}
            />
            {t("deadline", { date: ABSTRACT_SUBMISSION_DEADLINE_LABEL })}
          </span>
          {showActions ? (
            <Link
              href="/call-for-abstracts"
              style={{
                background: "#1a237e",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <i className="fa-solid fa-book-open" />
              {t("viewGuidelines")}
            </Link>
          ) : (
            <span
              aria-disabled="true"
              style={{
                background: "#eef0f4",
                color: "#4b5563",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <i className="fa-solid fa-ban" />
              {t("button")}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: isInline
          ? "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)"
          : "#ffffff",
        border: "1px solid #f4c064",
        borderLeft: "6px solid #d97706",
        borderRadius: "8px",
        padding: isInline ? "24px" : "40px",
        textAlign: "center",
        boxShadow: isInline
          ? "0 8px 24px rgba(217, 119, 6, 0.1)"
          : "0 16px 45px rgba(26, 35, 126, 0.12)",
        maxWidth: isInline ? "760px" : "860px",
        margin: isInline ? "24px auto 32px" : "0 auto",
      }}
    >
      <div
        style={{
          width: isInline ? "54px" : "72px",
          height: isInline ? "54px" : "72px",
          borderRadius: "50%",
          background: "rgba(217, 119, 6, 0.12)",
          color: "#b45309",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
        }}
      >
        <i
          className="fa-solid fa-lock"
          style={{ fontSize: isInline ? "22px" : "30px" }}
        />
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "#92400e",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
        }}
      >
        <i className="fa-solid fa-circle-info" />
        {t("badge")}
      </div>

      {isInline ? (
        <h3
          style={{
            color: "#1a237e",
            fontSize: "24px",
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: "10px",
          }}
        >
          {t("title")}
        </h3>
      ) : (
        <h2
          style={{
            color: "#1a237e",
            fontSize: "34px",
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: "14px",
          }}
        >
          {t("title")}
        </h2>
      )}

      <p
        style={{
          color: "#4b5563",
          fontSize: isInline ? "15px" : "17px",
          lineHeight: 1.75,
          margin: "0 auto 18px",
          maxWidth: "680px",
        }}
      >
        {t("description")}
      </p>

      <p
        style={{
          color: "#7c2d12",
          fontSize: "15px",
          fontWeight: 700,
          margin: "0 auto",
        }}
      >
        <i className="fa-regular fa-calendar-xmark" style={{ marginRight: "8px" }} />
        {t("deadline", { date: ABSTRACT_SUBMISSION_DEADLINE_LABEL })}
      </p>

      {showActions ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "28px",
          }}
        >
          <Link
            href="/call-for-abstracts"
            style={{
              background: "#1a237e",
              color: "#ffffff",
              padding: "13px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="fa-solid fa-book-open" />
            {t("viewGuidelines")}
          </Link>
          <Link
            href="/abstract-status"
            style={{
              background: "#ffffff",
              color: "#1a237e",
              padding: "13px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #c7d2fe",
            }}
          >
            <i className="fa-solid fa-list-check" />
            {t("viewStatus")}
          </Link>
        </div>
      ) : (
        <span
          aria-disabled="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "22px",
            background: "#9ca3af",
            color: "#ffffff",
            padding: "13px 28px",
            borderRadius: "8px",
            fontWeight: 800,
            cursor: "not-allowed",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          <i className="fa-solid fa-ban" />
          {t("button")}
        </span>
      )}
    </div>
  );
}
