'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl';
import AcceptedAbstractsDirectory from '@/components/sections/program/AcceptedAbstractsDirectory';
import PresentationScheduleDownloads from '@/components/sections/program/PresentationScheduleDownloads';

export default function OralPoster() {
    const tCommon = useTranslations('common');
    const tProgram = useTranslations('program');
    const tOralPoster = useTranslations('oralPoster');
    const locale = useLocale();

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <div>
                    {/* Hero Header */}
                    <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6 m-auto">
                                    <div className="heading1 text-center">
                                        <h1>{tOralPoster('pageTitle')}</h1>
                                        <div className="space20" />
                                        <Link href={`/${locale}`}>{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{tProgram('pageTitle')}</span> <i className="fa-solid fa-angle-right" /> <span>{tOralPoster('pageTitle')}</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PresentationScheduleDownloads />
                    <AcceptedAbstractsDirectory scheduledOnly />
                </div>
            </Layout>
        </>
    )
}
