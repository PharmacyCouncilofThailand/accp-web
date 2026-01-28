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
                {/* Header */}
                <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 m-auto">
                                <div className="heading1 text-center">
                                    <h1>{t('exhibitionFloorPlan')}</h1>
                                    <div className="space20" />
                                    <Link href="/">{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{tCommon('sponsorship')}</span> <i className="fa-solid fa-angle-right" /> <span>{t('exhibitionFloorPlan')}</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="about1-section-area sp1">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 m-auto">
                                <div>
                                    <div className="text-center mb-5" style={{
                                        background: 'linear-gradient(90deg, #6c5cea 0%, #8979f2 100%)',
                                        padding: '50px 30px',
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 30px rgba(108, 92, 234, 0.2)'
                                    }}>

                                        <h3 className="mb-4" style={{ color: '#fff' }}>Download Exhibition Floor Plan</h3>

                                        <a
                                            href="/assets/img/Venue Floor Plan/Centara Grand _ Bangkok Convention Centre at CentralWorld - Floor Plan WorldBallroom.jpg"
                                            download="Centara Grand - Floor Plan WorldBallroom.jpg"
                                            className="hover-scale"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '16px 32px',
                                                background: '#fff',
                                                color: '#6c5cea',
                                                borderRadius: '50px',
                                                fontWeight: '700',
                                                fontSize: '16px',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-3px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <i className="fa-solid fa-download"></i>
                                            Download Exhibition Floor Plan
                                        </a>
                                    </div>

                                    <div className="space30" />
                                    <div style={{ height: '1px', background: '#e5e7eb', margin: '0 0 40px 0' }} />

                                    {/* Sponsor Section */}
                                    <div className="text-center" style={{
                                        background: 'linear-gradient(90deg, #6c5cea 0%, #8979f2 100%)',
                                        padding: '50px 30px',
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 30px rgba(108, 92, 234, 0.2)'
                                    }}>
                                        <h2 className="mb-2" style={{ color: '#fff' }}>Become a Sponsor</h2>
                                        <div className="mb-4 text-white" style={{ color: '#fff', opacity: 1 }}>Partner with ACCP 2026</div>

                                        <div className="d-flex justify-content-center flex-column align-items-center">
                                            <a
                                                href="mailto:accpbangkok2026@gmail.com"
                                                className="hover-scale"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '16px 32px',
                                                    background: '#fff',
                                                    color: '#6c5cea',
                                                    borderRadius: '50px',
                                                    fontWeight: '700',
                                                    fontSize: '16px',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                                }}
                                            >
                                                <i className="fa-solid fa-envelope"></i>
                                                Contact Us for Sponsorship
                                            </a>

                                            <a href="mailto:accpbangkok2026@gmail.com" className="mt-3" style={{ textDecoration: 'underline', color: '#fff' }}>
                                                accpbangkok2026@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
