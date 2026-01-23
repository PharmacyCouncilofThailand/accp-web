'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { Hourglass } from 'react-loader-spinner';

export default function ForgotPasswordForm() {
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error(locale === 'th' ? 'กรุณากรอกอีเมล' : 'Please enter your email');
            return;
        }

        setIsLoading(true);

        try {
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    toast.error(locale === 'th' ? 'ไม่พบอีเมลนี้ในระบบ' : 'Email not found in our system');
                } else {
                    toast.error(data.error || 'Something went wrong');
                }
                return;
            }

            setIsSuccess(true);
            toast.success(locale === 'th' ? 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว' : 'Password reset link sent!');
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s ease'
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            maxWidth: '420px',
            width: '100%',
            margin: '0 auto',
            position: 'relative'
        }}>
            {/* Loading Overlay */}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <Hourglass
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={['#1a237e', '#72a1ed']}
                    />
                    <div style={{ color: '#1a237e', fontSize: '18px', fontWeight: '600' }}>
                        {locale === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
                    </div>
                </div>
            )}

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Link href={`/${locale}`}>
                    <img src="/assets/img/logo/accp_logo_main.png" alt="ACCP 2026"
                        style={{ height: '80px', width: 'auto' }} />
                </Link>
            </div>

            {!isSuccess ? (
                <>
                    {/* Title */}
                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
                        {locale === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot Password?'}
                    </h2>
                    <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginBottom: '32px', lineHeight: '1.5' }}>
                        {locale === 'th' 
                            ? 'กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้' 
                            : 'Enter your email address and we\'ll send you a link to reset your password'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '6px' }}>
                                {locale === 'th' ? 'อีเมล' : 'Email'} <span style={{ color: '#e53935' }}>*</span>
                            </label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com" 
                                required 
                                style={inputStyle} 
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#1a237e',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isLoading 
                                ? (locale === 'th' ? 'กำลังส่ง...' : 'Sending...') 
                                : (locale === 'th' ? 'ส่งลิงก์รีเซ็ตรหัสผ่าน' : 'Send Reset Link')}
                        </button>
                    </form>
                </>
            ) : (
                /* Success State */
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📧</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a1a', marginBottom: '16px' }}>
                        {locale === 'th' ? 'ตรวจสอบอีเมลของคุณ' : 'Check Your Email'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {locale === 'th' 
                            ? `เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่ ${email} แล้ว กรุณาตรวจสอบอีเมลของคุณ`
                            : `We've sent a password reset link to ${email}. Please check your inbox.`}
                    </p>
                    <div style={{ 
                        background: '#fff3cd', 
                        borderRadius: '8px', 
                        padding: '16px', 
                        marginBottom: '24px',
                        border: '1px solid #ffc107'
                    }}>
                        <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
                            ⏰ {locale === 'th' ? 'ลิงก์จะหมดอายุใน 1 ชั่วโมง' : 'The link will expire in 1 hour'}
                        </p>
                    </div>
                    <button
                        onClick={() => { setIsSuccess(false); setEmail(''); }}
                        style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            border: '2px solid #1a237e',
                            borderRadius: '8px',
                            color: '#1a237e',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {locale === 'th' ? 'ส่งอีกครั้ง' : 'Send Again'}
                    </button>
                </div>
            )}

            {/* Back to Login Link */}
            <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                <Link href={`/${locale}/login`} style={{ 
                    color: '#1a237e', 
                    fontWeight: '600', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    ← {locale === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Login'}
                </Link>
            </div>
        </div>
    );
}
