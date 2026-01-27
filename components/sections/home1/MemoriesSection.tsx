'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';

// ============================================================================
// Configuration
// ============================================================================

interface MemoryItem {
    img: string;
    year: string;
}

const MEMORIES_DATA: MemoryItem[] = [
    { img: 'memory1', year: '2025' },
    { img: 'memory2', year: '2025' },
    { img: 'memory4', year: '2025' },
    { img: 'memory5', year: '2025' },
    { img: 'memory6', year: '2025' },
    { img: 'memory7', year: '2025' },
];

const IMAGE_BASE_PATH = '/assets/img/all-images/memory';

// ============================================================================
// Styles
// ============================================================================

const styles = `
    .memories-section {
        padding: 60px 0 100px;
        background-color: #f9f9f9;
    }

    /* Header */
    .memories-header {
        text-align: center;
        margin-bottom: 48px;
    }

    .memories-header h5 {
        color: #3b5998;
        font-weight: 600;
        margin-bottom: 16px;
    }

    /* Grid Layout */
    .memories-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    /* Card */
    .memory-card {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        background: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        /* Safari fix */
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        will-change: transform;
        backface-visibility: hidden;
    }

    .memory-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    }

    /* Image */
    .memory-card__image {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
    }

    .memory-card:hover .memory-card__image {
        transform: scale(1.05);
    }

    /* Overlay */
    .memory-card__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .memory-card:hover .memory-card__overlay {
        opacity: 1;
    }

    .memory-card__overlay i {
        font-size: 28px;
        color: white;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .memory-card:hover .memory-card__overlay i {
        transform: scale(1);
    }

    /* Lightbox */
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.92);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        animation: fadeIn 0.25s ease;
    }

    .lightbox__image {
        max-width: 90%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.6);
        animation: zoomIn 0.25s ease;
    }

    .lightbox__close {
        position: absolute;
        top: 24px;
        right: 24px;
        background: transparent;
        border: none;
        color: white;
        font-size: 28px;
        cursor: pointer;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
        z-index: 10001;
    }

    .lightbox__close:hover {
        transform: scale(1.15);
    }

    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes zoomIn {
        from { transform: scale(0.92); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    /* Responsive */
    @media (max-width: 991px) {
        .memories-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 575px) {
        .memories-grid {
            grid-template-columns: 1fr;
        }

        .memory-card__image {
            aspect-ratio: 16 / 10;
        }
    }
`;

// ============================================================================
// Component
// ============================================================================

export default function MemoriesSection() {
    const t = useTranslations();

    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const openLightbox = useCallback((img: string) => {
        setLightboxImage(img);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxImage(null);
    }, []);

    const getImagePath = (img: string) => `${IMAGE_BASE_PATH}/${img}.jpg`;

    return (
        <section className="memories-section sp1">
            <div className="container">
                {/* Header */}
                <div className="row">
                    <div className="col-lg-6 m-auto">
                        <div className="memories-header heading2">
                            <h5 data-aos="fade-up" data-aos-duration={800}>
                                {t('memories.title')}
                            </h5>
                            <h2 className="text-anime-style-3">
                                {t('memories.subtitle')}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="memories-grid">
                    {MEMORIES_DATA.map((memory, index) => (
                        <div
                            key={memory.img}
                            className="memory-card"
                            data-aos="fade-up"
                            data-aos-duration={800}
                            data-aos-delay={index * 80}
                            onClick={() => openLightbox(memory.img)}
                        >
                            <img
                                src={getImagePath(memory.img)}
                                alt={`Memory ${memory.year}`}
                                className="memory-card__image"
                            />
                            <div className="memory-card__overlay">
                                <i className="fa-solid fa-magnifying-glass-plus" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button
                        className="lightbox__close"
                        aria-label="Close lightbox"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                    <img
                        src={getImagePath(lightboxImage)}
                        alt="Full size memory"
                        className="lightbox__image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <style jsx>{styles}</style>
        </section>
    );
}
