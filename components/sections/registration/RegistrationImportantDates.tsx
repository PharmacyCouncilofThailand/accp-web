'use client'

import { useTranslations } from 'next-intl';
import styles from './RegistrationImportantDates.module.css';

type CardVariant = 'green' | 'red' | 'blue';

interface DateCardProps {
    variant: CardVariant;
    icon: string;
    label: string;
    date?: string;
}

function DateCard({ variant, icon, label, date }: DateCardProps) {
    const cardClass = {
        green: styles.cardGreen,
        red: styles.cardRed,
        blue: styles.cardBlue,
    }[variant];

    const iconClass = {
        green: styles.iconGreen,
        red: styles.iconRed,
        blue: styles.iconBlue,
    }[variant];

    const labelClass = {
        green: styles.labelGreen,
        red: styles.labelRed,
        blue: styles.labelBlue,
    }[variant];

    return (
        <div className={`${styles.card} ${cardClass}`}>
            <div className={styles.labelRow}>
                <i className={`${icon} ${styles.icon} ${iconClass}`} />
                <p className={`${styles.label} ${labelClass}`}>{label}</p>
            </div>
            {date && <h3 className={styles.dateText}>{date}</h3>}
        </div>
    );
}

export default function RegistrationImportantDates() {
    const t = useTranslations('registration');

    const cards: DateCardProps[] = [
        {
            variant: 'green',
            icon: 'fa-solid fa-calendar-check',
            label: t('earlyBird') + ': ' + t('saveUpTo'),
            date: t('dateRangeEarly'),
        },
        {
            variant: 'red',
            icon: 'fa-solid fa-calendar-xmark',
            label: t('regular') + ': ' + t('standardRates'),
            date: t('dateRangeRegular'),
        },
        {
            variant: 'blue',
            icon: 'fa-solid fa-envelope',
            label: t('registrationCloses') + ': ' + t('lastDay'),
            date: t('dateCloses'),
        },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <header className={styles.header}>
                    <p className={styles.headerSubtitle}>{t('importantDates')}</p>
                    <h2 className={styles.headerTitle}>{t('timeline')}</h2>
                </header>

                <div className={styles.cardsGrid}>
                    {cards.map((card, index) => (
                        <DateCard key={index} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
