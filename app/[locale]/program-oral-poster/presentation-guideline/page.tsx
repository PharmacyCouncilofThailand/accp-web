'use client'

import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useLocale, useTranslations } from 'next-intl';
import PresentationGuidelines from '@/components/sections/program/PresentationGuidelines';

export default function PresentationGuidelinePage() {
    const locale = useLocale();
    const tCommon = useTranslations('common');
    const tProgram = useTranslations('program');
    const tOralPoster = useTranslations('oralPoster');

    return (
        <Layout headerStyle={1} footerStyle={1}>
            <div>
                <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 m-auto">
                                <div className="heading1 text-center">
                                    <h1>Presentation Guideline</h1>
                                    <div className="space20" />
                                    <Link href={`/${locale}`}>
                                        {tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{tProgram('pageTitle')}</span> <i className="fa-solid fa-angle-right" /> <span>{tOralPoster('pageTitle')}</span> <i className="fa-solid fa-angle-right" /> <span>Presentation Guideline</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <PresentationGuidelines />
            </div>
        </Layout>
    )
}
