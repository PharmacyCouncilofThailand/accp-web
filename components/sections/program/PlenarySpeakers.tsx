'use client'

import { useEffect, useState } from 'react';
import { plenarySpeakers, PlenarySpeaker } from '@/data/plenarySpeakersData';

const cardStyles = {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '30px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
};

export default function PlenarySpeakers() {
    const [selectedSpeaker, setSelectedSpeaker] = useState<PlenarySpeaker | null>(null);

    useEffect(() => {
        if (!selectedSpeaker) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedSpeaker(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedSpeaker]);

    return (
        <div style={{
            background: '#f8f9fa',
            padding: '80px 0',
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    {plenarySpeakers.map((speaker, index) => (
                        <div className="col-xl-3 col-lg-4 col-md-6 d-flex" key={speaker.id} data-aos="fade-up" data-aos-duration={800} data-aos-delay={index * 80}>
                            <div style={cardStyles}>
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    background: '#eef2f7',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <img
                                        src={speaker.image}
                                        alt={speaker.name}
                                        loading="lazy"
                                        width={400}
                                        height={400}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top center',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        }}
                                    />

                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '25px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
                                    }}>
                                        <i className="fa-solid fa-microphone" style={{ marginRight: '6px' }} />
                                        {speaker.sessions[0]?.role || 'Speaker'}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#8B5CF6',
                                        marginBottom: '10px',
                                        lineHeight: 1.35,
                                    }}>
                                        {speaker.name}
                                    </h3>

                                    <p style={{
                                        color: '#333',
                                        fontWeight: '500',
                                        marginBottom: '16px',
                                        fontSize: '14px',
                                        lineHeight: 1.55,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {speaker.positions.join(' / ')}
                                    </p>

                                    <div style={{
                                        borderTop: '1px solid #eee',
                                        paddingTop: '16px',
                                        marginTop: 'auto',
                                    }}>
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '8px',
                                            minHeight: '44px',
                                        }}>
                                            <i className="fa-solid fa-quote-left" style={{
                                                color: '#FFBA00',
                                                fontSize: '16px',
                                                marginTop: '2px',
                                            }} />
                                            <span>{speaker.sessions[0]?.title}</span>
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            gap: '14px',
                                            flexWrap: 'wrap',
                                            fontSize: '13px',
                                            color: '#666',
                                            marginBottom: '18px',
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fa-regular fa-calendar" />
                                                {speaker.sessions[0]?.day}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fa-regular fa-clock" />
                                                {speaker.sessions[0]?.time}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedSpeaker(speaker)}
                                            style={{
                                                width: '100%',
                                                border: '1px solid rgba(139,92,246,0.24)',
                                                background: 'rgba(139,92,246,0.08)',
                                                color: '#7C3AED',
                                                borderRadius: '999px',
                                                padding: '10px 16px',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSpeaker && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="plenary-speaker-title"
                    onClick={() => setSelectedSpeaker(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.68)',
                        zIndex: 9999,
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="plenary-speaker-modal"
                        style={{
                            width: 'min(1120px, 100%)',
                            maxHeight: 'calc(100vh - 48px)',
                            overflow: 'auto',
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.32)',
                        }}
                    >
                        <div
                            className="plenary-speaker-modal-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(460px, 560px) minmax(380px, 1fr)',
                                gap: '0',
                                alignItems: 'start',
                            }}
                        >
                            <div
                                className="plenary-speaker-modal-image"
                                style={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    background: '#07123c',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={selectedSpeaker.image}
                                    alt={selectedSpeaker.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        objectPosition: 'top center',
                                        position: 'absolute',
                                        inset: 0,
                                    }}
                                />
                            </div>

                            <div style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start' }}>
                                    <h3 id="plenary-speaker-title" style={{
                                        color: '#111827',
                                        fontSize: '28px',
                                        lineHeight: 1.2,
                                        marginBottom: '18px',
                                    }}>
                                        {selectedSpeaker.name}
                                    </h3>
                                    <button
                                        type="button"
                                        aria-label="Close speaker details"
                                        onClick={() => setSelectedSpeaker(null)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid #e5e7eb',
                                            background: '#fff',
                                            color: '#111827',
                                            cursor: 'pointer',
                                            flex: '0 0 auto',
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                </div>

                                <div style={{ marginBottom: '26px' }}>
                                    <h4 style={{ fontSize: '15px', color: '#7C3AED', marginBottom: '12px' }}>Profile</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: 1.7 }}>
                                        {selectedSpeaker.positions.map((position) => (
                                            <li key={position}>{position}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '15px', color: '#7C3AED', marginBottom: '12px' }}>Plenary and keynote</h4>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {selectedSpeaker.sessions.map((session) => (
                                            <div
                                                key={`${session.role}-${session.title}-${session.time}`}
                                                style={{
                                                    border: '1px solid #edf0f5',
                                                    borderRadius: '12px',
                                                    padding: '14px 16px',
                                                    background: '#fafbff',
                                                }}
                                            >
                                                <div style={{ color: '#111827', fontWeight: 700, marginBottom: '6px' }}>
                                                    {session.role}: {session.title}
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', color: '#64748b', fontSize: '14px' }}>
                                                    <span><i className="fa-regular fa-calendar" style={{ marginRight: '6px' }} />{session.day} ({session.date})</span>
                                                    <span><i className="fa-regular fa-clock" style={{ marginRight: '6px' }} />{session.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>{`
                        @media (max-width: 991px) {
                            .plenary-speaker-modal-grid {
                                grid-template-columns: 1fr !important;
                            }

                            .plenary-speaker-modal-image {
                                max-height: min(82vw, 560px);
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    )
}
