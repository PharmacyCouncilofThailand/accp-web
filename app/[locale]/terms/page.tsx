'use client';

import Layout from "@/components/layout/Layout";
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('registration');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    return (
        <Layout headerStyle={1} footerStyle={1}>
            {/* Header */}
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg16.png)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 m-auto">
                            <div className="heading1 text-center">
                                <h1>Terms of Service</h1>
                                <div className="space20" />
                                <Link href={`/${locale}`}>{tCommon('home')} <i className="fa-solid fa-angle-right" /> <span>Terms of Service</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="sp1" style={{ backgroundColor: '#f9f9f9' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 m-auto">
                            <div className="terms-content" style={{
                                backgroundColor: '#fff',
                                padding: '50px',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                            }}>
                                <div className="heading2 text-center mb-5">
                                    <h5>ACCP 2026</h5>
                                    <div className="space10" />
                                    <h2>Terms & Conditions</h2>
                                    <div className="space20" />
                                    <p className="mx-auto" style={{ maxWidth: '700px', fontSize: '16px', color: '#555', lineHeight: '1.6' }}>
                                        By accessing or using the ACCP2026 website (“Website”), operated by the College of Pharmacotherapy under the Royal College of Pharmacists of Thailand and the Pharmacy Council of Thailand (“ACCP2026 Organizers”), users agree to the following terms:
                                    </p>
                                </div>

                                <div className="space30" />
                                <div style={{ borderBottom: '1px solid #eee' }} />
                                <div className="space30" />

                                <div className="terms-list">
                                    <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                                        {[
                                            {
                                                title: "Registration & Account Security",
                                                content: "Users must register an account and provide accurate, complete, and up-to-date information. By registering, users confirm that they have the legal capacity to use the Website and its services. Users are responsible for maintaining the confidentiality of their login credentials and for all activities conducted under their account."
                                            },
                                            {
                                                title: "Lawful Use",
                                                content: "The Website shall be used solely for lawful purposes and in compliance with applicable laws, regulations, and standards of professional and ethical conduct."
                                            },
                                            {
                                                title: "Conference Services & Fees",
                                                content: "Certain services, programs, or conference activities may require additional registration steps, specific terms, and payment of applicable fees, which users agree to comply with."
                                            },
                                            {
                                                title: "Data Privacy",
                                                content: "The ACCP2026 Organizers may collect, use, and disclose personal data for purposes including service delivery, conference management, research and analysis, communications, and compliance with applicable laws, in accordance with relevant data protection regulations."
                                            },
                                            {
                                                title: "Modifications & Termination",
                                                content: "The ACCP2026 Organizers reserve the right to amend these Terms of Service and to suspend, restrict, or terminate access to the Website in the event of non-compliance."
                                            },
                                            {
                                                title: "Disclaimer of Liability",
                                                content: "The Website is provided on an “as is” basis. The ACCP2026 Organizers shall not be liable for any delays, interruptions, or technical issues arising from the use of the Website."
                                            },
                                            {
                                                title: "Intellectual Property",
                                                content: "All content on the Website, including text, logos, and materials, is the intellectual property of the ACCP2026 Organizers or authorized third parties and may not be used without prior permission."
                                            },
                                            {
                                                title: "Governing Law",
                                                content: "These Terms of Service shall be governed by and construed in accordance with the laws of Thailand."
                                            }
                                        ].map((item, index) => (
                                            <li key={index} style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                                                <strong style={{ color: '#111' }}>{item.title}:</strong> {item.content}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
