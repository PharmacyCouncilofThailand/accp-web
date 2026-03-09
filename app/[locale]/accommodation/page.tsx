'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { hotels } from "@/data/hotelData"
import HotelCard from "@/components/sections/accommodation/HotelCard"

export default function Accommodation() {
    const t = useTranslations('accommodation')
    const tCommon = useTranslations('common')

    const { conferenceHotel, partnerHotels, nearbyHotels } = useMemo(() => {
        const conference = hotels.find(h => h.section === 'conference');
        const partners = hotels.filter(h => h.section === 'partner');
        const nearby = hotels.filter(h => h.section === 'nearby');
        return { conferenceHotel: conference, partnerHotels: partners, nearbyHotels: nearby };
    }, []);

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <div>
                    {/* Header */}
                    <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading1 text-center">
                                        <h1>{t('pageTitle')}</h1>
                                        <div className="space20" />
                                        <Link href="/">{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{tCommon('travelAccommodation')}</span> <i className="fa-solid fa-angle-right" /> <span>{tCommon('hotelsRates')}</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intro & Official Hotel */}
                    <div className="about1-section-area sp1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading2 text-center space-margin60">
                                        <h5 data-aos="fade-up" data-aos-duration={800}>{t('subtitle')}</h5>
                                        <div className="space16" />
                                        <h2 className="text-anime-style-3">{t('partnerHotels')}</h2>
                                        <div className="space16" />
                                        <p data-aos="fade-up" data-aos-duration={1000}>
                                            {t('introDesc')}
                                        </p>
                                        <div className="space16" />
                                        <a
                                            href="/assets/img/Hotels %26 Rates/List of hotel/List of hotels.pdf"
                                            download="List of hotels.pdf"
                                            className="btn"
                                            data-aos="fade-up"
                                            data-aos-duration={1200}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                backgroundColor: '#FFBA00',
                                                color: '#1a1a2e',
                                                padding: '14px 32px',
                                                borderRadius: '50px',
                                                fontWeight: 600,
                                                fontSize: '15px',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(255, 186, 0, 0.3)',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#e5a800';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 186, 0, 0.45)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FFBA00';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 186, 0, 0.3)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <i className="fa-solid fa-download" />
                                            {t('downloadRates')}
                                        </a>
                                    </div>
                                    <div className="space40" />
                                    {conferenceHotel && <HotelCard hotel={conferenceHotel} />}
                                    {partnerHotels.map((hotel, index) => (
                                        <HotelCard key={`partner-${index}`} hotel={hotel} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nearby Hotels */}
                    <div className="about1-section-area sp1" style={{ paddingTop: 0 }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading2 text-center space-margin60">
                                        <h2 className="text-anime-style-3">{t('nearbyHotels')}</h2>
                                    </div>
                                    <div className="space40" />
                                    {nearbyHotels.map((hotel, index) => (
                                        <HotelCard key={index} hotel={hotel} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Layout>
        </>
    )
}
