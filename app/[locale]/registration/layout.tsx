import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Registration — ACCP 2026",
    description: "View fees, deadlines, and register online for ACCP 2026.",
    keywords: "registration, fees, accp 2026",
};

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <>{children}</>;
}
