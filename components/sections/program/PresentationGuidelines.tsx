'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const documents = {
    oralPdf: '/assets/documents/oral%20presentation.pdf',
    oralTemplate: '/assets/documents/template%20for%20Oral%20presentation.pptx',
    posterPdf: '/assets/documents/poster%20presentation.pdf',
    posterBoard: '/assets/documents/poster_board_size.png',
};

const oralSections = [
    {
        title: 'Time Allocation',
        body: '7 minutes for presentation, followed by 3 minutes of Q&A. Please keep strictly within the time limit.',
    },
    {
        title: 'Presentation File Submission',
        body: 'Send your file to accpbangkok2026@gmail.com no later than July 1, 2026. Use the subject and file name format: Oral Presentation ID number_Speaker Name, for example Oral Presentation O024_Liew Lee.',
    },
    {
        title: 'Slide Recommendations',
        body: 'Keep slides clear and concise. Use large fonts, high-contrast colors, and include your name, affiliation, and presentation ID number on the title slide.',
    },
    {
        title: 'Technical and Onsite Guidelines',
        body: 'Personal laptops are not permitted. Presentations will run on the conference PC. Please ensure compatibility with Microsoft PowerPoint 2016 or later, and Windows 7 or later for Mac-created files.',
    },
    {
        title: 'On the Day of Presentation',
        body: 'Arrive at your session room at least 20 minutes before the session starts, report to the chair or moderator, bring a USB backup, and use the laser pointer provided in the room.',
    },
];

const posterSections = [
    {
        title: 'Poster Format Recommendations',
        body: 'Prepare a portrait poster that fits the panel. Maximum width is 90 cm, recommended height is 120-150 cm. The main content should be placed in the upper section and all posters must be in English.',
    },
    {
        title: 'Poster Display and Session Timing',
        body: 'Poster presentation is scheduled for July 10, 2026. Installation and removal details will be announced on the ACCP 2026 website.',
    },
    {
        title: 'On the Day of Poster Presentation',
        body: 'Presenters should remain near their posters during the assigned period, arrive at least 15 minutes before the session, briefly explain their work, answer questions, and remove posters promptly after the display period.',
    },
];

function DownloadButton({
    href,
    icon,
    title,
    meta,
    download,
}: {
    href: string;
    icon: string;
    title: string;
    meta: string;
    download?: string;
}) {
    return (
        <a className="presentation-doc-button" href={href} download={download}>
            <span className="presentation-doc-button-icon">
                <i className={`fa-solid ${icon}`} />
            </span>
            <span className="presentation-doc-button-copy">
                <strong>{title}</strong>
                <small>{meta}</small>
            </span>
            <span className="presentation-doc-button-action">
                <i className="fa-solid fa-arrow-down" />
            </span>
        </a>
    );
}

