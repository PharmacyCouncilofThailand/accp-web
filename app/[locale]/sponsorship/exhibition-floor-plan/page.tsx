'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl';

export default function ExhibitionFloorPlan() {
    const tCommon = useTranslations('common');
    const t = useTranslations('sponsorship');
    const locale = useLocale();

    return (
        <Layout headerStyle={1} footerStyle={1}>
            <div>
                <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 m-auto">
                                <div className="heading1 text-center">
                                    <h1>{t('exhibitionFloorPlan')}</h1>
                                    <div className="space20" />
                                    <Link href={`/${locale}`}>{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{t('pageTitle')}</span> <i className="fa-solid fa-angle-right" /> <span>{t('exhibitionFloorPlan')}</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space100" />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 m-auto text-center">
                            <div style={{ 
                                padding: '60px', 
                                background: '#f8f9fa', 
                                borderRadius: '16px',
                                border: '2px dashed #e0e0e0'
                            }}>
                                <i className="fa-solid fa-map-location-dot" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
                                <h3 style={{ color: '#666' }}>Coming Soon</h3>
                                <p style={{ color: '#999' }}>Waiting for floor plan from BCP team</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space100" />
            </div>
        </Layout>
    )
}
