'use client'
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { api, type MyTicketsResponse } from '@/lib/api';

type TicketData = MyTicketsResponse['data'];

export default function MyTickets() {
    const t = useTranslations('tickets');
    const locale = useLocale();
    const router = useRouter();
    const { isAuthenticated, token } = useAuth();

    const [ticketData, setTicketData] = useState<TicketData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/${locale}/login`);
            return;
        }

        if (!token) return;

        let mounted = true;
        setIsLoading(true);
        setError(null);

        api.payments
            .myTickets(token)
            .then((res) => {
                if (mounted) {
                    setTicketData(res.data);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch my tickets:', err);
                if (mounted) {
                    setError(t('loadError'));
                }
            })
            .finally(() => {
                if (mounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [isAuthenticated, token, locale, router, t]);

    const formatAmount = (amount: string, currency: string) => {
        const value = Number(amount) || 0;
        if (currency === 'THB') {
            return `฿${value.toLocaleString('th-TH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} USD`;
    };

    const formatDate = (isoDate: string | null) => {
        if (!isoDate) return '-';
        return new Date(isoDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTimeRange = (start: string | null, end: string | null) => {
        if (!start) return '-';

        const startTime = new Date(start).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        if (!end) return startTime;

        const endTime = new Date(end).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return `${startTime} - ${endTime}`;
    };

    const resolveStatusLabel = (status: string) => {
        if (status === 'confirmed') return t('confirmed');
        return status;
    };

    const registration = ticketData?.registration || null;

    const tickets = registration
        ? [{
            id: registration.regCode,
            categoryLabel: registration.priority === 'early_bird' ? t('earlyBird') : t('regular'),
            status: registration.status,
            purchaseDate: formatDate(registration.purchasedAt),
            amount: formatAmount(registration.amount, registration.currency),
            includes:
                registration.includes.length > 0
                    ? registration.includes
                    : [
                        t('fullAccess'),
                        t('conferenceMaterials'),
                        t('coffeeLunch'),
                        t('certificate'),
                    ],
        }]
        : [];

    const galaDinnerTicket = ticketData?.galaTicket
        ? {
            id: ticketData.galaTicket.id,
            name: ticketData.galaTicket.name,
            status: ticketData.galaTicket.status,
            date: formatDate(ticketData.galaTicket.dateTimeStart),
            time: formatTimeRange(ticketData.galaTicket.dateTimeStart, ticketData.galaTicket.dateTimeEnd),
            venue: ticketData.galaTicket.venue || '-',
            amount: formatAmount(ticketData.galaTicket.amount, ticketData.galaTicket.currency),
            dietary: ticketData.galaTicket.dietary,
        }
        : null;

    const addons = (ticketData?.workshops || []).map((workshop) => ({
        id: workshop.id,
        name: workshop.name,
        status: workshop.status,
        date: formatDate(workshop.dateTimeStart),
        time: formatTimeRange(workshop.dateTimeStart, workshop.dateTimeEnd),
        venue: workshop.venue || '-',
        amount: formatAmount(workshop.amount, workshop.currency),
    }));

    return (
        <Layout headerStyle={1} footerStyle={1} headerBgWhite={true}>
            <div className="ticket-page-container">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div className="ticket-header-card">
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#1a237e',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <i className="fa-solid fa-ticket" style={{ color: '#FFBA00' }} />
                            {t('pageTitle')}
                        </h1>
                        <p style={{ color: '#666', fontSize: '16px' }}>
                            {t('pageDescription')}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="ticket-card" style={{ textAlign: 'center', color: '#666' }}>
                            {t('loading')}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="ticket-card" style={{ textAlign: 'center', color: '#d32f2f' }}>
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && tickets.length === 0 && !galaDinnerTicket && addons.length === 0 && (
                        <div className="ticket-card" style={{ textAlign: 'center', color: '#666' }}>
                            {t('noTickets')}
                        </div>
                    )}

                    {/* Main Registration Ticket */}
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="ticket-card">
                            {/* Decorative gradient bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '6px',
                                background: 'linear-gradient(90deg, #1a237e 0%, #3949ab 50%, #FFBA00 100%)'
                            }} />

                            {/* Status Badge */}
                            <div className="ticket-status-badge">
                                <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }} />
                                {resolveStatusLabel(ticket.status)}
                            </div>

                            <div className="ticket-layout-grid">
                                {/* Left side - Ticket Details */}
                                <div>


                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 16px',
                                        background: '#f5f5f5',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        marginBottom: '20px'
                                    }}>
                                        {ticket.categoryLabel}
                                    </div>

                                    <div className="ticket-details-grid">
                                        <div className="ticket-info-label">{t('ticketId')}:</div>
                                        <div className="ticket-info-value" style={{ fontFamily: 'monospace' }}>{ticket.id}</div>

                                        <div className="ticket-info-label">{t('purchaseDate')}:</div>
                                        <div className="ticket-info-value">{ticket.purchaseDate}</div>

                                        <div className="ticket-info-label">{t('amountPaid')}:</div>
                                        <div className="ticket-info-value" style={{ color: '#00C853', fontSize: '18px', fontWeight: '700' }}>{ticket.amount}</div>
                                    </div>

                                    <div className="ticket-includes-box">
                                        <h3 style={{
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            color: '#1a237e',
                                            marginBottom: '12px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {t('registrationIncludes')}
                                        </h3>
                                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                            {ticket.includes.map((item, idx) => (
                                                <li key={idx} style={{
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    marginBottom: '8px',
                                                    lineHeight: '1.6'
                                                }}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right side - QR Code */}
                                <div className="ticket-qr-section">
                                    <div style={{
                                        width: '180px',
                                        height: '180px',
                                        background: '#fff',
                                        border: '2px solid #1a237e',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '15px',
                                        position: 'relative'
                                    }}>
                                        {/* QR Code Placeholder */}
                                        <div style={{
                                            width: '160px',
                                            height: '160px',
                                            background: 'repeating-linear-gradient(0deg, #1a237e, #1a237e 2px, transparent 2px, transparent 4px), repeating-linear-gradient(90deg, #1a237e, #1a237e 2px, transparent 2px, transparent 4px)',
                                            opacity: 0.8
                                        }} />
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        textAlign: 'center',
                                        margin: '0 0 8px 0'
                                    }}>
                                        {t('scanQrCode')}
                                    </p>

                                    {/* Download Button */}
                                    <button style={{
                                        width: 'calc(100% - 20px)',
                                        padding: '10px 16px',
                                        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s ease',
                                        marginBottom: '10px'
                                    }}>
                                        <i className="fa-solid fa-download" />
                                        {t('downloadPdf')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Gala Dinner Ticket */}
                    {galaDinnerTicket && (
                        <div className="ticket-card">
                            <h2 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <i className="fa-solid fa-champagne-glasses" style={{ color: '#C2185B' }} />
                                {galaDinnerTicket.name}
                            </h2>

                            <div className="gala-card">
                                <div className="ticket-status-badge">
                                    {resolveStatusLabel(galaDinnerTicket.status)}
                                </div>

                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#333',
                                    marginBottom: '15px',
                                    paddingRight: '120px'
                                }}>
                                    {galaDinnerTicket.name}
                                </h3>

                                <div className="addon-details-flex">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-calendar" style={{ color: '#C2185B' }} />
                                        <span style={{ color: '#666' }}>{galaDinnerTicket.date}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-clock" style={{ color: '#C2185B' }} />
                                        <span style={{ color: '#666' }}>{galaDinnerTicket.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-location-dot" style={{ color: '#C2185B' }} />
                                        <span style={{ color: '#666' }}>{galaDinnerTicket.venue}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-tag" style={{ color: '#C2185B' }} />
                                        <span style={{ color: '#C2185B', fontWeight: '700' }}>{galaDinnerTicket.amount}</span>
                                    </div>
                                    {/* Dietary Info */}
                                    {galaDinnerTicket.dietary && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', width: '100%' }}>
                                            <i className="fa-solid fa-utensils" style={{ color: '#C2185B' }} />
                                            <span style={{ color: '#666' }}>Dietary: <strong>{galaDinnerTicket.dietary}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Workshop Add-ons */}
                    {addons.length > 0 && (
                        <div className="ticket-card">
                            <h2 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <i className="fa-solid fa-briefcase" style={{ color: '#00695c' }} />
                                {t('registeredWorkshops')}
                            </h2>

                            {addons.map((addon) => (
                                <div key={addon.id} className="addon-card">
                                    <div className="ticket-status-badge">
                                        {resolveStatusLabel(addon.status)}
                                    </div>

                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#333',
                                        marginBottom: '15px',
                                        paddingRight: '120px'
                                    }}>
                                        {addon.name}
                                    </h3>

                                    <div className="addon-details-flex">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-calendar" style={{ color: '#00695c' }} />
                                            <span style={{ color: '#666' }}>{addon.date}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-clock" style={{ color: '#00695c' }} />
                                            <span style={{ color: '#666' }}>{addon.time}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-location-dot" style={{ color: '#00695c' }} />
                                            <span style={{ color: '#666' }}>{addon.venue}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-tag" style={{ color: '#00695c' }} />
                                            <span style={{ color: '#00695c', fontWeight: '700' }}>{addon.amount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
