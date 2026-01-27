'use client'
import { useTranslations } from 'next-intl';
import React from 'react';

const welcomeStyles = {
    section: {
        background: '#f8f9fa',
        padding: '80px 0'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a237e',
        textTransform: 'uppercase' as const,
        letterSpacing: '2px'
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px 25px 35px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        textAlign: 'center' as const,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        height: '100%'
    },
    cardName: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#1a237e',
        marginBottom: '16px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.3'
    },
    imageContainer: {
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgb(26, 35, 126) 0%, rgb(57, 73, 171) 100%)',
        padding: '5px',
        margin: '0 auto 40px',
        position: 'relative' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'rgb(255, 255, 255)'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        objectPosition: 'center 28%'
    },
    roleBadge: {
        position: 'absolute' as const,
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFC107',
        color: '#1a237e',
        padding: '8px 24px',
        borderRadius: '30px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap' as const,
        zIndex: 2
    },
    // Removed roleTitle as it will be in the badge
    rolePosition: {
        fontSize: '14px',
        color: '#666666',
        margin: 0,
        lineHeight: '1.5'
    }
} as const;

export default function WelcomeSection() {
    const t = useTranslations();

    const organizers = [
        {
            name: "Prof. Dr. Suwimol Sapcharoen",
            nameTh: "ศ.ดร.สุวิมล ทรัพย์เจริญ",
            titleKey: 'welcome.hostOrg',
            position: "President, Thai Clinical Pharmacy Association",
            positionTh: "นายกสมาคมเภสัชกรรมคลินิกไทย",
            image: "/assets/img/all-images/team/team-img1.jpg"
        },
        {
            name: "Prof. Dr. Kenji Yamamoto",
            nameTh: "ศ.ดร.เคนจิ ยามาโมโตะ",
            titleKey: 'welcome.accpPresident',
            position: "President, Asian Conference on Clinical Pharmacy",
            positionTh: "ประธานการประชุมเภสัชกรรมคลินิกแห่งเอเชีย",
            image: "/assets/img/all-images/team/team-img2.png"
        },
        {
            name: "Assoc. Prof. Dr. Nattiya Kapol",
            nameTh: "รศ.ดร.ณัฏฐิยา คาพล",
            titleKey: 'welcome.organizingChair',
            position: "Chair, ACCP 2026 Organizing Committee",
            positionTh: "ประธานคณะกรรมการจัดงาน ACCP 2026",
            image: "/assets/img/all-images/team/team-img3.jpg"
        },
        {
            name: "Committee Member 4",
            nameTh: "กรรมการท่านที่ 4",
            titleKey: 'welcome.committeeMember',
            position: "Organization TBA",
            positionTh: "องค์กร TBA",
            image: "/assets/img/all-images/team/team-img1.jpg" // Using img1 as placeholder
        }
    ];

    return (
        <div className="welcome-section-area sp1" style={welcomeStyles.section}>
            <div className="container">
                {/* Header */}
                <div className="text-center mb-5">
                    <h2 style={welcomeStyles.title} data-aos="fade-up">{t('welcome.title')}</h2>
                </div>

                {/* Profile Cards */}
                <div className="row justify-content-center g-4">
                    {organizers.map((person, index) => (
                        <div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div style={welcomeStyles.card}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                                }}>
                                {/* Photo & Badge */}
                                <div style={welcomeStyles.imageContainer}>
                                    <div style={welcomeStyles.imageWrapper}>
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            style={welcomeStyles.image}
                                        />
                                    </div>
                                    <div style={welcomeStyles.roleBadge}>
                                        {t(person.titleKey)}
                                    </div>
                                </div>

                                {/* Name */}
                                <h4 style={welcomeStyles.cardName}>{person.name}</h4>

                                {/* Position */}
                                <p style={welcomeStyles.rolePosition}>{person.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
