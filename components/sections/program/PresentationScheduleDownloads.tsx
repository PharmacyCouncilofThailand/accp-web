'use client';

import { useTranslations } from 'next-intl';

const SCHEDULE_FILES = [
    {
        id: 'oral',
        href: '/assets/documents/schedule/oral presentation schedule ACCP 2026.pdf',
        downloadName: 'oral-presentation-schedule-ACCP-2026.pdf',
        labelKey: 'downloadOralSchedule',
        descriptionKey: 'downloadOralScheduleDesc',
        icon: 'fa-chalkboard-user',
        accent: '#067647',
        accentSoft: '#eef9f3',
        accentBorder: '#b7e4cc',
    },
    {
        id: 'poster',
        href: '/assets/documents/schedule/poster presentation schedule ACCP 2026.pdf',
        downloadName: 'poster-presentation-schedule-ACCP-2026.pdf',
        labelKey: 'downloadPosterSchedule',
        descriptionKey: 'downloadPosterScheduleDesc',
        icon: 'fa-image',
        accent: '#a15c00',
        accentSoft: '#fff7e0',
        accentBorder: '#f2ddb0',
    },
] as const;

export default function PresentationScheduleDownloads() {
    const tOralPoster = useTranslations('oralPoster');

    return (
        <section className="schedule-downloads" aria-labelledby="schedule-downloads-title">
            <div className="container">
                <div className="schedule-downloads-shell">
                    <div className="schedule-downloads-intro">
                        <span className="schedule-downloads-kicker">{tOralPoster('scheduleDownloadsKicker')}</span>
                        <h2 id="schedule-downloads-title">{tOralPoster('scheduleDownloadsTitle')}</h2>
                        <p>{tOralPoster('scheduleDownloadsDesc')}</p>
                    </div>

                    <div className="schedule-downloads-grid">
                        {SCHEDULE_FILES.map((file) => (
                            <a
                                key={file.id}
                                className={`schedule-download-card schedule-download-${file.id}`}
                                href={encodeURI(file.href)}
                                download={file.downloadName}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span
                                    className="schedule-download-icon"
                                    style={{
                                        background: file.accentSoft,
                                        borderColor: file.accentBorder,
                                        color: file.accent,
                                    }}
                                    aria-hidden="true"
                                >
                                    <i className={`fa-solid ${file.icon}`} />
                                </span>
                                <span className="schedule-download-copy">
                                    <strong>{tOralPoster(file.labelKey)}</strong>
                                    <span>{tOralPoster(file.descriptionKey)}</span>
                                </span>
                                <span className="schedule-download-action">
                                    <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                                    <span>{tOralPoster('downloadSchedulePdf')}</span>
                                    <i className="fa-solid fa-arrow-down" aria-hidden="true" />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .schedule-downloads {
                    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
                    border-bottom: 1px solid #e4eaf2;
                    padding: 36px 0 40px;
                }

                .schedule-downloads-shell {
                    display: grid;
                    gap: 24px;
                    margin: 0 auto;
                    max-width: 1200px;
                }

                .schedule-downloads-intro {
                    max-width: 720px;
                }

                .schedule-downloads-kicker {
                    align-items: center;
                    color: #1a237e;
                    display: inline-flex;
                    font-size: 12px;
                    font-weight: 900;
                    gap: 10px;
                    letter-spacing: 1.2px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }

                .schedule-downloads-kicker::before {
                    background: #ffba00;
                    content: "";
                    display: inline-block;
                    height: 3px;
                    width: 34px;
                }

                .schedule-downloads-intro h2 {
                    color: #101828;
                    font-size: clamp(24px, 3vw, 34px);
                    font-weight: 900;
                    line-height: 1.15;
                    margin: 0 0 10px;
                }

                .schedule-downloads-intro p {
                    color: #536170;
                    font-size: 15px;
                    line-height: 1.65;
                    margin: 0;
                }

                .schedule-downloads-grid {
                    display: grid;
                    gap: 14px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .schedule-download-card {
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #dfe7f0;
                    border-radius: 12px;
                    box-shadow: 0 16px 40px rgba(14, 23, 49, 0.07);
                    color: inherit;
                    display: grid;
                    gap: 16px;
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    padding: 18px 20px;
                    text-decoration: none;
                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease,
                        transform 0.2s ease;
                }

                .schedule-download-card:hover {
                    border-color: rgba(26, 35, 126, 0.22);
                    box-shadow: 0 20px 48px rgba(14, 23, 49, 0.11);
                    transform: translateY(-2px);
                }

                .schedule-download-card:active {
                    transform: translateY(0);
                }

                .schedule-download-icon {
                    align-items: center;
                    border: 1px solid;
                    border-radius: 12px;
                    display: flex;
                    flex-shrink: 0;
                    font-size: 20px;
                    height: 52px;
                    justify-content: center;
                    width: 52px;
                }

                .schedule-download-copy {
                    display: grid;
                    gap: 4px;
                    min-width: 0;
                }

                .schedule-download-copy strong {
                    color: #101828;
                    font-size: 16px;
                    font-weight: 900;
                    line-height: 1.25;
                }

                .schedule-download-copy span {
                    color: #667085;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.45;
                }

                .schedule-download-action {
                    align-items: center;
                    background: #1a237e;
                    border-radius: 999px;
                    color: #ffffff;
                    display: inline-flex;
                    flex-shrink: 0;
                    font-size: 12px;
                    font-weight: 900;
                    gap: 8px;
                    letter-spacing: 0.3px;
                    min-height: 40px;
                    padding: 0 14px;
                    white-space: nowrap;
                }

                .schedule-download-card:hover .schedule-download-action {
                    background: #111a66;
                }

                .schedule-download-oral:hover {
                    border-color: rgba(6, 118, 71, 0.28);
                }

                .schedule-download-poster:hover {
                    border-color: rgba(161, 92, 0, 0.28);
                }

                @media (max-width: 991px) {
                    .schedule-downloads {
                        padding: 28px 0 32px;
                    }

                    .schedule-downloads-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 575px) {
                    .schedule-download-card {
                        gap: 14px;
                        grid-template-columns: auto minmax(0, 1fr);
                        padding: 16px;
                    }

                    .schedule-download-action {
                        grid-column: 1 / -1;
                        justify-content: center;
                        width: 100%;
                    }

                    .schedule-download-copy strong {
                        font-size: 15px;
                    }
                }
            `}</style>
        </section>
    );
}
