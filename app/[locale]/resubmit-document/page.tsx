"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ResubmitDocumentPage() {
  const t = useTranslations("resubmitDocument");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [wasAutoLoggedOut, setWasAutoLoggedOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rejectionReason = searchParams.get("reason") || "";

  // Force-logout when user lands on this page while logged in.
  // Their cached JWT/role/status may be stale (e.g. admin just changed role).
  // Re-authenticating ensures the password they enter belongs to the correct
  // account and prevents stale UI state after a successful resubmit.
  useEffect(() => {
    if (user) {
      logout();
      setWasAutoLoggedOut(true);
    }
    // Only run on mount; we intentionally ignore changes to user/logout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(t("error.invalidFile"));
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError(t("error.fileTooLarge"));
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!email || !password) {
      setError(
        locale === "th"
          ? "กรุณากรอกข้อมูลให้ครบถ้วน"
          : "Please fill in all fields",
      );
      setIsLoading(false);
      return;
    }

    if (!file) {
      setError(t("error.fileRequired"));
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("verificationDoc", file);

      const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
        /\/$/,
        "",
      );
      const response = await fetch(`${API_URL}/auth/resubmit-document`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(t("error.invalidCredentials"));
        } else if (response.status === 400) {
          if (data.error?.includes("rejected")) {
            setError(t("error.notRejected"));
          } else {
            setError(data.error || t("error.failed"));
          }
        } else {
          setError(data.error || t("error.failed"));
        }
        setIsLoading(false);
        return;
      }

      // Success
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Resubmit error:", err);
      setError(t("error.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "40px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <img
                src="/assets/img/logo/accp_logo_main.png"
                alt="ACCP 2026"
                style={{ height: "80px", width: "auto", margin: "0 auto" }}
              />
            </div>
            <div style={{ fontSize: "48px", marginBottom: "24px" }}>✅</div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "16px",
              }}
            >
              {t("success")}
            </h3>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
              {t("successMessage")}
            </p>
            <Link
              href={`/${locale}/login`}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#1a237e",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "15px",
                textDecoration: "none",
                width: "100%",
                textAlign: "center",
              }}
            >
              {t("goToLogin")}
            </Link>
          </div>
        </div>
      )}

      {/* Main Form */}
      <section
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href={`/${locale}`}>
              <img
                src="/assets/img/logo/accp_logo_main.png"
                alt="ACCP 2026"
                style={{ height: "80px", width: "auto" }}
              />
            </Link>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {t("title")}
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            {t("description")}
          </p>

          {/* Auto-logout notice */}
          {wasAutoLoggedOut && (
            <div
              style={{
                padding: "12px 16px",
                background: "#e3f2fd",
                border: "1px solid #2196f3",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                color: "#0d47a1",
              }}
            >
              {locale === "th"
                ? "คุณถูกออกจากระบบชั่วคราว เนื่องจากสถานะบัญชีของคุณมีการเปลี่ยนแปลง กรุณายืนยันตัวตนด้วย email และ password ของคุณอีกครั้งเพื่ออัพโหลดเอกสาร"
                : "You have been logged out because your account status has changed. Please confirm your email and password to upload your document."}
            </div>
          )}

          {/* Rejection Reason (if available) */}
          {rejectionReason && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  color: "#e65100",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                }}
              >
                {t("rejectionReason")}:
              </p>
              <p style={{ color: "#e65100", margin: 0, fontSize: "14px" }}>
                {rejectionReason}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#ffebee",
                border: "1px solid #ef5350",
                borderRadius: "8px",
                color: "#c62828",
                fontSize: "14px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                {t("email")} <span style={{ color: "#e53935" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                {t("password")} <span style={{ color: "#e53935" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                {t("uploadNew")} <span style={{ color: "#e53935" }}>*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${file ? "#4caf50" : "#e0e0e0"}`,
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: file ? "#e8f5e9" : "#fafafa",
                  transition: "all 0.2s",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {file ? (
                  <>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      📄
                    </div>
                    <p
                      style={{
                        fontWeight: "600",
                        color: "#2e7d32",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {file.name}
                    </p>
                    <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      📎
                    </div>
                    <p
                      style={{
                        fontWeight: "500",
                        color: "#666",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {locale === "th"
                        ? "คลิกเพื่อเลือกไฟล์"
                        : "Click to select file"}
                    </p>
                    <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>
                      {t("fileRequirements")}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                background: isLoading ? "#9fa8da" : "#1a237e",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {isLoading ? t("submitting") : t("submit")}
            </button>
          </form>

          {/* Back to Login */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link
              href={`/${locale}/login`}
              style={{
                color: "#1a237e",
                fontWeight: "500",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              ← {locale === "th" ? "กลับไปหน้าเข้าสู่ระบบ" : "Back to Login"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
