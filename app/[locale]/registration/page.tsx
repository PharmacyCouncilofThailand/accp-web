'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { api, TicketType } from '@/lib/api';
import { useEffect, useState } from 'react';
import RegistrationImportantDates from '@/components/sections/registration/RegistrationImportantDates';
import RegistrationInternationalFees from '@/components/sections/registration/RegistrationInternationalFees';
import RegistrationThaiFees from '@/components/sections/registration/RegistrationThaiFees';

export default function Registration() {
    const t = useTranslations('registration');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const { user, isAuthenticated } = useAuth();
    const [tickets, setTickets] = useState<TicketType[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.tickets.list();
                setTickets(response.tickets);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    // Determine which pricing to show based on user role
    const isThai = user?.isThai === true;
    const isStudent = user?.delegateType === 'thai_student' || user?.delegateType === 'international_student';

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <div>
                    {/* Header */}
                    <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg16.png)' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9 m-auto">
                                    <div className="heading1 text-center">
                                        <h1>{t('pageTitle')}</h1>
                                        <div className="space20" />
                                        <Link href={`/${locale}`}>{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>{t('pageTitle')}</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <RegistrationImportantDates />



                    {/* Show pricing based on user nationality */}
                    {isAuthenticated && user ? (
                        // Logged in: Show only relevant pricing
                        isThai ? (
                            <RegistrationThaiFees tickets={tickets} />
                        ) : (
                            <RegistrationInternationalFees tickets={tickets} />
                        )
                    ) : (
                        // Not logged in: Show both pricing sections
                        <>
                            <RegistrationInternationalFees tickets={tickets} />
                            <RegistrationThaiFees tickets={tickets} />
                        </>
                    )}

                </div>
            </Layout>
        </>
    )
}
