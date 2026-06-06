import { setRequestLocale } from 'next-intl/server';
import ForgotPasswordForm from '@/components/sections/auth/ForgotPasswordForm';

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <ForgotPasswordForm />
    </div>
  );
}
