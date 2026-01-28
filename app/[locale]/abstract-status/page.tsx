'use client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Hourglass } from 'react-loader-spinner';
import Layout from '@/components/layout/Layout';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'accepted':
            return '#00C853';
        case 'rejected':
            return '#D32F2F';
        case 'pending':
        default:
            return '#FF9800';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'fa-circle-check';
        case 'underReview':
            return 'fa-clock';
        case 'rejected':
            return 'fa-circle-xmark';
        default:
            return 'fa-circle';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function AbstractStatus() {
    const t = useTranslations('abstracts');
    const tUser = useTranslations('userProfile');
    const { user } = useAuth();
    
    const [abstracts, setAbstracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAbstract, setSelectedAbstract] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAbstracts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${API_URL}/api/abstracts/user`, {
                    credentials: 'include',
                    headers: {
                        'x-user-email': user.email,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch abstracts');
                }

                const data = await response.json();

                setAbstracts(data.abstracts || []);
            } catch (err) {
                console.error('Error fetching abstracts:', err);
                setError('Failed to load abstracts');
            } finally {
                setLoading(false);
            }
        };

        fetchAbstracts();
    }, [user]);

    // Calculate summary stats
    const { totalSubmitted, acceptedCount, underReviewCount } = useMemo(() => {
        return {
            totalSubmitted: abstracts.length,
            acceptedCount: abstracts.filter(a => a.status === 'accepted').length,
            underReviewCount: abstracts.filter(a => a.status === 'pending').length
        };
    }, [abstracts]);

    return (
        <Layout headerStyle={1} footerStyle={1} headerBgWhite={true}>
            <div className="abstract-page-container">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                        borderRadius: '20px',
                        padding: '40px',
                        marginBottom: '32px',
                        boxShadow: '0 10px 40px rgba(26, 35, 126, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '24px'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'rgba(255, 186, 0, 0.2)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-file-lines" style={{ color: '#FFBA00', fontSize: '24px' }} />
                                </div>
                                <h1 style={{ 
                                    fontSize: '32px', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    margin: 0
                                }}>
                                    {t('pageTitle')}
                                </h1>
                            </div>
                            <p style={{ 
                                color: 'rgba(255, 255, 255, 0.9)', 
                                fontSize: '16px',
                                margin: 0,
                                maxWidth: '600px'
                            }}>
                                {t('pageDescription')}
                            </p>
                        </div>

                        <Link
                            href="/call-for-abstracts"
                            style={{
                                background: '#00C853',
                                color: 'white',
                                padding: '14px 28px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 20px rgba(0, 200, 83, 0.3)',
                                transition: 'all 0.3s ease',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 200, 83, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 200, 83, 0.3)';
                            }}
                        >
                            <i className="fa-solid fa-plus" />
                            {t('submitNew')}
                        </Link>
                    </div>

                    {/* Summary Cards */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                            borderRadius: '16px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(26, 35, 126, 0.1)',
                            border: '1px solid rgba(26, 35, 126, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(26, 35, 126, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 35, 126, 0.1)';
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#5c6bc0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {t('totalSubmitted')}
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(92, 107, 192, 0.2)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-file-lines" style={{ color: '#1a237e', fontSize: '18px' }} />
                                </div>
                            </div>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#1a237e', lineHeight: '1' }}>
                                {totalSubmitted}
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                            borderRadius: '16px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(0, 200, 83, 0.1)',
                            border: '1px solid rgba(0, 200, 83, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 200, 83, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 200, 83, 0.1)';
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#66bb6a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {t('accepted')}
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(102, 187, 106, 0.2)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-circle-check" style={{ color: '#00C853', fontSize: '18px' }} />
                                </div>
                            </div>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#00C853', lineHeight: '1' }}>
                                {acceptedCount}
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                            borderRadius: '16px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)',
                            border: '1px solid rgba(255, 152, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 152, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 152, 0, 0.1)';
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffa726', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {t('underReview')}
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(255, 167, 38, 0.2)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-clock" style={{ color: '#FF9800', fontSize: '18px' }} />
                                </div>
                            </div>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#FF9800', lineHeight: '1' }}>
                                {underReviewCount}
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
                            <Hourglass
                                visible={true}
                                height="60"
                                width="60"
                                ariaLabel="hourglass-loading"
                                colors={['#1a237e', '#FFBA00']}
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && abstracts.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: '#f5f5f5',
                            borderRadius: '12px',
                            marginTop: '24px'
                        }}>
                            <i className="fa-solid fa-inbox" style={{ fontSize: '64px', color: '#bdbdbd', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                                {t('emptyState.title')}
                            </h3>
                            <p style={{ color: '#999', marginBottom: '24px' }}>
                                {t('emptyState.message')}
                            </p>
                            <Link href="/abstract-submission" className="abstract-primary-button">
                                <i className="fa-solid fa-plus" />
                                {t('emptyState.submitButton')}
                            </Link>
                        </div>
                    )}

                    {/* Abstract List */}
                    {!loading && abstracts.map((abstract) => {
                        const statusColor = getStatusColor(abstract.status);
                        return (
                        <div key={abstract.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '0',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: `2px solid ${statusColor}20`,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                        }}>
                            {/* Decorative gradient bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '5px',
                                background: `linear-gradient(90deg, ${statusColor} 0%, ${statusColor}cc 100%)`
                            }} />

                            {/* Status Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: statusColor,
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: `0 4px 15px ${statusColor}40`,
                                textTransform: 'capitalize'
                            }}>
                                <i className={`fa-solid ${getStatusIcon(abstract.status)}`} />
                                {t(`status.${abstract.status}`)}
                            </div>

                            {/* Abstract Details */}
                            <div style={{ padding: '32px', paddingTop: '28px' }}>
                                <h2 style={{
                                    fontSize: '22px',
                                    fontWeight: '700',
                                    color: '#1a1a2e',
                                    marginBottom: '16px',
                                    marginTop: '0',
                                    paddingRight: '140px',
                                    lineHeight: '1.4'
                                }}>
                                    {abstract.title}
                                </h2>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                        color: '#1a237e',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        border: '1px solid rgba(26, 35, 126, 0.1)'
                                    }}>
                                        <i className="fa-solid fa-tag" style={{ marginRight: '6px', fontSize: '11px' }} />
                                        {abstract.category}
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                        color: '#e65100',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        border: '1px solid rgba(230, 81, 0, 0.1)'
                                    }}>
                                        <i className="fa-solid fa-microphone" style={{ marginRight: '6px', fontSize: '11px' }} />
                                        {abstract.presentationType === 'oral' ? t('oralPresentation') : t('posterPresentation')}
                                    </div>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'auto 1fr', 
                                    gap: '12px 20px',
                                    marginBottom: '20px',
                                    padding: '16px',
                                    background: '#f8f9fa',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                        <i className="fa-solid fa-hashtag" style={{ marginRight: '6px', color: '#999' }} />
                                        {t('abstractId')}:
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a237e', fontFamily: 'monospace' }}>
                                        {abstract.trackingId}
                                    </div>

                                    <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                        <i className="fa-solid fa-calendar" style={{ marginRight: '6px', color: '#999' }} />
                                        {t('submittedDate')}:
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                        {formatDate(abstract.createdAt)}
                                    </div>
                                </div>

                                {/* Presentation Details (if accepted) */}
                                {abstract.presentationDetails && (
                                    <div className="presentation-details-box">
                                        <h3 className="abstract-subsection-title" style={{ color: '#00695c' }}>
                                            <i className="fa-solid fa-calendar-check" />
                                            {t('presentationSchedule')}
                                        </h3>
                                        <div className="presentation-grid">
                                            <div>
                                                <div className="abstract-grid-label">{t('session')}</div>
                                                <div className="abstract-grid-value">{abstract.presentationDetails.session}</div>
                                            </div>
                                            <div>
                                                <div className="abstract-grid-label">{t('room')}</div>
                                                <div className="abstract-grid-value">{abstract.presentationDetails.room}</div>
                                            </div>
                                            <div>
                                                <div className="abstract-grid-label">{t('date')}</div>
                                                <div className="abstract-grid-value">{abstract.presentationDetails.date}</div>
                                            </div>
                                            <div>
                                                <div className="abstract-grid-label">{t('time')}</div>
                                                <div className="abstract-grid-value">{abstract.presentationDetails.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Review Comments */}
                                {abstract.reviewComments && (
                                    <div className="review-comments-box">
                                        <h3 className="abstract-subsection-title" style={{ color: '#1a237e' }}>
                                            <i className="fa-solid fa-comment-dots" />
                                            {t('reviewerComments')}
                                        </h3>
                                        <p className="review-comments-text">
                                            {abstract.reviewComments}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <button 
                                        onClick={() => {
                                            setSelectedAbstract(abstract);
                                            setShowModal(true);
                                        }}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 15px rgba(26, 35, 126, 0.2)',
                                            transition: 'all 0.3s ease',
                                            flex: '1',
                                            minWidth: '140px',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 35, 126, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(26, 35, 126, 0.2)';
                                        }}
                                    >
                                        <i className="fa-solid fa-list-ul" />
                                        View Detail
                                    </button>

                                    <button 
                                        onClick={() => abstract.fullPaperUrl && window.open(abstract.fullPaperUrl, '_blank')}
                                        disabled={!abstract.fullPaperUrl}
                                        style={{ 
                                            background: abstract.fullPaperUrl ? 'linear-gradient(135deg, #FFBA00 0%, #FFD54F 100%)' : '#e0e0e0',
                                            color: abstract.fullPaperUrl ? '#1a1a2e' : '#999',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: abstract.fullPaperUrl ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: abstract.fullPaperUrl ? '0 4px 15px rgba(255, 186, 0, 0.2)' : 'none',
                                            transition: 'all 0.3s ease',
                                            flex: '1',
                                            minWidth: '140px',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (abstract.fullPaperUrl) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 186, 0, 0.3)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (abstract.fullPaperUrl) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 186, 0, 0.2)';
                                            }
                                        }}
                                    >
                                        <i className="fa-solid fa-eye" />
                                        {t('viewFullAbstract')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>

                {/* Abstract Detail Modal */}
                {showModal && selectedAbstract && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            animation: 'fadeIn 0.3s ease'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <div 
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                maxWidth: '900px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                position: 'relative',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                animation: 'slideUp 0.3s ease'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{
                                position: 'sticky',
                                top: 0,
                                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                                color: 'white',
                                padding: '24px 32px',
                                borderRadius: '16px 16px 0 0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                zIndex: 1
                            }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
                                        Abstract Details
                                    </h2>
                                    <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px', color: 'white' }}>
                                        {selectedAbstract.trackingId}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div style={{ padding: '32px' }}>
                                {/* Category and Type */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                    gap: '16px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '16px',
                                        borderRadius: '12px'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Category</div>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a237e' }}>
                                            {selectedAbstract.category}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '16px',
                                        borderRadius: '12px'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Presentation Type</div>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a237e' }}>
                                            {selectedAbstract.presentationType === 'oral' ? 'Oral Presentation' : 'Poster Presentation'}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '16px',
                                        borderRadius: '12px'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Status</div>
                                        <div style={{ 
                                            fontSize: '16px', 
                                            fontWeight: '600', 
                                            color: getStatusColor(selectedAbstract.status)
                                        }}>
                                            {t(`status.${selectedAbstract.status}`)}
                                        </div>
                                    </div>
                                </div>

                                {/* Presenting Author */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                        padding: '16px 20px',
                                        borderRadius: '12px 12px 0 0',
                                        marginBottom: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(26, 35, 126, 0.2)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <i className="fa-solid fa-user" style={{ color: '#1a237e', fontSize: '16px' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a237e', margin: 0 }}>
                                            Presenting Author
                                        </h3>
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        border: '2px solid #e8eaf6',
                                        borderTop: 'none',
                                        borderRadius: '0 0 12px 12px',
                                        padding: '20px'
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '14px' }}>
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ color: '#666', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    <i className="fa-solid fa-user-circle" style={{ marginRight: '6px', color: '#999' }} />
                                                    Name
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#1a237e' }}>
                                                    {selectedAbstract.firstName && selectedAbstract.lastName 
                                                        ? `${selectedAbstract.firstName} ${selectedAbstract.lastName}`.trim()
                                                        : selectedAbstract.authorName || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ color: '#666', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: '#999' }} />
                                                    Email
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#1a237e', wordBreak: 'break-all' }}>
                                                    {selectedAbstract.email || selectedAbstract.authorEmail || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ color: '#666', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    <i className="fa-solid fa-phone" style={{ marginRight: '6px', color: '#999' }} />
                                                    Phone
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#1a237e' }}>
                                                    {selectedAbstract.phone || selectedAbstract.authorPhone || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ color: '#666', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    <i className="fa-solid fa-globe" style={{ marginRight: '6px', color: '#999' }} />
                                                    Country
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#1a237e' }}>
                                                    {selectedAbstract.country || selectedAbstract.authorCountry || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ color: '#666', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    <i className="fa-solid fa-building" style={{ marginRight: '6px', color: '#999' }} />
                                                    Institution/Affiliation
                                                </div>
                                                <div style={{ fontWeight: '600', color: '#1a237e' }}>
                                                    {selectedAbstract.affiliation || selectedAbstract.institution || selectedAbstract.authorAffiliation || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Co-Authors */}
                                {selectedAbstract.coAuthors && selectedAbstract.coAuthors.length > 0 && (
                                    <div style={{ marginBottom: '32px' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                                            padding: '16px 20px',
                                            borderRadius: '12px 12px 0 0',
                                            marginBottom: '0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                background: 'rgba(0, 200, 83, 0.2)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="fa-solid fa-users" style={{ color: '#00C853', fontSize: '16px' }} />
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#00695c', margin: 0 }}>
                                                Co-Authors ({selectedAbstract.coAuthors.length})
                                            </h3>
                                        </div>
                                        <div style={{
                                            background: 'white',
                                            border: '2px solid #e8f5e9',
                                            borderTop: 'none',
                                            borderRadius: '0 0 12px 12px',
                                            padding: '20px'
                                        }}>
                                            {selectedAbstract.coAuthors.map((author: any, idx: number) => (
                                                <div key={idx} style={{
                                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                    padding: '14px 16px',
                                                    borderRadius: '10px',
                                                    marginBottom: idx < selectedAbstract.coAuthors.length - 1 ? '12px' : '0',
                                                    fontSize: '14px',
                                                    border: '1px solid #dee2e6'
                                                }}>
                                                    <div style={{ fontWeight: '700', color: '#1a237e', marginBottom: '6px', fontSize: '15px' }}>
                                                        {idx + 1}. {author.firstName} {author.lastName}
                                                    </div>
                                                    <div style={{ color: '#666', fontSize: '13px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                        <span>
                                                            <i className="fa-solid fa-envelope" style={{ marginRight: '4px', color: '#999' }} />
                                                            {author.email}
                                                        </span>
                                                        <span>
                                                            <i className="fa-solid fa-building" style={{ marginRight: '4px', color: '#999' }} />
                                                            {author.institution}
                                                        </span>
                                                        <span>
                                                            <i className="fa-solid fa-globe" style={{ marginRight: '4px', color: '#999' }} />
                                                            {author.country}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Title */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                        padding: '16px 20px',
                                        borderRadius: '12px 12px 0 0',
                                        marginBottom: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(255, 152, 0, 0.2)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <i className="fa-solid fa-heading" style={{ color: '#e65100', fontSize: '16px' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e65100', margin: 0 }}>
                                            Title
                                        </h3>
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        border: '2px solid #fff3e0',
                                        borderTop: 'none',
                                        borderRadius: '0 0 12px 12px',
                                        padding: '20px'
                                    }}>
                                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                                            {selectedAbstract.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Abstract Content Sections */}
                                {(selectedAbstract.background || selectedAbstract.methods || selectedAbstract.results || selectedAbstract.conclusion) && (
                                    <div style={{ marginBottom: '32px' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                            padding: '16px 20px',
                                            borderRadius: '12px 12px 0 0',
                                            marginBottom: '0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                background: 'rgba(25, 118, 210, 0.2)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="fa-solid fa-align-left" style={{ color: '#1976d2', fontSize: '16px' }} />
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1565c0', margin: 0 }}>
                                                Abstract Content
                                            </h3>
                                        </div>
                                        <div style={{
                                            background: 'white',
                                            border: '2px solid #e3f2fd',
                                            borderTop: 'none',
                                            borderRadius: '0 0 12px 12px',
                                            padding: '24px'
                                        }}>
                                            {selectedAbstract.background && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{
                                                        display: 'inline-block',
                                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a237e', margin: 0 }}>
                                                            Background
                                                        </h4>
                                                    </div>
                                                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', textAlign: 'justify', margin: 0 }}>
                                                        {selectedAbstract.background}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedAbstract.methods && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{
                                                        display: 'inline-block',
                                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a237e', margin: 0 }}>
                                                            Methods
                                                        </h4>
                                                    </div>
                                                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', textAlign: 'justify', margin: 0 }}>
                                                        {selectedAbstract.methods}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedAbstract.results && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{
                                                        display: 'inline-block',
                                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a237e', margin: 0 }}>
                                                            Results
                                                        </h4>
                                                    </div>
                                                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', textAlign: 'justify', margin: 0 }}>
                                                        {selectedAbstract.results}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedAbstract.conclusion && (
                                                <div style={{ marginBottom: '0' }}>
                                                    <div style={{
                                                        display: 'inline-block',
                                                        background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a237e', margin: 0 }}>
                                                            Conclusion
                                                        </h4>
                                                    </div>
                                                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', textAlign: 'justify', margin: 0 }}>
                                                        {selectedAbstract.conclusion}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Keywords */}
                                {selectedAbstract.keywords && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a237e', marginBottom: '12px' }}>
                                            Keywords
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {selectedAbstract.keywords.split(',').map((keyword: string, idx: number) => (
                                                <span key={idx} style={{
                                                    background: '#e8eaf6',
                                                    color: '#1a237e',
                                                    padding: '6px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>
                                                    {keyword.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}



                                {/* Presentation Details */}
                                {selectedAbstract.presentationDetails && (
                                    <div style={{
                                        background: '#e8f5e9',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#00695c', marginBottom: '16px' }}>
                                            <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }} />
                                            Presentation Schedule
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>Session</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#00695c' }}>
                                                    {selectedAbstract.presentationDetails.session}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>Room</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#00695c' }}>
                                                    {selectedAbstract.presentationDetails.room}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>Date</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#00695c' }}>
                                                    {selectedAbstract.presentationDetails.date}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>Time</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#00695c' }}>
                                                    {selectedAbstract.presentationDetails.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Review Comments */}
                                {selectedAbstract.reviewComments && (
                                    <div style={{
                                        background: '#fff3e0',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e65100', marginBottom: '12px' }}>
                                            <i className="fa-solid fa-comment-dots" style={{ marginRight: '8px' }} />
                                            Reviewer Comments
                                        </h3>
                                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', margin: 0 }}>
                                            {selectedAbstract.reviewComments}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
