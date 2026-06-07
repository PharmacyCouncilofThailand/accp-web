import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { TicketProvider } from '@/context/TicketContext';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: Props) {
    const { locale } = await params;
    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering for next-intl
    setRequestLocale(locale);

    // Get messages for this locale
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <AuthProvider>
                <TicketProvider>
                    {children}
                </TicketProvider>
            </AuthProvider>
        </NextIntlClientProvider>
    )
}

