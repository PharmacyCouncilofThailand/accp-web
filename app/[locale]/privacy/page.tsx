import { setRequestLocale } from 'next-intl/server';
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-4">Your privacy is important to us. This policy outlines how we handle your data.</p>
            <p className="text-gray-600">Content coming soon...</p>
        </div>
    );
}
