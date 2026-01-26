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

    // Optimize: Find hotel once instead of filtering on every render
    const centaraHotel = useMemo(
        () => hotels.find(h => h.name === 'Centara Grand & Bangkok Convention Centre at CentralWorld'),
        []
    )

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

                    {/* Intro & Hotel */}
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
                                    </div>
                                    <div className="space40" />
                                    {centaraHotel && <HotelCard hotel={centaraHotel} />}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </Layout>
        </>
    )
}
