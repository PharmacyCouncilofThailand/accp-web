'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { interchangeStations } from "@/data/travelData"

export default function TransportationInfo() {
    const t = useTranslations('travelVisa')
    const [zoomLevel, setZoomLevel] = useState(1)

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
    }

    return (
        <div className="sp1" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 m-auto">
                        <div className="heading2 space-margin60">
                            <h2 data-aos="fade-up" data-aos-duration={800}>{t('transportationTitle')}</h2>
                        </div>

                        <div data-aos="fade-up" data-aos-duration={1000}>
                            {/* BTS */}
                            <div className="pricing-boxarea" style={{ marginBottom: '20px', borderLeft: '4px solid #9dc93e' }}>
                                <h5 style={{ color: '#1a237e', marginBottom: '15px' }}>
                                    <i className="fa-solid fa-train" style={{ marginRight: '10px', color: '#9dc93e' }} />
                                    {t('btsTitle')}
                                </h5>
                                <p style={{ margin: 0, lineHeight: '1.8', color: '#333' }}>
                                    {t('btsDesc')}
                                </p>
                            </div>

                            {/* MRT */}
                            <div className="pricing-boxarea" style={{ marginBottom: '20px', borderLeft: '4px solid #1565c0' }}>
                                <h5 style={{ color: '#1a237e', marginBottom: '15px' }}>
                                    <i className="fa-solid fa-train-subway" style={{ marginRight: '10px', color: '#1565c0' }} />
                                    {t('mrtTitle')}
                                </h5>
                                <p style={{ margin: 0, lineHeight: '1.8', color: '#333' }}>
                                    {t('mrtDesc')}
                                </p>
                            </div>

                            {/* ARL */}
                            <div className="pricing-boxarea" style={{ marginBottom: '20px', borderLeft: '4px solid #e74c3c' }}>
                                <h5 style={{ color: '#1a237e', marginBottom: '15px' }}>
                                    <i className="fa-solid fa-plane-departure" style={{ marginRight: '10px', color: '#e74c3c' }} />
                                    {t('arlTitle')}
                                </h5>
                                <p style={{ margin: 0, lineHeight: '1.8', color: '#333' }}>
                                    {t('arlDesc')}
                                </p>
                            </div>

                            {/* Taxi */}
                            <div className="pricing-boxarea" style={{ marginBottom: '30px', borderLeft: '4px solid #FFBA00' }}>
                                <h5 style={{ color: '#1a237e', marginBottom: '15px' }}>
                                    <i className="fa-solid fa-taxi" style={{ marginRight: '10px', color: '#FFBA00' }} />
                                    {t('taxiTitle')}
                                </h5>
                                <p style={{ margin: 0, lineHeight: '1.8', color: '#333' }}>
                                    {t('taxiDesc')}
                                </p>
                            </div>

                            {/* Interchange Stations Table */}
                            <div className="pricing-boxarea" style={{ marginBottom: '30px', padding: 0, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                                            <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600' }}>BTS Sky Train</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interchangeStations.map((station, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                                                <td style={{ padding: '12px 20px', color: '#2e7d32' }}>{station.bts}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Train Map */}
                            <div className="pricing-boxarea" style={{ textAlign: 'center' }}>
                                <h5 style={{ color: '#1a237e', marginBottom: '20px' }}>
                                    <i className="fa-solid fa-map" style={{ marginRight: '10px', color: '#FFBA00' }} />
                                    Bangkok Train Map
                                </h5>
                                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                    {/* Zoom Controls */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        zIndex: 10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        <button
                                            onClick={handleZoomIn}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                backgroundColor: '#1a237e',
                                                color: 'white',
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#303f9f'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a237e'}
                                            title="Zoom In"
                                        >
                                            <i className="fa-solid fa-plus" />
                                        </button>
                                        <button
                                            onClick={handleZoomOut}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                backgroundColor: '#1a237e',
                                                color: 'white',
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#303f9f'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a237e'}
                                            title="Zoom Out"
                                        >
                                            <i className="fa-solid fa-minus" />
                                        </button>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#1a237e',
                                            textAlign: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}>
                                            {Math.round(zoomLevel * 100)}%
                                        </div>
                                    </div>
                                    {/* Zoomable Image Container */}
                                    <div style={{
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        position: 'relative'
                                    }}>
                                        <style>{`
                                            .train-map-scroll-container {
                                                overflow: auto !important;
                                                max-height: 600px;
                                                scrollbar-width: auto;
                                                scrollbar-color: #1a237e #e0e0e0;
                                            }
                                            .train-map-scroll-container::-webkit-scrollbar {
                                                width: 12px;
                                                height: 12px;
                                                display: block;
                                            }
                                            .train-map-scroll-container::-webkit-scrollbar-track {
                                                background: #e0e0e0;
                                                border-radius: 6px;
                                            }
                                            .train-map-scroll-container::-webkit-scrollbar-thumb {
                                                background: #1a237e;
                                                border-radius: 6px;
                                                border: 2px solid #e0e0e0;
                                            }
                                            .train-map-scroll-container::-webkit-scrollbar-thumb:hover {
                                                background: #303f9f;
                                            }
                                            .train-map-scroll-container::-webkit-scrollbar-corner {
                                                background: #e0e0e0;
                                            }
                                        `}</style>
                                        <div 
                                            className="train-map-scroll-container"
                                            style={{
                                                overflow: 'scroll',
                                                maxHeight: '600px',
                                            }}
                                        >
                                            <div style={{
                                                width: `${100 * zoomLevel}%`,
                                                height: 'auto',
                                                transition: 'width 0.3s ease',
                                            }}>
                                                <Image
                                                    src="/assets/img/theskytrain_map.png"
                                                    alt="Bangkok BTS and MRT Train Map"
                                                    width={2000}
                                                    height={1400}
                                                    sizes="100vw"
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        height: 'auto',
                                                        cursor: zoomLevel > 1 ? 'move' : 'default'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
