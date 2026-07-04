'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type PresentationType = 'oral' | 'poster';

type TimeRange = {
    start: string;
    end: string;
};

type PresentationSchedule = {
    date: string | null;
    room?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    boardNumber?: string | null;
    installation?: TimeRange | null;
    presentation?: TimeRange | null;
    removal?: TimeRange | null;
};

type AcceptedAbstract = {
    id: number;
    trackingId: string | null;
    title: string;
    category: string;
    presentationType: PresentationType;
    presenterName: string;
    institution: string | null;
    country: string | null;
    schedule: PresentationSchedule | null;
};

type AcceptedAbstractsResponse = {
    success: boolean;
    abstracts: AcceptedAbstract[];
    total: number;
    counts: {
        oral: number;
        poster: number;
    };
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const categoryLabels: Record<string, string> = {
    clinical_pharmacy: 'Clinical Pharmacy',
    social_administrative: 'Social & Administrative Pharmacy',
    community_pharmacy: 'Community Pharmacy',
    pharmacology_toxicology: 'Pharmacology & Toxicology',
    pharmacy_education: 'Pharmacy Education',
    digital_pharmacy: 'Digital Pharmacy & Innovation',
};

type PresentationFilter = 'all' | PresentationType;

const normalize = (value: string | null | undefined) =>
    (value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

const formatScheduleDate = (value: string | null | undefined, locale: string) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const formatTimeRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null;
    return `${start} – ${end}`;
};

function ScheduleChip({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="accepted-schedule-chip">
            <span className="accepted-schedule-label">{label}</span>
            <span className="accepted-schedule-value">{value}</span>
        </div>
    );
}

function ScheduleDetails({
    item,
    locale,
}: {
    item: AcceptedAbstract;
    locale: string;
}) {
    const tOralPoster = useTranslations('oralPoster');
    const schedule = item.schedule;

    if (!schedule) return null;

    const presentationTime =
        formatTimeRange(
            schedule.presentation?.start ?? schedule.startTime,
            schedule.presentation?.end ?? schedule.endTime,
        ) ?? null;
    const formattedDate = formatScheduleDate(schedule.date, locale);
    const scheduleClass =
        item.presentationType === 'oral'
            ? 'accepted-schedule-details accepted-schedule-oral'
            : 'accepted-schedule-details accepted-schedule-poster';

    if (item.presentationType === 'oral') {
        if (!schedule.room && !presentationTime && !formattedDate) return null;

        return (
            <div className={scheduleClass}>
                <div className="accepted-schedule-chips">
                    {schedule.room && (
                        <ScheduleChip label={tOralPoster('room')} value={schedule.room} />
                    )}
                    {presentationTime && (
                        <ScheduleChip label={tOralPoster('time')} value={presentationTime} />
                    )}
                    {formattedDate && (
                        <ScheduleChip label={tOralPoster('date')} value={formattedDate} />
                    )}
                </div>
            </div>
        );
    }

    if (!schedule.boardNumber && !formattedDate && !presentationTime) return null;

    return (
        <div className={scheduleClass}>
            <div className="accepted-schedule-chips">
                {schedule.boardNumber && (
                    <ScheduleChip
                        label={tOralPoster('posterBoard')}
                        value={`#${schedule.boardNumber}`}
                    />
                )}
                {formattedDate && (
                    <ScheduleChip label={tOralPoster('date')} value={formattedDate} />
                )}
                {presentationTime && (
                    <ScheduleChip
                        label={tOralPoster('presentationTime')}
                        value={presentationTime}
                    />
                )}
            </div>
        </div>
    );
}

function AbstractCard({ item, index, locale }: { item: AcceptedAbstract; index: number; locale: string }) {
    const code = item.trackingId || `${item.presentationType === 'oral' ? 'O' : 'P'}-${String(index + 1).padStart(3, '0')}`;

    return (
        <article className="accepted-abstract-card">
            <div className="accepted-card-sidebar">
                <div className="accepted-card-identity">
                    <div className="accepted-abstract-code">{code}</div>
                    <span className={`accepted-type-badge accepted-type-${item.presentationType}`}>
                        {item.presentationType === 'oral' ? 'Oral' : 'Poster'}
                    </span>
                </div>
                <ScheduleDetails item={item} locale={locale} />
            </div>
            <div className="accepted-abstract-content">
                <div className="accepted-abstract-meta">
                    <span>{categoryLabels[item.category] || item.category.replace(/_/g, ' ')}</span>
                    {item.country && <span>{item.country}</span>}
                </div>
                <h4>{item.title}</h4>
                <p>
                    <strong>{item.presenterName || 'Presenter to be announced'}</strong>
                    {item.institution && <span>{item.institution}</span>}
                </p>
            </div>
        </article>
    );
}

function AbstractList({ items, locale }: { items: AcceptedAbstract[]; locale: string }) {
    return (
        <section className="accepted-abstract-list-panel" aria-live="polite">
            {items.length > 0 ? (
                <div className="accepted-abstract-list">
                    {items.map((item, index) => (
                        <AbstractCard key={`${item.presentationType}-${item.id}`} item={item} index={index} locale={locale} />
                    ))}
                </div>
            ) : (
                <div className="accepted-empty-state">
                    <i className="fa-solid fa-file-circle-info" />
                    <p>No accepted abstracts match the current search or filter.</p>
                </div>
            )}
        </section>
    );
}

export default function AcceptedAbstractsDirectory({
    scheduledOnly = false,
}: {
    scheduledOnly?: boolean;
}) {
    const locale = useLocale();
    const [abstracts, setAbstracts] = useState<AcceptedAbstract[]>([]);
    const [search, setSearch] = useState('');
    const [presentationFilter, setPresentationFilter] = useState<PresentationFilter>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        const loadAcceptedAbstracts = async () => {
            setLoading(true);
            setError(null);

            try {
                const query = scheduledOnly ? '?scheduledOnly=true' : '';
                const response = await fetch(`${API_URL}/api/abstracts/accepted${query}`, {
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Failed to load accepted abstracts');
                }

                const data = (await response.json()) as AcceptedAbstractsResponse;

                if (!ignore) {
                    setAbstracts(data.abstracts || []);
                }
            } catch (err) {
                console.error('Failed to fetch accepted abstracts:', err);
                if (!ignore) {
                    setError('Unable to load accepted abstracts right now.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadAcceptedAbstracts();

        return () => {
            ignore = true;
        };
    }, [scheduledOnly]);

    const filteredAbstracts = useMemo(() => {
        const keyword = normalize(search);

        return abstracts.filter((item) => {
            if (presentationFilter !== 'all' && item.presentationType !== presentationFilter) {
                return false;
            }

            if (!keyword) {
                return true;
            }

            const haystack = [
                item.trackingId,
                item.title,
                item.presenterName,
            ]
                .map(normalize)
                .join(' ');

            return haystack.includes(keyword);
        });
    }, [abstracts, presentationFilter, search]);

    const totalOral = abstracts.filter((item) => item.presentationType === 'oral').length;
    const totalPoster = abstracts.filter((item) => item.presentationType === 'poster').length;
    const totalAccepted = totalOral + totalPoster;
    const filterOptions: { value: PresentationFilter; label: string; count: number }[] = [
        { value: 'all', label: 'All accepted', count: totalAccepted },
        { value: 'oral', label: 'Oral', count: totalOral },
        { value: 'poster', label: 'Poster', count: totalPoster },
    ];

    return (
        <section className="accepted-abstracts-directory">
            <div className="container">
                <div className="accepted-directory-shell">
                    <div className="accepted-directory-header">
                        <div>
                            <span className="accepted-directory-kicker">Accepted Abstracts</span>
                            <h2>Accepted presentations directory</h2>
                            <p>
                                Search accepted oral and poster abstracts by ID, title, or presenter name.
                            </p>
                        </div>
                        <div className="accepted-directory-summary">
                            <div className="accepted-directory-counts">
                                <div>
                                    <strong>{totalAccepted}</strong>
                                    <span>Total</span>
                                </div>
                                <div>
                                    <strong>{totalOral}</strong>
                                    <span>Oral</span>
                                </div>
                                <div>
                                    <strong>{totalPoster}</strong>
                                    <span>Poster</span>
                                </div>
                            </div>
                            <Link className="accepted-guideline-link" href={`/${locale}/program-oral-poster/presentation-guideline`}>
                                <i className="fa-solid fa-file-lines" />
                                <span>Presentation Guideline</span>
                            </Link>
                        </div>
                    </div>

                    <div className="accepted-search-panel">
                        <i className="fa-solid fa-magnifying-glass" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by abstract ID, title, or presenter name..."
                            aria-label="Search accepted abstracts"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                                <i className="fa-solid fa-xmark" />
                            </button>
                        )}
                    </div>

                    <div className="accepted-directory-toolbar">
                        <div className="accepted-filter-tabs" role="group" aria-label="Filter accepted abstracts">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={presentationFilter === option.value ? 'active' : ''}
                                    onClick={() => setPresentationFilter(option.value)}
                                    aria-pressed={presentationFilter === option.value}
                                >
                                    <span>{option.label}</span>
                                    <strong>{option.count}</strong>
                                </button>
                            ))}
                        </div>
                        <p>
                            Showing <strong>{filteredAbstracts.length}</strong> of <strong>{totalAccepted}</strong> accepted abstracts
                        </p>
                    </div>

                    {loading ? (
                        <div className="accepted-loading-state">
                            <div className="accepted-loading-line" />
                            <div className="accepted-loading-line" />
                            <div className="accepted-loading-line" />
                        </div>
                    ) : error ? (
                        <div className="accepted-error-state">
                            <i className="fa-solid fa-triangle-exclamation" />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <AbstractList items={filteredAbstracts} locale={locale} />
                    )}
                </div>
            </div>

            <style jsx global>{`
                .accepted-abstracts-directory {
                    background: #ffffff;
                    padding: 92px 0 104px;
                }

                .accepted-directory-shell {
                    margin: 0 auto;
                    max-width: 1200px;
                }

                .accepted-directory-header {
                    align-items: center;
                    display: grid;
                    gap: 28px;
                    grid-template-columns: minmax(0, 1fr) auto;
                    margin-bottom: 28px;
                }

                .accepted-directory-kicker {
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

                .accepted-directory-kicker::before {
                    background: #ffba00;
                    content: "";
                    display: inline-block;
                    height: 3px;
                    width: 42px;
                }

                .accepted-directory-header h2 {
                    color: #101828;
                    font-size: clamp(32px, 4vw, 52px);
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.05;
                    margin: 0 0 16px;
                    max-width: 820px;
                }

                .accepted-directory-header p {
                    color: #536170;
                    font-size: 17px;
                    line-height: 1.7;
                    margin: 0;
                    max-width: 720px;
                }

                .accepted-directory-summary {
                    display: grid;
                    gap: 14px;
                    justify-items: stretch;
                }

                .accepted-directory-counts {
                    display: grid;
                    gap: 12px;
                    grid-template-columns: repeat(3, 1fr);
                    min-width: 360px;
                }

                .accepted-directory-counts div {
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    box-shadow: 0 14px 34px rgba(14, 23, 49, 0.08);
                    padding: 18px 16px;
                    text-align: center;
                }

                .accepted-directory-counts strong {
                    color: #101828;
                    display: block;
                    font-size: 34px;
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 6px;
                }

                .accepted-directory-counts span {
                    color: #667085;
                    font-size: 13px;
                    font-weight: 900;
                    letter-spacing: 0.9px;
                    text-transform: uppercase;
                }

                .accepted-guideline-link {
                    align-items: center;
                    background: #1a237e;
                    border: 1px solid #1a237e;
                    border-radius: 8px;
                    box-shadow: 0 16px 34px rgba(26, 35, 126, 0.18);
                    color: #ffffff;
                    display: flex;
                    font-size: 15px;
                    font-weight: 900;
                    gap: 10px;
                    justify-content: center;
                    min-height: 48px;
                    padding: 12px 16px;
                    text-decoration: none;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                }

                .accepted-guideline-link:hover {
                    background: #111a66;
                    border-color: #111a66;
                    box-shadow: 0 18px 38px rgba(26, 35, 126, 0.24);
                    color: #ffffff;
                    transform: translateY(-1px);
                }

                .accepted-guideline-link:active {
                    transform: translateY(1px);
                }

                .accepted-search-panel {
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    box-shadow: 0 18px 42px rgba(14, 23, 49, 0.08);
                    display: grid;
                    gap: 14px;
                    grid-template-columns: 24px minmax(0, 1fr) auto;
                    margin-bottom: 18px;
                    min-height: 66px;
                    padding: 0 18px;
                }

                .accepted-search-panel > i {
                    color: #1a237e;
                    font-size: 18px;
                    text-align: center;
                }

                .accepted-search-panel input {
                    border: 0;
                    color: #101828;
                    font-size: 16px;
                    font-weight: 700;
                    height: 64px;
                    outline: 0;
                    width: 100%;
                }

                .accepted-search-panel input::placeholder {
                    color: #98a2b3;
                    font-weight: 700;
                }

                .accepted-search-panel button {
                    align-items: center;
                    background: #f2f4f7;
                    border: 0;
                    border-radius: 8px;
                    color: #475467;
                    cursor: pointer;
                    display: flex;
                    height: 36px;
                    justify-content: center;
                    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                    width: 36px;
                }

                .accepted-search-panel button:hover {
                    background: #e7ecf4;
                    color: #1a237e;
                }

                .accepted-search-panel button:active,
                .accepted-filter-tabs button:active {
                    transform: translateY(1px);
                }

                .accepted-search-panel:focus-within {
                    border-color: rgba(26, 35, 126, 0.45);
                    box-shadow: 0 18px 42px rgba(14, 23, 49, 0.08), 0 0 0 4px rgba(26, 35, 126, 0.08);
                }

                .accepted-directory-toolbar {
                    align-items: center;
                    display: grid;
                    gap: 18px;
                    grid-template-columns: minmax(0, 1fr) auto;
                    margin-bottom: 26px;
                }

                .accepted-filter-tabs {
                    background: #edf2f8;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    display: grid;
                    gap: 4px;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    max-width: 560px;
                    padding: 5px;
                }

                .accepted-filter-tabs button {
                    align-items: center;
                    background: transparent;
                    border: 0;
                    border-radius: 6px;
                    color: #536170;
                    cursor: pointer;
                    display: flex;
                    font-size: 14px;
                    font-weight: 900;
                    gap: 10px;
                    justify-content: center;
                    min-height: 46px;
                    padding: 10px 14px;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }

                .accepted-filter-tabs button strong {
                    background: rgba(26, 35, 126, 0.08);
                    border-radius: 999px;
                    color: #1a237e;
                    font-size: 12px;
                    line-height: 1;
                    min-width: 32px;
                    padding: 7px 9px;
                }

                .accepted-filter-tabs button.active {
                    background: #ffffff;
                    box-shadow: 0 10px 24px rgba(14, 23, 49, 0.08);
                    color: #101828;
                }

                .accepted-filter-tabs button.active strong {
                    background: #1a237e;
                    color: #ffffff;
                }

                .accepted-directory-toolbar p {
                    color: #667085;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 1.5;
                    margin: 0;
                    text-align: right;
                }

                .accepted-directory-toolbar p strong {
                    color: #101828;
                    font-weight: 900;
                }

                .accepted-abstract-list-panel {
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    box-shadow: 0 24px 60px rgba(14, 23, 49, 0.09);
                    max-height: 760px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    scrollbar-color: #1a237e #edf2f8;
                    scrollbar-width: thin;
                    position: relative;
                }

                .accepted-abstract-list-panel::-webkit-scrollbar {
                    width: 10px;
                }

                .accepted-abstract-list-panel::-webkit-scrollbar-track {
                    background: #edf2f8;
                    border-left: 1px solid #dfe7f0;
                }

                .accepted-abstract-list-panel::-webkit-scrollbar-thumb {
                    background: #1a237e;
                    border: 2px solid #edf2f8;
                    border-radius: 999px;
                }

                .accepted-abstract-list-panel::-webkit-scrollbar-thumb:hover {
                    background: #111a66;
                }

                .accepted-abstract-list-panel::before {
                    background: linear-gradient(90deg, #ffba00 0%, #1a237e 34%, #1a237e 100%);
                    content: "";
                    height: 6px;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                }

                .accepted-abstract-list {
                    display: grid;
                    padding-top: 6px;
                }

                .accepted-abstract-card {
                    align-items: start;
                    display: grid;
                    gap: 24px;
                    grid-template-columns: 196px minmax(0, 1fr);
                    padding: 26px 32px;
                    transition: background-color 0.2s ease;
                }

                .accepted-abstract-card:hover {
                    background: #f9fbfd;
                }

                .accepted-abstract-card + .accepted-abstract-card {
                    border-top: 1px solid #edf1f7;
                }

                .accepted-card-sidebar {
                    display: grid;
                    gap: 12px;
                    min-width: 0;
                }

                .accepted-card-identity {
                    display: grid;
                    gap: 8px;
                }

                .accepted-abstract-code {
                    align-items: center;
                    background: #f6f8fb;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    color: #1a237e;
                    display: flex;
                    font-size: 13px;
                    font-weight: 900;
                    justify-content: center;
                    letter-spacing: -0.2px;
                    line-height: 1.2;
                    min-height: 44px;
                    padding: 10px 12px;
                    text-align: center;
                    word-break: break-all;
                }

                .accepted-type-badge {
                    border-radius: 8px;
                    display: block;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 0.9px;
                    line-height: 1;
                    padding: 9px 12px;
                    text-align: center;
                    text-transform: uppercase;
                }

                .accepted-type-oral {
                    background: #eef9f3;
                    color: #067647;
                }

                .accepted-type-poster {
                    background: #fff7e0;
                    color: #a15c00;
                }

                .accepted-schedule-details {
                    border-radius: 10px;
                    min-width: 0;
                    overflow: hidden;
                }

                .accepted-schedule-oral {
                    background: linear-gradient(180deg, #f3faf6 0%, #eef8f2 100%);
                    border: 1px solid #cce8d8;
                }

                .accepted-schedule-poster {
                    background: linear-gradient(180deg, #fff9eb 0%, #fff4dc 100%);
                    border: 1px solid #f2ddb0;
                }

                .accepted-schedule-chips {
                    display: grid;
                    gap: 1px;
                    background: rgba(16, 24, 40, 0.06);
                }

                .accepted-schedule-chip {
                    background: inherit;
                    display: grid;
                    gap: 3px;
                    min-width: 0;
                    padding: 10px 12px;
                }

                .accepted-schedule-oral .accepted-schedule-chip {
                    background: #f3faf6;
                }

                .accepted-schedule-poster .accepted-schedule-chip {
                    background: #fff9eb;
                }

                .accepted-schedule-label {
                    color: #667085;
                    font-size: 10px;
                    font-weight: 900;
                    letter-spacing: 0.7px;
                    line-height: 1.2;
                    text-transform: uppercase;
                }

                .accepted-schedule-value {
                    color: #101828;
                    font-size: 12px;
                    font-weight: 800;
                    line-height: 1.35;
                    overflow-wrap: anywhere;
                }

                .accepted-abstract-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .accepted-abstract-meta span {
                    background: #eef2ff;
                    border-radius: 999px;
                    color: #1a237e;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 0.4px;
                    line-height: 1.2;
                    padding: 7px 10px;
                    text-transform: uppercase;
                }

                .accepted-abstract-content h4 {
                    color: #101828;
                    font-size: clamp(18px, 2vw, 22px);
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.35;
                    margin: 0 0 10px;
                    max-width: 920px;
                    text-wrap: pretty;
                }

                .accepted-abstract-content p {
                    color: #536170;
                    display: flex;
                    flex-direction: column;
                    font-size: 14px;
                    gap: 2px;
                    line-height: 1.55;
                    margin: 0;
                }

                .accepted-abstract-content p strong {
                    color: #101828;
                    font-weight: 900;
                }

                .accepted-empty-state,
                .accepted-loading-state,
                .accepted-error-state {
                    align-items: center;
                    background: #ffffff;
                    border: 1px dashed #cfd8e5;
                    border-radius: 8px;
                    color: #667085;
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin: 30px;
                    min-height: 120px;
                    padding: 24px;
                    text-align: center;
                }

                .accepted-loading-state,
                .accepted-error-state {
                    margin: 0;
                    min-height: 180px;
                }

                .accepted-loading-state {
                    align-items: stretch;
                    display: grid;
                    gap: 14px;
                    padding: 30px;
                }

                .accepted-loading-line {
                    animation: acceptedPulse 1.4s ease-in-out infinite;
                    background: linear-gradient(90deg, #eef2f7 0%, #f8fafc 45%, #eef2f7 100%);
                    border-radius: 8px;
                    min-height: 72px;
                }

                .accepted-loading-line:nth-child(2) {
                    animation-delay: 0.14s;
                }

                .accepted-loading-line:nth-child(3) {
                    animation-delay: 0.28s;
                }

                .accepted-empty-state i,
                .accepted-error-state i {
                    color: #1a237e;
                    font-size: 22px;
                }

                .accepted-error-state i {
                    color: #b42318;
                }

                @keyframes acceptedPulse {
                    0%,
                    100% {
                        opacity: 0.58;
                    }

                    50% {
                        opacity: 1;
                    }
                }

                @media (max-width: 991px) {
                    .accepted-abstracts-directory {
                        padding: 72px 0 82px;
                    }

                    .accepted-directory-header,
                    .accepted-directory-toolbar {
                        grid-template-columns: 1fr;
                    }

                    .accepted-directory-summary,
                    .accepted-directory-counts {
                        min-width: 0;
                    }

                    .accepted-directory-toolbar p {
                        text-align: left;
                    }

                    .accepted-filter-tabs {
                        max-width: none;
                    }

                    .accepted-abstract-card {
                        gap: 18px;
                        grid-template-columns: 1fr;
                        padding: 22px 24px;
                    }

                    .accepted-card-sidebar {
                        gap: 14px;
                    }

                    .accepted-card-identity {
                        align-items: center;
                        grid-template-columns: minmax(0, 1fr) auto;
                        grid-template-rows: none;
                        display: grid;
                        gap: 10px;
                    }

                    .accepted-abstract-code {
                        font-size: 14px;
                        justify-content: flex-start;
                        min-height: 42px;
                        text-align: left;
                        width: 100%;
                    }

                    .accepted-type-badge {
                        min-width: 72px;
                        padding: 10px 14px;
                        white-space: nowrap;
                    }

                    .accepted-schedule-chips {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .accepted-schedule-chip {
                        padding: 12px 14px;
                    }

                    .accepted-schedule-chip:first-child {
                        grid-column: 1 / -1;
                    }

                    .accepted-abstract-content h4 {
                        font-size: 20px;
                    }
                }

                @media (max-width: 767px) {
                    .accepted-abstract-list-panel {
                        max-height: none;
                    }

                    .accepted-abstract-card {
                        padding: 20px 18px;
                    }
                }

                @media (max-width: 575px) {
                    .accepted-abstracts-directory {
                        padding: 58px 0 66px;
                    }

                    .accepted-directory-header h2 {
                        font-size: 31px;
                    }

                    .accepted-directory-counts {
                        gap: 8px;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .accepted-directory-counts div {
                        padding: 14px 8px;
                    }

                    .accepted-directory-counts strong {
                        font-size: 28px;
                        margin-bottom: 5px;
                    }

                    .accepted-directory-counts span {
                        font-size: 11px;
                        letter-spacing: 0.6px;
                    }

                    .accepted-guideline-link {
                        font-size: 13px;
                        min-height: 44px;
                        padding: 10px 12px;
                    }

                    .accepted-filter-tabs {
                        gap: 3px;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .accepted-filter-tabs button {
                        flex-direction: column;
                        gap: 6px;
                        justify-content: center;
                        min-height: 64px;
                        padding: 8px 4px;
                        text-align: center;
                    }

                    .accepted-filter-tabs button span {
                        font-size: 11px;
                        line-height: 1.15;
                    }

                    .accepted-filter-tabs button strong {
                        font-size: 11px;
                        min-width: 28px;
                        padding: 6px 7px;
                    }

                    .accepted-search-panel {
                        grid-template-columns: 22px minmax(0, 1fr) auto;
                    }

                    .accepted-abstract-card {
                        gap: 12px;
                        padding: 18px 16px;
                    }

                    .accepted-card-sidebar {
                        gap: 10px;
                        width: 100%;
                    }

                    .accepted-card-identity {
                        gap: 8px;
                        grid-template-columns: 1fr 1fr;
                    }

                    .accepted-abstract-code,
                    .accepted-type-badge {
                        align-items: center;
                        display: flex;
                        justify-content: center;
                        min-height: 48px;
                        width: 100%;
                    }

                    .accepted-abstract-code {
                        font-size: 12px;
                        padding: 8px 10px;
                        text-align: center;
                    }

                    .accepted-type-badge {
                        min-width: 0;
                    }

                    .accepted-schedule-details {
                        border-radius: 8px;
                        width: 100%;
                    }

                    .accepted-schedule-chips {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .accepted-schedule-chip {
                        align-content: center;
                        min-height: 52px;
                        padding: 10px 8px;
                        text-align: center;
                    }

                    .accepted-schedule-chip:first-child {
                        grid-column: auto;
                    }

                    .accepted-schedule-label {
                        font-size: 9px;
                        letter-spacing: 0.5px;
                    }

                    .accepted-schedule-value {
                        font-size: 11px;
                    }

                    .accepted-abstract-content h4 {
                        font-size: 18px;
                    }
                }
            `}</style>
        </section>
    );
}
