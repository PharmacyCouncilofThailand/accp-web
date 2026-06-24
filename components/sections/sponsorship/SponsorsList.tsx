'use client'

import { useTranslations } from 'next-intl'
import {
    FeaturedSponsorsRow,
    SponsorCategoriesList,
} from '@/components/sections/sponsorship/SponsorShowcaseParts'

export default function SponsorsList() {
    const t = useTranslations('sponsorship')
    const tCommon = useTranslations('common')

    return (
        <section
            className="brands1-section-area sponsors-showcase sponsors-showcase--home sp2"
            aria-labelledby="home-sponsors-title"
        >
            <div className="sponsors-showcase__ambient" aria-hidden="true" />

            <div className="container">
                <div className="row">
                    <div className="col-lg-6 m-auto">
                        <div className="brand-header heading2 space-margin60 text-center">
                            <h5 data-aos="fade-left" data-aos-duration={800}>
                                {tCommon('sponsorship')}
                            </h5>
                            <div className="space16" />
                            <h2
                                id="home-sponsors-title"
                                className="text-anime-style-3"
                                data-aos="fade-up"
                                data-aos-duration={700}
                            >
                                {t('currentSponsors')}
                            </h2>
                        </div>
                    </div>
                </div>

                <FeaturedSponsorsRow />
                <SponsorCategoriesList />
            </div>
        </section>
    )
}
