'use client'
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/sections/auth/ResetPasswordForm';

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <Suspense fallback={
        <div style={{ 
          textAlign: 'center', 
          color: '#1a237e', 
          fontSize: '18px' 
        }}>
          Loading...
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
