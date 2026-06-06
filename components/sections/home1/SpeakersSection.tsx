'use client'
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper as SwiperOriginal, SwiperSlide as SwiperSlideOriginal } from "swiper/react"
import { plenarySpeakers } from '@/data/plenarySpeakersData';

const Swiper = SwiperOriginal as any;
const SwiperSlide = SwiperSlideOriginal as any;

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 3,
    spaceBetween: 30,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    loop: true,
    navigation: {
        nextEl: '.owl-next',
        prevEl: '.owl-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 30 },
        575: { slidesPerView: 2, spaceBetween: 30 },
        767: { slidesPerView: 2, spaceBetween: 30 },
        991: { slidesPerView: 2, spaceBetween: 30 },
        1199: { slidesPerView: 3, spaceBetween: 30 },
        1350: { slidesPerView: 3, spaceBetween: 30 },
    }
}

export default function SpeakersSection() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <>
            <div className="team1-section-area sp1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="team-header space-margin60 heading2">
                                <h5 data-aos="fade-left" data-aos-duration={800}>{t('speakers.title')}</h5>
                                <div className="space16" />
                                <h2 className="text-anime-style-3">{t('speakers.subtitle')}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 position-relative">
                            <Swiper {...swiperOptions} className="team-slider-area">
                                {[...plenarySpeakers, ...plenarySpeakers].map((speaker, index) => (
                                    <SwiperSlide key={`${speaker.id}-${index}`} className="team-widget-boxarea">
                                        <div className="img1 image-anime">
                                            <img
                                                src={speaker.image}
                                                alt={speaker.name}
                                                loading="lazy"
                                                width={400}
                                                height={400}
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1 / 1',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    objectPosition: 'top center',
                                                    borderRadius: '10px',
                                                    background: '#07123c'
                                                }}
                                            />

                                        </div>
                                        <div className="space22" />
                                        <div
                                            className="text-area"
                                            style={{
                                                minHeight: '150px',
                                                padding: '0 12px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <p style={{
                                                color: '#7C3AED',
                                                fontSize: '12px',
                                                fontWeight: 800,
                                                letterSpacing: '0.8px',
                                                marginBottom: '8px',
                                                textTransform: 'uppercase',
                                            }}>
                                                {speaker.sessions[0]?.role || 'Speaker'}
                                            </p>
                                            <Link
                                                href={`/${locale}/program-plenary`}
                                                style={{
                                                    color: '#171717',
                                                    display: 'block',
                                                    fontSize: '23px',
                                                    fontWeight: 800,
                                                    lineHeight: 1.22,
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                {speaker.name}
                                            </Link>
                                            <p style={{
                                                color: '#4b5563',
                                                fontSize: '14px',
                                                lineHeight: 1.42,
                                                margin: '0 auto 12px',
                                                maxWidth: '360px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {speaker.positions[0]}
                                            </p>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '8px 14px',
                                                justifyContent: 'center',
                                                color: '#64748b',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                            }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <i className="fa-regular fa-calendar" />
                                                    {speaker.sessions[0]?.day}
                                                </span>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <i className="fa-solid fa-microphone" />
                                                    {speaker.sessions[0]?.title}
                                                </span>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className="owl-nav">
                                <button type="button" role="presentation" className="owl-prev h1p">
                                    <i className="fa-solid fa-angle-left" />
                                </button>
                                <button type="button" role="presentation" className="owl-next h1n">
                                    <i className="fa-solid fa-angle-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

