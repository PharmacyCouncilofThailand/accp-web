'use client'
import { useTranslations } from 'next-intl';
import { useState } from 'react';

// Configuration for Floor Plans
const FLOOR_PLANS = {
    ballroom: {
        id: 'ballroom',
        label: 'World Ballroom',
        dateRange: 'July 9, 11',
        fullDate: 'July 9, 11, 2026',
        image: '/assets/img/Venue Floor Plan/Centara Grand _ Bangkok Convention Centre at CentralWorld - Floor Plan WorldBallroom.jpg',
    },
    convention: {
        id: 'convention',
        label: 'Convention Centre',
        dateRange: 'July 10',
        fullDate: 'July 10, 2026',
        image: '/assets/img/Venue Floor Plan/Centara Grand _ Bangkok Convention Centre at CentralWorld - Floor Plan Bangkok Convention Centre.jpg',
    }
} as const;

type TabType = keyof typeof FLOOR_PLANS;

export default function MapSection() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState<TabType>('ballroom');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const currentPlan = FLOOR_PLANS[activeTab];

    return (
        <>
            <div className="map-section-area" style={{ padding: '80px 0', background: '#fff' }}>
                <div className="container">
                    {/* Header */}
                    <div className="row">
                        <div className="col-lg-8 m-auto">
                            <div className="heading2 text-center" style={{ marginBottom: '50px' }}>
                                <h5 data-aos="fade-up" data-aos-duration={800} style={{ color: '#3b5998', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    {t('map.subtitle')}
                                </h5>
                                <div className="space16" />
                                <h2 className="text-anime-style-3" style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>
                                    {t('map.title')}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="row align-items-stretch">
                        {/* LEFT: Interactive Floor Plan */}
                        <div className="col-lg-7 mb-4 mb-lg-0" data-aos="fade-right" data-aos-duration={800}>
                            <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', height: '100%', boxShadow: '0 15px 50px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>

                                {/* Tabs Switcher */}
                                <div style={{ display: 'flex', gap: '10px', padding: '10px 20px', background: '#fff', borderBottom: '1px solid #e9ecef', overflowX: 'auto' }}>
                                    {Object.values(FLOOR_PLANS).map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => setActiveTab(plan.id as TabType)}
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '30px',
                                                border: 'none',
                                                background: activeTab === plan.id ? '#3b5998' : '#f0f2f5',
                                                color: activeTab === plan.id ? '#fff' : '#6c757d',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                transition: 'all 0.3s ease',
                                                boxShadow: activeTab === plan.id ? '0 4px 10px rgba(59, 89, 152, 0.3)' : 'none'
                                            }}
                                        >
                                            {plan.label} ({plan.dateRange})
                                        </button>
                                    ))}
                                </div>

                                {/* Floor Plan Display */}
                                <div
                                    onClick={() => setIsLightboxOpen(true)}
                                    style={{
                                        position: 'relative',
                                        flex: 1,
                                        minHeight: '400px',
                                        background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e4ed 100%)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'zoom-in',
                                        marginTop: '10px',
                                        borderRadius: '0 0 16px 16px'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%', color: '#333' }}>
                                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                                    </div>
                                    <img
                                        src={currentPlan.image}
                                        alt={`${currentPlan.label} Floor Plan`}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Event Information */}
                        <div className="col-lg-5" data-aos="fade-left" data-aos-duration={800}>
                            <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', height: '100%', boxShadow: '0 15px 50px rgba(0,0,0,0.1)' }}>

                                <InfoItem
                                    iconBg="linear-gradient(135deg, #EA4335 0%, #c82333 100%)"
                                    iconClass="fa-solid fa-location-dot"
                                    title={t('map.venueName')}
                                    description={t('map.venueAddress')}
                                    descriptionStyle={{ paddingLeft: '60px', marginTop: '12px' }}
                                />

                                <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '20px 0' }} />

                                <InfoItem
                                    iconBg="linear-gradient(135deg, #3b5998 0%, #2d4373 100%)"
                                    iconClass="fa-regular fa-calendar"
                                    label={t('map.dateLabel')}
                                    value={currentPlan.fullDate}
                                />

                                <div style={{ marginBottom: '24px' }}></div>

                                <InfoItem
                                    iconBg="linear-gradient(135deg, #28a745 0%, #1e7e34 100%)"
                                    iconClass="fa-regular fa-clock"
                                    label={t('map.timeLabel')}
                                    value="8:00 AM - 5:00 PM"
                                />

                                <div style={{ marginBottom: '24px' }}></div>

                                <InfoItem
                                    iconBg="linear-gradient(135deg, #ffc107 0%, #e0a800 100%)"
                                    iconClass="fa-solid fa-stairs"
                                    label={t('map.floorLevelLabel')}
                                    value={t('map.floorLevel')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox / Modal */}
            {isLightboxOpen && (
                <div
                    onClick={() => setIsLightboxOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-out',
                        padding: '20px'
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '30px',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img
                        src={currentPlan.image}
                        alt="Full Screen Floor Plan"
                        style={{
                            maxWidth: '95%',
                            maxHeight: '95%',
                            objectFit: 'contain',
                            borderRadius: '5px',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }}
                    />
                </div>
            )}
        </>
    )
}

// Helper Component for Info Items
function InfoItem({ iconBg, iconClass, title, label, value, description, descriptionStyle }: any) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '48px', height: '48px', background: iconBg,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    <i className={iconClass} style={{ color: '#fff', fontSize: '20px' }} />
                </div>
                <div>
                    {title && <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>{title}</h4>}
                    {label && <p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>{label}</p>}
                    {value && <p style={{ margin: 0, fontWeight: '600', fontSize: '16px', color: '#1a1a2e' }}>{value}</p>}
                </div>
            </div>
            {description && (
                <p style={{ color: '#6c757d', fontSize: '15px', lineHeight: '1.6', margin: 0, ...descriptionStyle }}>
                    {description}
                </p>
            )}
        </div>
    );
}
