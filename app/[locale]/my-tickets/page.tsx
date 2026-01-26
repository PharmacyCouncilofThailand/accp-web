'use client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

    import { useCheckoutWizard } from '@/hooks/checkout/useCheckoutWizard';
    import { registrationPackages, workshopOptions, addOns } from '@/data/checkout';
    import { useAuth } from '@/context/AuthContext';

    export default function MyTickets() {
    const t = useTranslations('tickets');
    const tUser = useTranslations('userProfile');
    const { checkoutData } = useCheckoutWizard();
    const { user } = useAuth();

    // Determine if we have valid checkout data, otherwise fallback to default/empty or display a message
    // For this prototype, we'll try to use checkoutData, if package is not selected, we might fallback or show nothing.
    // However, to ensure the user sees *their* selection, we rely on checkoutData.

    const selectedPackage = registrationPackages.find(p => p.id === checkoutData.selectedPackage);
    const hasGala = checkoutData.selectedAddOns.includes('gala');
    const hasWorkshop = checkoutData.selectedAddOns.includes('workshop');

    // Dynamic Ticket Data
    const tickets = selectedPackage ? [{
        id: `ACCP2026-REG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // content_chunk: Generate random ID
        type: selectedPackage.id, // This matches the translation key 'packages.student' etc. ideally, or we use the ID
        category: 'earlyBird', // Assuming early bird for now
        status: 'confirmed',
        purchaseDate: new Date().toISOString().split('T')[0],
        amount: user?.country?.toLowerCase() === 'thailand' ? `฿${selectedPackage.priceTHB}` : `$${selectedPackage.priceUSD}`,
        includes: [
            'fullAccess',
            'conferenceMaterials',
            'coffeeLunch',
            'certificate',
            ...(hasGala ? ['galaDinner'] : [])
        ],
        qrCode: true
    }] : [];

    // Dynamic Gala Ticket
    const galaDinnerTicket = hasGala ? {
        id: `ACCP2026-GALA-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        eventName: 'galaDinnerEvent',
        status: 'confirmed',
        date: 'July 10, 2026',
        time: '19:00 - 22:00',
        venue: 'Centara Grand Ballroom',
        dressCode: 'formalAttire',
        dietary: checkoutData.dietaryRequirement === 'other' ? checkoutData.dietaryOtherText : checkoutData.dietaryRequirement,
        qrCode: true
    } : null;

    // Dynamic Workshop Data
    const workshopAddon = addOns.find(a => a.id === 'workshop');
    const selectedWorkshop = workshopOptions.find(w => w.value === checkoutData.selectedWorkshopTopic);
    
    const addons = hasWorkshop && selectedWorkshop ? [{
        id: `ACCP2026-WS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        type: 'preWorkshop',
        name: selectedWorkshop.label,
        date: 'July 8, 2026',
        time: '09:00 - 17:00',
        status: 'confirmed',
        amount: user?.country?.toLowerCase() === 'thailand' ? `฿${workshopAddon?.priceTHB}` : `$${workshopAddon?.priceUSD}`
    }] : [];

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
                                {t(ticket.status)}
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
                                        {t(ticket.category)}
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
                                                    {t(item)}
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
                                {t(galaDinnerTicket.eventName)}
                            </h2>

                            <div className="gala-card">
                                <div className="ticket-status-badge">
                                    {t(galaDinnerTicket.status)}
                                </div>

                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#333',
                                    marginBottom: '15px',
                                    paddingRight: '120px'
                                }}>
                                    An Elegant Evening of Fine Dining & Networking
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
                                        <i className="fa-solid fa-user-tie" style={{ color: '#C2185B' }} />
                                        <span style={{ color: '#C2185B', fontWeight: '700' }}>{t(galaDinnerTicket.dressCode)}</span>
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
                                        {t(addon.status)}
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
