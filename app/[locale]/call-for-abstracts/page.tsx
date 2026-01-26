'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useAuth } from '@/context/AuthContext'

import AbstractTimeline from "@/components/sections/abstracts/AbstractTimeline"
import AbstractTopicList from "@/components/sections/abstracts/AbstractTopicList"
import AbstractCallInstructions from "@/components/sections/abstracts/AbstractCallInstructions"
import CallSubmissionSteps from "@/components/sections/abstracts/CallSubmissionSteps"
import AbstractExample from "@/components/sections/abstracts/AbstractExample"

export default function CallForAbstracts() {
    const t = useTranslations('callForAbstracts')
    const tCommon = useTranslations('common')
    const { user, isAuthenticated } = useAuth()

    // Allow any authenticated user to submit abstracts
    const canSubmitAbstract = isAuthenticated;

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <div>
                    {/* Header */}
                    <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg16.png)' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading1 text-center">
                                        <h1 style={{ fontSize: '48px' }}>{t('pageTitle')}</h1>
                                        <div className="space30" />
                                        <Link href="/">{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{tCommon('callForAbstracts')}</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <AbstractTimeline />
                    <AbstractTopicList />
                    <AbstractCallInstructions />
                    <CallSubmissionSteps />
                    <AbstractExample>
                        {canSubmitAbstract && (
                            <div className="text-center mt-4">
                                <Link
                                    href="/abstract-submission"
                                    className="btn"
                                    style={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        color: 'white',
                                        padding: '15px 40px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        border: 'none',
                                        borderRadius: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        display: 'inline-block',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                                        marginTop: '20px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                                    }}
                                >
                                    {tCommon('submitAbstract')}
                                </Link>
                            </div>
                        )}
                    </AbstractExample>


                    
                </div>
            </Layout>
        </>
    )
}
