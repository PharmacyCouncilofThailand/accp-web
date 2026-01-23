import ForgotPasswordForm from '@/components/sections/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
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
