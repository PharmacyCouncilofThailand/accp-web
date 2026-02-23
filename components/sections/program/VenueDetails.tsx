'use client'

import { useTranslations } from 'next-intl';
import styles from './VenueDetails.module.css';

type CardVariant = 'pink' | 'blue' | 'yellow';

interface VenueCardProps {
    variant: CardVariant;
    icon: string;
    title: string;
    content: React.ReactNode;
}

function VenueCard({ variant, icon, title, content }: VenueCardProps) {
    const cardClass = {
        pink: styles.cardPink,
        blue: styles.cardBlue,
        yellow: styles.cardYellow,
    }[variant];

    const iconClass = {
        pink: styles.iconPink,
        blue: styles.iconBlue,
        yellow: styles.iconYellow,
    }[variant];

    const titleClass = {
        pink: styles.titlePink,
        blue: styles.titleBlue,
        yellow: styles.titleYellow,
    }[variant];

    return (
        <div className={`${styles.card} ${cardClass}`}>
            <div className={`${styles.iconWrapper} ${iconClass}`}>
                <i className={icon} />
            </div>
            <h4 className={`${styles.cardTitle} ${titleClass}`}>{title}</h4>
            <div className={styles.cardText}>{content}</div>
        </div>
    );
}

interface VenueDetailsProps {
    ticketPrice: string;
}

export default function VenueDetails({ ticketPrice }: VenueDetailsProps) {
    const t = useTranslations('galaDinner');

    const venueCards: VenueCardProps[] = [
        {
            variant: 'pink',
            icon: 'fa-solid fa-location-dot',
            title: t('location'),
            content: <span dangerouslySetInnerHTML={{ __html: t.raw('locationDesc') }} />,
        },
        {
            variant: 'blue',
            icon: 'fa-solid fa-shirt',
            title: t('dressCode'),
            content: t('dressCodeDesc'),
        },
        {
            variant: 'yellow',
            icon: 'fa-solid fa-ticket',
            title: `${t('ticketPrice')} (July 10, 2026)`,
            content: (
                <ul style={{ paddingLeft: '20px', margin: 0, textAlign: 'left', lineHeight: '1.6' }}>
                    <li>Healthcare professional: 75 USD per person</li>
                    <li>Thai Healthcare professional: 2,200 THB per person</li>
                </ul>
            ),
        },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <header className={styles.header}>
                    <span className={styles.badge}>{t('venueDetails')}</span>
                    <h2 className={styles.title}>{t('grandBallroom')}</h2>
                    <div className={styles.divider} />
                </header>

                <div className={styles.cardsGrid}>
                    {venueCards.map((card, index) => (
                        <VenueCard key={index} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
