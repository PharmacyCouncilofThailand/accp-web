'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Hourglass } from 'react-loader-spinner';

export default function ResetPasswordForm() {
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenMissing, setIsTokenMissing] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setIsTokenMissing(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newPassword || !confirmPassword) {
            toast.error(locale === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Please enter your password');
            return;
        }

        if (newPassword.length < 6) {
            toast.error(locale === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(locale === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    toast.error(locale === 'th' ? 'ลิงก์หมดอายุหรือไม่ถูกต้อง' : 'Invalid or expired reset link');
                } else {
                    toast.error(data.error || 'Something went wrong');
                }
                return;
            }

            setIsSuccess(true);
            toast.success(locale === 'th' ? 'เปลี่ยนรหัสผ่านสำเร็จ!' : 'Password reset successfully!');
        } catch (error) {
            console.error('Reset password error:', error);
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

            {isTokenMissing ? (
                /* Token Missing State */
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#e53935', marginBottom: '16px' }}>
                        {locale === 'th' ? 'ลิงก์ไม่ถูกต้อง' : 'Invalid Link'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {locale === 'th' 
                            ? 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่'
                            : 'The password reset link is invalid or has expired. Please request a new one.'}
                    </p>
                    <Link 
                        href={`/${locale}/forgot-password`}
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            background: '#1a237e',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {locale === 'th' ? 'ขอลิงก์ใหม่' : 'Request New Link'}
                    </Link>
                </div>
            ) : !isSuccess ? (
                <>
                    {/* Title */}
                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
                        {locale === 'th' ? 'ตั้งรหัสผ่านใหม่' : 'Reset Password'}
                    </h2>
                    <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginBottom: '32px', lineHeight: '1.5' }}>
                        {locale === 'th' 
                            ? 'กรุณากรอกรหัสผ่านใหม่ของคุณ' 
                            : 'Please enter your new password'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* New Password Field */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '6px' }}>
                                {locale === 'th' ? 'รหัสผ่านใหม่' : 'New Password'} <span style={{ color: '#e53935' }}>*</span>
                            </label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••" 
                                required 
                                minLength={6}
                                style={inputStyle} 
                            />
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                {locale === 'th' ? 'อย่างน้อย 6 ตัวอักษร' : 'At least 6 characters'}
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '6px' }}>
                                {locale === 'th' ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password'} <span style={{ color: '#e53935' }}>*</span>
                            </label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••" 
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
                                ? (locale === 'th' ? 'กำลังบันทึก...' : 'Saving...') 
                                : (locale === 'th' ? 'บันทึกรหัสผ่านใหม่' : 'Save New Password')}
                        </button>
                    </form>
                </>
            ) : (
                /* Success State */
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#2e7d32', marginBottom: '16px' }}>
                        {locale === 'th' ? 'เปลี่ยนรหัสผ่านสำเร็จ!' : 'Password Changed!'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {locale === 'th' 
                            ? 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลย'
                            : 'Your password has been reset successfully. You can now log in with your new password.'}
                    </p>
                    <button
                        onClick={() => router.push(`/${locale}/login`)}
                        style={{
                            padding: '14px 32px',
                            background: '#1a237e',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {locale === 'th' ? 'ไปหน้าเข้าสู่ระบบ' : 'Go to Login'}
                    </button>
                </div>
            )}

            {/* Back to Login Link */}
            {!isSuccess && !isTokenMissing && (
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
            )}
        </div>
    );
}
