'use client'
import { useTranslations } from 'next-intl';

export default function SponsorshipProspectus() {
    const t = useTranslations('sponsorship');

    return (
        <div className="about1-section-area sp1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 m-auto">
                        <div className="heading2 text-center space-margin60">
                            <h2>{t('prospectusTitle')}</h2>
                        </div>
                        <div className="space30" />
                        <div className="prospectus-content">
                            <p className="text-justify mb-4" style={{ textAlign: 'justify' }}>{t('intro1')}</p>
                            <p className="text-justify mb-5" style={{ textAlign: 'justify' }}>{t('intro2')}</p>

                            <h4 className="mb-4">{t('advantagesTitle')}</h4>
                            <p className="mb-4">{t('advantagesSubtitle')}</p>

                            <ul className="list-unstyled mb-5 text-start" style={{ listStyle: 'none', paddingLeft: 0 }}>
                                <li className="mb-3 d-flex align-items-start" style={{ marginBottom: '15px', display: 'flex' }}>
                                    <i className="fa-solid fa-check-circle mt-1 me-3" style={{ color: '#0d6efd', marginRight: '15px', marginTop: '5px' }}></i>
                                    <span>{t('advantage1')}</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start" style={{ marginBottom: '15px', display: 'flex' }}>
                                    <i className="fa-solid fa-check-circle mt-1 me-3" style={{ color: '#0d6efd', marginRight: '15px', marginTop: '5px' }}></i>
                                    <span>{t('advantage2')}</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start" style={{ marginBottom: '15px', display: 'flex' }}>
                                    <i className="fa-solid fa-check-circle mt-1 me-3" style={{ color: '#0d6efd', marginRight: '15px', marginTop: '5px' }}></i>
                                    <span>{t('advantage3')}</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start" style={{ marginBottom: '15px', display: 'flex' }}>
                                    <i className="fa-solid fa-check-circle mt-1 me-3" style={{ color: '#0d6efd', marginRight: '15px', marginTop: '5px' }}></i>
                                    <span>{t('advantage4')}</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start" style={{ marginBottom: '15px', display: 'flex' }}>
                                    <i className="fa-solid fa-check-circle mt-1 me-3" style={{ color: '#0d6efd', marginRight: '15px', marginTop: '5px' }}></i>
                                    <span>{t('advantage5')}</span>
                                </li>
                            </ul>

                            <div className="text-center mt-5" style={{ textAlign: 'center', marginTop: '40px' }}>
                                <img
                                    src="/assets/img/sponsorship-poster-new.jpg"
                                    alt="Sponsorship Confirmation Form"
                                    className="img-fluid rounded shadow"
                                    style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
