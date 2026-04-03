'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl';
import { Turnstile } from '@marsidev/react-turnstile';

interface FormData {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactForm() {
    const t = useTranslations('contact');
    const tCommon = useTranslations('common');
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        // Validate required fields
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setStatus({ type: 'error', message: 'Please fill in all required fields.' });
            setIsLoading(false);
            return;
        }

        // Check reCAPTCHA if site key is configured
        if (siteKey && !recaptchaToken) {
            setStatus({ type: 'error', message: 'Please complete the reCAPTCHA verification.' });
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: recaptchaToken || ''
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message || 'Message sent successfully!' });
                // Reset form
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setRecaptchaToken(null);
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
                setRecaptchaToken(null);
            }
        } catch {
            setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
            setRecaptchaToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="contact4-boxarea">
            <h3 className="text-anime-style-3">{t('getInTouch')}</h3>
            <div className="space8" />
            
            {status && (
                <div 
                    style={{
                        padding: '12px 16px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: status.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}
                >
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="input-area">
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('name')} 
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="input-area">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder={tCommon('phone')}
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-6">
                        <div className="input-area">
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('emailAddress')} 
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-6">
                        <div className="input-area">
                            <input 
                                type="text" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder={t('subject')} 
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="input-area">
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t('message')} 
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Cloudflare Turnstile */}
                    {siteKey && (
                        <div className="col-lg-12">
                            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                                <Turnstile
                                    siteKey={siteKey}
                                    onSuccess={(token) => setRecaptchaToken(token)}
                                    onExpire={() => setRecaptchaToken(null)}
                                    onError={() => setRecaptchaToken(null)}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="col-lg-12">
                        <div className="space24" />
                        <div className="input-area text-end">
                            <button 
                                type="submit" 
                                className="vl-btn1"
                                disabled={isLoading || (!!siteKey && !recaptchaToken)}
                                style={{ opacity: (isLoading || (!!siteKey && !recaptchaToken)) ? 0.7 : 1 }}
                            >
                                {isLoading ? 'Sending...' : t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
