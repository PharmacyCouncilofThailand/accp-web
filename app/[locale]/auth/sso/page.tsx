"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "next-intl";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

function sanitizeRedirect(redirect: string | null, locale: string): string {
  if (!redirect) return `/${locale}`;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return `/${locale}`;
  return redirect;
}

export default function SSOCallbackPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ssoToken = searchParams.get("sso");
    const redirectTo = sanitizeRedirect(searchParams.get("redirect"), locale);

    if (isAuthenticated && !ssoToken) {
      router.replace(redirectTo);
      return;
    }

    if (!ssoToken) {
      setError("ไม่พบข้อมูล SSO token");
      setIsVerifying(false);
      return;
    }

    const verifySSO = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/sso-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ssoToken }),
        });

        const data = await res.json();

        if (data.success) {
          login(data.user, data.token, true);
          router.replace(redirectTo);
        } else {
          setError(data.error || "SSO verification failed");
        }
      } catch (err) {
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySSO();
  }, [searchParams, router, login, locale, isAuthenticated]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">กำลังเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ไปยังหน้า Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
