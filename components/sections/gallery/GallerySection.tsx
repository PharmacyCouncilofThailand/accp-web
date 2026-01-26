'use client'
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { galleryData } from "@/data/galleryData"

type TabType = 'accp2025' | 'venue' | 'bangkok';

export default function GallerySection() {
    const t = useTranslations('gallery')
    const [activeTab, setActiveTab] = useState<TabType>('accp2025')
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' })

    const openLightbox = (src: string, alt: string) => {
        setLightboxImage({ src, alt })
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
    }

    const tabTitles = {
        accp2025: { title: t('accp2025Title'), subtitle: t('accp2025Subtitle') },
        venue: { title: t('venueTitle'), subtitle: t('venueSubtitle') },
        bangkok: { title: t('bangkokTitle'), subtitle: t('bangkokSubtitle') }
    }

    return (
        <>
            {/* Tab Navigation */}
            <section style={{
                background: '#f8f9fa',
                padding: '0',
                position: 'sticky',
                top: '0',
                zIndex: 100
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                        padding: '20px 0',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <button
                            onClick={() => setActiveTab('accp2025')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === 'accp2025'
                                    ? 'linear-gradient(135deg, #7B2D8E, #5a1f6a)'
                                    : '#fff',
                                color: activeTab === 'accp2025' ? '#fff' : '#333',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === 'accp2025'
                                    ? '0 4px 15px rgba(123,45,142,0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-camera-retro"></i>
                            {t('accp2025Recap')}
                        </button>
                        <button
                            onClick={() => setActiveTab('venue')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === 'venue'
                                    ? 'linear-gradient(135deg, #7B2D8E, #5a1f6a)'
                                    : '#fff',
                                color: activeTab === 'venue' ? '#fff' : '#333',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === 'venue'
                                    ? '0 4px 15px rgba(123,45,142,0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-building"></i>
                            {t('venue')}
                        </button>
                        <button
                            onClick={() => setActiveTab('bangkok')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === 'bangkok'
                                    ? 'linear-gradient(135deg, #7B2D8E, #5a1f6a)'
                                    : '#fff',
                                color: activeTab === 'bangkok' ? '#fff' : '#333',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === 'bangkok'
                                    ? '0 4px 15px rgba(123,45,142,0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-location-dot"></i>
                            {t('exploreBangkok')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Gallery Content */}
            <section style={{ padding: '60px 0 80px', background: '#f8f9fa' }}>
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center" style={{ marginBottom: '50px' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1a1a2e',
                            marginBottom: '15px'
                        }}>
                            {tabTitles[activeTab].title}
                        </h2>
                        <p style={{
                            color: '#666',
                            fontSize: '1.1rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            {tabTitles[activeTab].subtitle}
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="masonry-gallery-grid">
                        {galleryData[activeTab].images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`gallery-item item-${index}`}
                                onClick={() => openLightbox(image.src, image.alt)}
                            >
                                <div className="image-wrapper">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                    />
                                    <div className="overlay">
                                        <span className="location-name">{image.alt}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                   
                </div>
            </section>

            

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '50px',
                            height: '50px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img
                        src={lightboxImage.src}
                        alt={lightboxImage.alt}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        padding: '10px 20px',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {lightboxImage.alt}
                    </div>
                </div>
            )}
            {/* Custom Styles */}
            <style jsx global>{`
                /* Standard Gallery Hover */
                .gallery-item-standard:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
                }
                .gallery-item-standard:hover img {
                    transform: scale(1.1);
                }

                /* Masonry Grid */
                .masonry-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    /* First 2 rows fixed for the hero item layout, subsequent rows are 300px */
                    grid-template-rows: 300px 300px; 
                    grid-auto-rows: 300px;
                    gap: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .gallery-item {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                .image-wrapper {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                /* Hover Effects */
                .gallery-item:hover {
                    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                    transform: translateY(-5px);
                }

                .gallery-item:hover img {
                    transform: scale(1.05);
                }

                /* Overlay */
                .overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 30px 20px;
                    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.4s ease;
                }

                .gallery-item:hover .overlay {
                    opacity: 1;
                    transform: translateY(0);
                }

                .location-name {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    letter-spacing: 0.5px;
                }

                /* Grid Placement Logic (Desktop) */
                .item-0 {
                    grid-column: span 2;
                    grid-row: span 2;
                }
                /* Other items auto-flow */

                /* Responsive Design */
                @media (max-width: 991px) {
                    .masonry-gallery-grid {
                        grid-template-columns: repeat(2, 1fr);
                        grid-template-rows: auto;
                        grid-auto-rows: 280px;
                    }
                    .item-0 {
                        grid-column: span 2;
                        grid-row: span 2;
                    }
                }

                @media (max-width: 767px) {
                    .masonry-gallery-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .item-0 {
                        grid-column: span 1;
                        grid-row: span 1;
                        height: 350px !important;
                    }
                    .gallery-item {
                        height: 280px;
                    }
                }
            `}</style>
        </>
    )
}
