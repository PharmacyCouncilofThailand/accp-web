'use client'

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type CardVariant = 'green' | 'red' | 'blue';

interface DateCardProps {
    variant: CardVariant;
    icon: string;
    label: string;
    date?: string;
}

function DateCard({ variant, icon, label, date }: DateCardProps) {
    const colorConfig = {
        green: {
            bgColor: '#e8f5e9',
            borderColor: '#4caf50',
            iconColor: '#4caf50',
            labelColor: '#2e7d32',
            dateColor: '#1b5e20'
        },
        red: {
            bgColor: '#ffebee',
            borderColor: '#f44336',
            iconColor: '#f44336',
            labelColor: '#c62828',
            dateColor: '#b71c1c'
        },
        blue: {
            bgColor: '#e3f2fd',
            borderColor: '#2196f3',
            iconColor: '#2196f3',
            labelColor: '#1565c0',
            dateColor: '#0d47a1'
        }
    }[variant];

    // Pulse animation for green (Early Bird)
    const pulseStyle = variant === 'green' ? {
        animation: 'pulse 2s infinite ease-in-out'
    } : {};

    return (
        <div style={{
            backgroundColor: colorConfig.bgColor,
            padding: '25px',
            borderRadius: '12px',
            borderLeft: `5px solid ${colorConfig.borderColor}`,
            height: '100%',
            ...pulseStyle
        }}>
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7), 0 4px 15px rgba(76, 175, 80, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 15px rgba(76, 175, 80, 0), 0 8px 25px rgba(76, 175, 80, 0.5);
                    }
                }
            `}</style>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <i className={`fa-solid ${icon}`} style={{ color: colorConfig.iconColor, marginRight: '10px', fontSize: '20px' }} />
                <span style={{ color: colorConfig.labelColor, fontWeight: '600' }}>{label}</span>
            </div>
            {date && <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: colorConfig.dateColor }}>{date}</p>}
        </div>
    );
}

export default function RegistrationImportantDates() {
    const t = useTranslations('registration');

    const cards = useMemo(() => [
        {
            variant: 'green' as CardVariant,
            icon: 'fa-calendar-check',
            label: t('earlyBird') + ': ' + t('saveUpTo'),
            date: t('dateRangeEarly'),
        },
        {
            variant: 'red' as CardVariant,
            icon: 'fa-calendar-xmark',
            label: t('regular') + ': ' + t('standardRates'),
            date: t('dateRangeRegular'),
        },
        {
            variant: 'blue' as CardVariant,
            icon: 'fa-envelope',
            label: t('registrationCloses') + ': ' + t('lastDay'),
            date: t('dateCloses'),
        },
    ], [t]);

    return (
        <section style={{ padding: '60px 0', backgroundColor: '#ffffff' }}>
            <div className="container">
                <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{ fontSize: '1rem', color: '#667eea', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{t('importantDates')}</p>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{t('timeline')}</h2>
                </header>

                <div className="row">
                    {cards.map((card, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <DateCard {...card} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
