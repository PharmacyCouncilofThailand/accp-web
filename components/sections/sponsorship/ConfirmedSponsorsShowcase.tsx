'use client'

import { useTranslations } from 'next-intl'
import {
    FeaturedSponsorsRow,
    SponsorCategoriesList,
} from '@/components/sections/sponsorship/SponsorShowcaseParts'

export default function ConfirmedSponsorsShowcase() {
    const t = useTranslations('sponsorship')
    const tCommon = useTranslations('common')

    return (
        <section className="sponsors-showcase" aria-labelledby="sponsors-showcase-title">
            <div className="sponsors-showcase__ambient" aria-hidden="true" />

            <div className="container">
                <header className="sponsors-showcase__intro">
                    <span className="sponsors-showcase__eyebrow" data-aos="fade-up" data-aos-duration={600}>
                        {tCommon('sponsorship')}
                    </span>
                    <h2
                        id="sponsors-showcase-title"
                        className="sponsors-showcase__title"
                        data-aos="fade-up"
                        data-aos-duration={700}
                        data-aos-delay={80}
                    >
                        {t('currentSponsors')}
                    </h2>
                    <p
                        className="sponsors-showcase__lead"
                        data-aos="fade-up"
                        data-aos-duration={700}
                        data-aos-delay={140}
                    >
                        {t('confirmedSponsorsLead')}
                    </p>
                </header>

                <FeaturedSponsorsRow />
                <SponsorCategoriesList />
            </div>
        </section>
    )
}