function InstructionList({
    title,
    accent,
    sections,
}: {
    title: string;
    accent: 'green' | 'amber';
    sections: { title: string; body: string }[];
}) {
    return (
        <div className={`presentation-instructions presentation-instructions-${accent}`}>
            <div className="presentation-instructions-heading">
                <span>Key Instructions</span>
                <h4>{title}</h4>
            </div>
            <div className="presentation-step-list">
                {sections.map((section, index) => (
                    <article className="presentation-step" key={section.title}>
                        <span className="presentation-step-index">{String(index + 1).padStart(2, '0')}</span>
                        <div>
                            <h5>{section.title}</h5>
                            <p>{section.body}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default function PresentationGuidelines() {
    const [showPosterPreview, setShowPosterPreview] = useState(false);
    const locale = useLocale();

    return (
        <section className="presentation-guidelines-section">
            <div className="container">
                <div className="presentation-guidelines-shell">
                    <div className="presentation-guidelines-header">
                        <div>
                            <span className="presentation-kicker">Presentation Guidelines</span>
                            <h2>Official oral and poster presentation documents</h2>
                        </div>
                        <div className="presentation-guidelines-actions">
                            <Link href={`/${locale}/program-oral-poster`} className="presentation-accepted-link">
                                <i className="fa-solid fa-list-check" />
                                Accepted presentations
                                <i className="fa-solid fa-arrow-right presentation-accepted-link-arrow" />
                            </Link>
                        </div>
                    </div>

                    <div className="presentation-doc-stack">
                        <article className="presentation-doc-panel presentation-doc-panel-oral" data-aos="fade-up" data-aos-duration={800}>
                            <header className="presentation-panel-head">
                                <div className="presentation-panel-intro">
                                    <span className="presentation-panel-label presentation-panel-label-green">Oral Presentation</span>
                                    <h3>7-minute talk with 3-minute Q&A</h3>
                                    <p>Submit your slides in advance and prepare with the official PowerPoint template.</p>
                                </div>
                                <div className="presentation-download-grid">
                                    <DownloadButton
                                        href={documents.oralPdf}
                                        icon="fa-file-pdf"
                                        title="Oral presentation guideline"
                                        meta="PDF document"
                                        download="ACCP2026-Oral-Presentation-Guideline.pdf"
                                    />
                                    <DownloadButton
                                        href={documents.oralTemplate}
                                        icon="fa-file-powerpoint"
                                        title="Oral presentation template"
                                        meta="PowerPoint template"
                                        download="ACCP2026-Oral-Presentation-Template.pptx"
                                    />
                                </div>
                            </header>

                            <InstructionList title="Oral preparation checklist" accent="green" sections={oralSections} />
                        </article>

                        <article className="presentation-doc-panel presentation-doc-panel-poster" data-aos="fade-up" data-aos-duration={800} data-aos-delay={120}>
                            <header className="presentation-panel-head presentation-panel-head-poster">
                                <div className="presentation-panel-intro">
                                    <span className="presentation-panel-label presentation-panel-label-amber">Poster Presentation</span>
                                    <h3>Portrait poster for onsite display</h3>
                                    <p>Check the poster dimensions and display guidance before printing your final poster.</p>
                                    <div className="presentation-download-grid presentation-download-grid-single">
                                        <DownloadButton
                                            href={documents.posterPdf}
                                            icon="fa-file-pdf"
                                            title="Poster presentation guideline"
                                            meta="PDF document"
                                            download="ACCP2026-Poster-Presentation-Guideline.pdf"
                                        />
                                    </div>
                                </div>

                                <div className="presentation-poster-media">
                                    <button
                                        type="button"
                                        className="presentation-poster-frame presentation-poster-frame-button"
                                        onClick={() => setShowPosterPreview(true)}
                                        aria-label="View poster board size reference larger"
                                    >
                                        <img src={documents.posterBoard} alt="Poster board size reference" />
                                        <span className="presentation-poster-zoom">
                                            <i className="fa-solid fa-magnifying-glass-plus" />
                                            View larger
                                        </span>
                                    </button>
                                    <div className="presentation-poster-note">
                                        <strong>Poster board size reference</strong>
                                        <span>Width max. 90 cm, height 120-150 cm</span>
                                    </div>
                                </div>
                            </header>

                            <InstructionList title="Poster preparation checklist" accent="amber" sections={posterSections} />
                        </article>
                    </div>
                </div>
            </div>

            {showPosterPreview && (
                <div
                    className="presentation-image-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Poster board size reference preview"
                    onClick={() => setShowPosterPreview(false)}
                >
                    <div className="presentation-lightbox-content" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="presentation-lightbox-close"
                            onClick={() => setShowPosterPreview(false)}
                            aria-label="Close poster board preview"
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                        <img src={documents.posterBoard} alt="Poster board size reference enlarged" />
                        <div className="presentation-lightbox-caption">
                            <strong>Poster board size reference</strong>
                            <span>Width max. 90 cm, height 120-150 cm</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .presentation-guidelines-section {
                    background: linear-gradient(180deg, #ffffff 0%, #f6f8fb 46%, #ffffff 100%);
                    padding: 94px 0 102px;
                    position: relative;
                }

                .presentation-guidelines-shell {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .presentation-guidelines-header {
                    align-items: end;
                    display: grid;
                    gap: 28px;
                    grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.65fr);
                    margin-bottom: 38px;
                }

                .presentation-kicker {
                    align-items: center;
                    color: #1a237e;
                    display: inline-flex;
                    font-size: 13px;
                    font-weight: 900;
                    gap: 10px;
                    letter-spacing: 1.4px;
                    margin-bottom: 14px;
                    text-transform: uppercase;
                }

                .presentation-kicker::before {
                    background: #ffba00;
                    content: "";
                    display: inline-block;
                    height: 3px;
                    width: 42px;
                }

                .presentation-guidelines-header h2 {
                    color: #101828;
                    font-size: clamp(32px, 4vw, 52px);
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.05;
                    margin: 0;
                    max-width: 800px;
                }

                .presentation-guidelines-actions {
                    display: flex;
                    justify-content: flex-end;
                }

                .presentation-guidelines-actions p {
                    color: #536170;
                    font-size: 17px;
                    line-height: 1.75;
                    margin: 0;
                }

                .presentation-accepted-link-arrow {
                    transition: transform 0.2s ease;
                }

                .presentation-guidelines-actions a:hover .presentation-accepted-link-arrow {
                    transform: translateX(3px);
                }

                .presentation-guidelines-actions a {
                    align-items: center;
                    background: #1a237e;
                    border-radius: 8px;
                    box-shadow: 0 16px 34px rgba(26, 35, 126, 0.18);
                    color: #ffffff;
                    display: inline-flex;
                    font-size: 14px;
                    font-weight: 900;
                    gap: 10px;
                    justify-content: center;
                    min-height: 48px;
                    padding: 13px 18px;
                    text-decoration: none;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                    width: fit-content;
                }

                .presentation-guidelines-actions a:hover {
                    background: #111a62;
                    box-shadow: 0 18px 38px rgba(26, 35, 126, 0.24);
                    color: #ffffff;
                    transform: translateY(-1px);
                }

                .presentation-doc-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }

                .presentation-doc-panel {
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    box-shadow: 0 24px 60px rgba(14, 23, 49, 0.09);
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                    overflow: hidden;
                    position: relative;
                }

                .presentation-doc-panel::before {
                    content: "";
                    height: 6px;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                }

                .presentation-doc-panel-oral::before {
                    background: linear-gradient(90deg, #10b981 0%, #1a237e 100%);
                }

                .presentation-doc-panel-poster::before {
                    background: linear-gradient(90deg, #f59e0b 0%, #1a237e 100%);
                }

                .presentation-panel-head {
                    align-items: center;
                    display: grid;
                    gap: 32px;
                    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
                    padding: 38px 40px 34px;
                }

                .presentation-panel-head-poster {
                    align-items: start;
                }

                .presentation-panel-intro {
                    min-width: 0;
                }

                .presentation-panel-label {
                    color: #637083;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    margin-bottom: 14px;
                    text-transform: uppercase;
                }

                .presentation-panel-label::before {
                    border-radius: 999px;
                    content: "";
                    height: 8px;
                    width: 8px;
                }

                .presentation-panel-label-green {
                    color: #047857;
                }

                .presentation-panel-label-green::before {
                    background: #10b981;
                }

                .presentation-panel-label-amber {
                    color: #a35b00;
                }

                .presentation-panel-label-amber::before {
                    background: #f59e0b;
                }

                .presentation-panel-intro h3 {
                    color: #101828;
                    font-size: 27px;
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.2;
                    margin: 0 0 10px;
                }

                .presentation-panel-intro p {
                    color: #5f6b7a;
                    font-size: 15px;
                    line-height: 1.65;
                    margin: 0;
                }

                .presentation-download-grid {
                    display: grid;
                    gap: 12px;
                    grid-template-columns: 1fr 1fr;
                }

                .presentation-download-grid-single {
                    grid-template-columns: 1fr;
                    margin-top: 22px;
                }

                .presentation-doc-button {
                    align-items: center;
                    background: #f8fafc;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    color: #101828;
                    display: grid;
                    gap: 12px;
                    grid-template-columns: 42px minmax(0, 1fr) 30px;
                    min-height: 82px;
                    padding: 14px;
                    text-decoration: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
                }

                .presentation-doc-button:hover {
                    background: #ffffff;
                    border-color: #1a237e;
                    box-shadow: 0 14px 30px rgba(26, 35, 126, 0.12);
                    color: #101828;
                    transform: translateY(-2px);
                }

                .presentation-doc-button-icon,
                .presentation-doc-button-action {
                    align-items: center;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                }

                .presentation-doc-button-icon {
                    background: #e8eefc;
                    color: #1a237e;
                    font-size: 18px;
                    height: 42px;
                    width: 42px;
                }

                .presentation-doc-button-copy {
                    min-width: 0;
                }

                .presentation-doc-button-copy strong,
                .presentation-doc-button-copy small {
                    display: block;
                    line-height: 1.35;
                }

                .presentation-doc-button-copy strong {
                    color: #101828;
                    font-size: 14px;
                    font-weight: 900;
                    overflow-wrap: anywhere;
                }

                .presentation-doc-button-copy small {
                    color: #667085;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .presentation-doc-button-action {
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    color: #1a237e;
                    font-size: 12px;
                    height: 30px;
                    width: 30px;
                }

                .presentation-poster-media {
                    margin: 0;
                }

                .presentation-poster-frame {
                    align-items: center;
                    background:
                        linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px),
                        #fffaf0;
                    background-size: 18px 18px;
                    border: 1px solid #f8d99a;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: center;
                    min-height: 230px;
                    padding: 24px;
                }

                .presentation-poster-frame-button {
                    cursor: zoom-in;
                    position: relative;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                    width: 100%;
                }

                .presentation-poster-frame-button:hover {
                    border-color: #f59e0b;
                    box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.22), 0 14px 34px rgba(245, 158, 11, 0.16);
                    transform: translateY(-1px);
                }

                .presentation-poster-frame img {
                    display: block;
                    height: 200px;
                    max-width: 100%;
                    object-fit: contain;
                }

                .presentation-poster-zoom {
                    align-items: center;
                    background: rgba(16, 24, 40, 0.86);
                    border-radius: 8px;
                    bottom: 14px;
                    color: #ffffff;
                    display: inline-flex;
                    font-size: 12px;
                    font-weight: 900;
                    gap: 8px;
                    padding: 9px 12px;
                    position: absolute;
                    right: 14px;
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }

                .presentation-poster-note {
                    align-items: center;
                    background: #fff4d8;
                    border: 1px solid #f8d99a;
                    border-top: 0;
                    border-radius: 0 0 8px 8px;
                    color: #7c4a03;
                    display: flex;
                    gap: 12px;
                    justify-content: space-between;
                    padding: 13px 16px;
                }

                .presentation-poster-note strong {
                    color: #7c4a03;
                    font-size: 13px;
                    font-weight: 900;
                }

                .presentation-poster-note span {
                    color: #8a5a0a;
                    font-size: 13px;
                    line-height: 1.4;
                    text-align: right;
                }

                .presentation-instructions {
                    background: #fbfcfe;
                    border-top: 1px solid #e7edf5;
                    flex: 1;
                    padding: 30px 40px 38px;
                }

                .presentation-instructions-heading {
                    align-items: center;
                    display: flex;
                    gap: 14px;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .presentation-instructions-heading span {
                    color: #667085;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .presentation-instructions-heading h4 {
                    color: #101828;
                    font-size: 18px;
                    font-weight: 900;
                    letter-spacing: 0;
                    margin: 0;
                    text-align: right;
                }

                .presentation-step-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .presentation-step {
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #e7edf5;
                    border-radius: 8px;
                    display: grid;
                    gap: 16px;
                    grid-template-columns: 42px minmax(0, 1fr);
                    padding: 18px 20px;
                }

                .presentation-step-index {
                    align-items: center;
                    border-radius: 8px;
                    display: flex;
                    font-size: 13px;
                    font-weight: 900;
                    height: 42px;
                    justify-content: center;
                    width: 42px;
                }

                .presentation-instructions-green .presentation-step-index {
                    background: #dff8ed;
                    color: #047857;
                }

                .presentation-instructions-amber .presentation-step-index {
                    background: #fff0c9;
                    color: #a35b00;
                }

                .presentation-step h5 {
                    color: #101828;
                    font-size: 16px;
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.35;
                    margin: 0 0 6px;
                }

                .presentation-step p {
                    color: #536170;
                    font-size: 14px;
                    line-height: 1.65;
                    margin: 0;
                }

                .presentation-image-lightbox {
                    align-items: center;
                    background: rgba(8, 13, 30, 0.82);
                    backdrop-filter: blur(8px);
                    display: flex;
                    inset: 0;
                    justify-content: center;
                    padding: 32px;
                    position: fixed;
                    z-index: 9999;
                }

                .presentation-lightbox-content {
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
                    max-height: calc(100vh - 64px);
                    max-width: min(760px, calc(100vw - 40px));
                    overflow: auto;
                    padding: 26px;
                    position: relative;
                    width: 100%;
                }

                .presentation-lightbox-close {
                    align-items: center;
                    background: #101828;
                    border: 0;
                    border-radius: 8px;
                    color: #ffffff;
                    cursor: pointer;
                    display: flex;
                    font-size: 18px;
                    height: 42px;
                    justify-content: center;
                    position: absolute;
                    right: 18px;
                    top: 18px;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    width: 42px;
                    z-index: 1;
                }

                .presentation-lightbox-close:hover {
                    background: #1a237e;
                    transform: translateY(-1px);
                }

                .presentation-lightbox-content img {
                    background:
                        linear-gradient(90deg, rgba(245, 158, 11, 0.09) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(245, 158, 11, 0.09) 1px, transparent 1px),
                        #fffaf0;
                    background-size: 22px 22px;
                    border: 1px solid #f8d99a;
                    border-radius: 8px;
                    display: block;
                    max-height: 72vh;
                    object-fit: contain;
                    padding: 28px;
                    width: 100%;
                }

                .presentation-lightbox-caption {
                    align-items: center;
                    display: flex;
                    gap: 16px;
                    justify-content: space-between;
                    padding-top: 16px;
                }

                .presentation-lightbox-caption strong {
                    color: #101828;
                    font-size: 16px;
                    font-weight: 900;
                }

                .presentation-lightbox-caption span {
                    color: #7c4a03;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: right;
                }

                @media (max-width: 991px) {
                    .presentation-guidelines-section {
                        padding: 72px 0 80px;
                    }

                    .presentation-guidelines-header {
                        grid-template-columns: 1fr;
                        gap: 18px;
                    }

                    .presentation-guidelines-actions {
                        justify-content: flex-start;
                    }

                    .presentation-panel-head,
                    .presentation-panel-head-poster {
                        align-items: stretch;
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                }

                @media (max-width: 767px) {
                    .presentation-download-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 575px) {
                    .presentation-guidelines-section {
                        padding: 58px 0 66px;
                    }

                    .presentation-panel-head,
                    .presentation-instructions {
                        padding-left: 22px;
                        padding-right: 22px;
                    }

                    .presentation-guidelines-header h2 {
                        font-size: 31px;
                    }

                    .presentation-guidelines-actions {
                        width: 100%;
                    }

                    .presentation-guidelines-actions a {
                        width: 100%;
                    }

                    .presentation-panel-intro h3 {
                        font-size: 23px;
                    }

                    .presentation-doc-button {
                        grid-template-columns: 40px minmax(0, 1fr);
                    }

                    .presentation-doc-button-action {
                        display: none;
                    }

                    .presentation-poster-note,
                    .presentation-instructions-heading {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .presentation-poster-note span,
                    .presentation-instructions-heading h4 {
                        text-align: left;
                    }

                    .presentation-step {
                        grid-template-columns: 1fr;
                    }

                    .presentation-image-lightbox {
                        padding: 18px;
                    }

                    .presentation-lightbox-content {
                        max-height: calc(100vh - 36px);
                        max-width: calc(100vw - 36px);
                        padding: 18px;
                    }

                    .presentation-lightbox-content img {
                        max-height: 68vh;
                        padding: 18px;
                    }

                    .presentation-lightbox-caption {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .presentation-lightbox-caption span {
                        text-align: left;
                    }
                }
            `}</style>
        </section>
    );
}
