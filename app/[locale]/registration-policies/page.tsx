import { setRequestLocale } from 'next-intl/server';
import { notFound } from "next/navigation";

export default async function RegistrationPolicies({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

  notFound();
}
