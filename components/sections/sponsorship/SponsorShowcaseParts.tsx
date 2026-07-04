'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
    featuredSponsors,
    sponsorCategories,
    type Sponsor,
    type SponsorCategory,
} from '@/data/sponsorshipData'

export const sponsorCategoryMeta: Record<
    SponsorCategory['id'],
    { icon: string; columns: string }
> = {
    universities: { icon: 'fa-graduation-cap', columns: 'sponsors-showcase__grid--3' },
    pharmaceutical: { icon: 'fa-capsules', columns: 'sponsors-showcase__grid--4' },
    associations: { icon: 'fa-handshake', columns: 'sponsors-showcase__grid--3' },
}

export function SponsorLogoItem({
    sponsor,
    index,
    featured = false,
}: {
    sponsor: Sponsor
    index: number
    featured?: boolean
}) {
    return (
        <div
            className={featured ? 'sponsors-showcase__featured-logo' : 'sponsors-showcase__logo'}
            data-aos="fade-up"
            data-aos-duration={700}
            data-aos-delay={Math.min(index * 60, 360)}
            title={sponsor.name}
        >
            <div
                className={
                    featured
                        ? 'sponsors-showcase__featured-logo-frame'
                        : 'sponsors-showcase__logo-frame'
                }
            >
                <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={featured ? 240 : 220}
                    height={featured ? 88 : 76}
                    sizes={
                        featured
                            ? '(max-width: 576px) 80vw, (max-width: 992px) 40vw, 240px'
                            : '(max-width: 576px) 44vw, (max-width: 992px) 28vw, 220px'
                    }
                    className={
                        featured
                            ? 'sponsors-showcase__featured-logo-img'
                            : 'sponsors-showcase__logo-img'
                    }
                />
            </div>
        </div>
    )
}

export function SponsorCategoryBlock({
    category,
    sectionIndex,
}: {
    category: SponsorCategory
    sectionIndex: number
}) {
    const t = useTranslations('sponsorship')
    const meta = sponsorCategoryMeta[category.id]

    return (
        <article
            className={`sponsors-showcase__category sponsors-showcase__category--${category.id}`}
            data-aos="fade-up"
            data-aos-duration={800}
            data-aos-delay={sectionIndex * 100}
        >
            <div className="sponsors-showcase__category-header">
                <div className="sponsors-showcase__category-title-wrap">
                    <span className="sponsors-showcase__category-icon" aria-hidden="true">
                        <i className={`fa-solid ${meta.icon}`} />
                    </span>
                    <h3 className="sponsors-showcase__category-title">{t(category.titleKey)}</h3>
                </div>
                <div className="sponsors-showcase__category-rule" aria-hidden="true" />
            </div>

            <div className={`sponsors-showcase__grid ${meta.columns}`}>
                {category.sponsors.map((sponsor, index) => (
                    <SponsorLogoItem
                        key={`${category.id}-${sponsor.name}`}
                        sponsor={sponsor}
                        index={index}
                    />
                ))}
            </div>
        </article>
    )
}

export function FeaturedSponsorsRow() {
    return (
        <div
            className="sponsors-showcase__featured"
            data-aos="fade-up"
            data-aos-duration={800}
        >
            {featuredSponsors.map((sponsor, index) => (
                <SponsorLogoItem
                    key={sponsor.name}
                    sponsor={sponsor}
                    index={index}
                    featured
                />
            ))}
        </div>
    )
}

export function SponsorCategoriesList() {
    return (
        <div className="sponsors-showcase__categories">
            {sponsorCategories.map((category, sectionIndex) => (
                <SponsorCategoryBlock
                    key={category.id}
                    category={category}
                    sectionIndex={sectionIndex}
                />
            ))}
        </div>
    )
}
