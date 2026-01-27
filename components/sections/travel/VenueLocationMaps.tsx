'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function VenueLocationMaps() {
    const t = useTranslations('travelVisa')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const maps = [
        {
            id: 'train',
            title: '5-10 Minutes walk from Train Stations',
            titleTh: 'เดินจากสถานีรถไฟฟ้า 5-10 นาที',
            image: '/assets/img/venue-map-train.jpg',
            description: 'Walking distance from Siam Interchange Station and Chid Lom Station',
            descriptionTh: 'ระยะเดินจากสถานีสยาม และสถานีชิดลม'
        },
        {
            id: 'location',
            title: 'Located upside of CentralWorld Shopping Centre',
            titleTh: 'ตั้งอยู่ด้านบนของศูนย์การค้าเซ็นทรัลเวิลด์',
            image: '/assets/img/venue-map-location.jpg',
            description: 'Venue location within CentralWorld complex',
            descriptionTh: 'ตำแหน่งสถานที่จัดงานภายในศูนย์การค้าเซ็นทรัลเวิลด์'
        }
    ]

    return (
        <>
            <div className="venue-maps-section sp1" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 m-auto">
                            <div className="heading2 text-center space-margin60">
                                <h5 data-aos="fade-up" data-aos-duration={800}>
                                    <i className="fa-solid fa-map-location-dot" style={{ marginRight: '8px' }} />
                                    Venue Location
                                </h5>
                                <div className="space16" />
                                <h2 className="text-anime-style-3">How to Get to the Venue</h2>
                                <div className="space16" />
                                <p data-aos="fade-up" data-aos-duration={1000}>
                                    Centara Grand & Bangkok Convention Centre is conveniently located at CentralWorld, 
                                    easily accessible by public transportation
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ gap: '30px 0' }}>
                        {maps.map((map, index) => (
                            <div 
                                key={map.id} 
                                className="col-lg-6" 
                                data-aos="fade-up" 
                                data-aos-duration={800}
                                data-aos-delay={index * 100}
                            >
                                <div 
                                    className="map-card"
                                    onClick={() => setSelectedImage(map.image)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="map-image-wrapper">
                                        <Image
                                            src={map.image}
                                            alt={map.title}
                                            width={600}
                                            height={400}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '12px',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            className="map-image"
                                        />
                                        <div className="map-overlay">
                                            <i className="fa-solid fa-magnifying-glass-plus" />
                                            <span>Click to enlarge</span>
                                        </div>
                                    </div>
                                    <div className="map-content">
                                        <h4>{map.title}</h4>
                                        <p className="description">{map.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="lightbox-overlay"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="lightbox-close"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Venue Map"
                            width={1200}
                            height={800}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '90vh',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                .venue-maps-section {
                    position: relative;
                    overflow: hidden;
                }

                .map-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    height: 100%;
                }

                .map-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                }

                .map-image-wrapper {
                    position: relative;
                    overflow: hidden;
                }

                .map-card:hover :global(.map-image) {
                    transform: scale(1.05);
                }

                .map-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(26, 35, 126, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    color: white;
                }

                .map-card:hover .map-overlay {
                    opacity: 1;
                }

                .map-overlay i {
                    font-size: 48px;
                    color: #FFBA00;
                }

                .map-overlay span {
                    font-size: 16px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .map-content {
                    padding: 24px;
                }

                .map-content h4 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a237e;
                    margin: 0 0 8px 0;
                    line-height: 1.4;
                }

                .thai-title {
                    font-size: 15px;
                    color: #666;
                    margin: 0 0 12px 0;
                    font-weight: 500;
                }

                .description {
                    font-size: 14px;
                    color: #64748b;
                    margin: 0;
                    line-height: 1.6;
                }

                /* Lightbox Styles */
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    cursor: zoom-out;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .lightbox-content {
                    position: relative;
                    max-width: 1400px;
                    width: 100%;
                    cursor: default;
                }

                .lightbox-close {
                    position: absolute;
                    top: -50px;
                    right: 0;
                    background: white;
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 24px;
                    color: #1a237e;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .lightbox-close:hover {
                    background: #FFBA00;
                    transform: rotate(90deg);
                }

                @media (max-width: 768px) {
                    .map-content h4 {
                        font-size: 16px;
                    }

                    .thai-title {
                        font-size: 14px;
                    }

                    .description {
                        font-size: 13px;
                    }

                    .map-overlay i {
                        font-size: 36px;
                    }

                    .map-overlay span {
                        font-size: 14px;
                    }

                    .lightbox-close {
                        top: 10px;
                        right: 10px;
                        width: 40px;
                        height: 40px;
                        font-size: 20px;
                    }
                }
            `}</style>
        </>
    )
}
