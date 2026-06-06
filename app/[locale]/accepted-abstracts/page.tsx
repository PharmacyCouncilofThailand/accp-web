'use client'

import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useLocale, useTranslations } from 'next-intl';
import AcceptedAbstractsDirectory from '@/components/sections/program/AcceptedAbstractsDirectory';

export default function AcceptedAbstractsPage() {
    const locale = useLocale();
    const tCommon = useTranslations('common');

    return (
        <Layout headerStyle={1} footerStyle={1}>
            <div>
                <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg5.png)' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 m-auto">
                                <div className="heading1 text-center">
                                    <h1>Accepted Abstracts</h1>
                                    <div className="space20" />
                                    <Link href={`/${locale}`}>
                                        {tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>Accepted Abstracts</span>
                                    </Link>
                                    <div className="space24" />
                                    <Link className="accepted-header-link" href={`/${locale}/program-oral-poster/presentation-guideline`}>
                                        <i className="fa-solid fa-file-lines" />
                                        Presentation Guidelines
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AcceptedAbstractsDirectory />
            </div>

            <style jsx>{`
                .accepted-header-link {
                    align-items: center;
                    background: rgba(255, 255, 255, 0.16);
                    border: 1px solid rgba(255, 255, 255, 0.34);
                    border-radius: 8px;
                    color: #ffffff;
                    display: inline-flex;
                    font-size: 14px;
                    font-weight: 800;
                    gap: 9px;
                    padding: 11px 16px;
                    text-decoration: none;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                }

                .accepted-header-link:hover {
                    background: rgba(255, 255, 255, 0.24);
                    color: #ffffff;
                    transform: translateY(-1px);
                }
            `}</style>
        </Layout>
    )
}
