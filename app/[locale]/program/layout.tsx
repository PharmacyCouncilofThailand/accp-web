import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Program — ACCP 2026",
    description: "Explore plenary, symposia, workshops, and oral/e-poster sessions.",
    keywords: ["program", "plenary", "symposia", "ACCP 2026", "clinical pharmacy conference"],
}

export default async function ProgramLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return children
}
