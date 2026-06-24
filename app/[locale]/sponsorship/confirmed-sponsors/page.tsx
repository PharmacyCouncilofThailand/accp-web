'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl';
import ConfirmedSponsorsShowcase from '@/components/sections/sponsorship/ConfirmedSponsorsShowcase';

export default function ConfirmedSponsors() {
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
                                    <h1>{t('confirmedSponsors')}</h1>
                                    <div className="space20" />
                                    <Link href={`/${locale}`}>{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{t('pageTitle')}</span> <i className="fa-solid fa-angle-right" /> <span>{t('confirmedSponsors')}</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space80" />
                <ConfirmedSponsorsShowcase />
                <div className="space80" />
            </div>
        </Layout>
    )
}
