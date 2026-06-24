'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { ABSTRACT_SUBMISSION_IS_CLOSED } from '@/lib/abstractSubmissionStatus';

type AbstractStatusValue = 'all' | 'pending' | 'accepted' | 'rejected';

type CoAuthor = {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    email?: string | null;
    institution?: string | null;
    country?: string | null;
};

type AbstractItem = {
    id: number;
    trackingId?: string | null;
    title?: string | null;
    category?: string | null;
    presentationType?: 'oral' | 'poster' | string | null;
    status?: 'pending' | 'accepted' | 'rejected' | string;
    keywords?: string | null;
    background?: string | null;
    objective?: string | null;
    methods?: string | null;
    results?: string | null;
    conclusion?: string | null;
    fullPaperUrl?: string | null;
    createdAt?: string | null;
    reviewComments?: string | null;
    author?: CoAuthor | null;
    coAuthors?: CoAuthor[];
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

const statusMeta: Record<string, { label: string; icon: string; tone: string }> = {
    pending: { label: 'Under Review', icon: 'fa-clock', tone: 'amber' },
    accepted: { label: 'Accepted', icon: 'fa-circle-check', tone: 'green' },
    rejected: { label: 'Rejected', icon: 'fa-circle-xmark', tone: 'red' },
};

const fullName = (person?: CoAuthor | null) =>
    [person?.firstName, person?.middleName, person?.lastName].filter(Boolean).join(' ').trim();

const formatDate = (value?: string | null) => {
    if (!value) return 'Not available';
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Bangkok',
    });
};

const normalize = (value?: string | null) => (value || '').toLowerCase();

function StatusPill({ status }: { status?: string }) {
    const meta = statusMeta[status || 'pending'] || statusMeta.pending;

    return (
        <span className={`abstract-status-pill abstract-status-pill-${meta.tone}`}>
            <i className={`fa-solid ${meta.icon}`} />
            {meta.label}
        </span>
    );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: number; icon: string; tone: string }) {
    return (
        <div className={`abstract-status-metric abstract-status-metric-${tone}`}>
            <span>
                <i className={`fa-solid ${icon}`} />
            </span>
            <div>
                <strong>{value}</strong>
                <small>{label}</small>
            </div>
        </div>
    );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="abstract-detail-info">
            <span>{label}</span>
            <strong>{children || 'Not available'}</strong>
        </div>
    );
}

export default function AbstractStatusPage() {
    const locale = useLocale();
    const { user, token, isAuthenticated } = useAuth();
    const [abstracts, setAbstracts] = useState<AbstractItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<AbstractStatusValue>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        const fetchAbstracts = async () => {
            if (!user || !token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/api/abstracts/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch abstracts');
                }

                const data = await response.json();
                const items = (data.abstracts || []) as AbstractItem[];

                if (!ignore) {
                    setAbstracts(items);
                    setSelectedId(items[0]?.id || null);
                }
            } catch (err) {
                console.error('Failed to load abstracts:', err);
                if (!ignore) {
                    setError('Unable to load your abstracts right now.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchAbstracts();

        return () => {
            ignore = true;
        };
    }, [user, token]);

    const metrics = useMemo(() => ({
        total: abstracts.length,
        accepted: abstracts.filter((item) => item.status === 'accepted').length,
        pending: abstracts.filter((item) => item.status === 'pending').length,
        rejected: abstracts.filter((item) => item.status === 'rejected').length,
    }), [abstracts]);

    const filteredAbstracts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return abstracts.filter((item) => {
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }

            if (!keyword) {
                return true;
            }

            const haystack = [
                item.trackingId,
                item.title,
                item.category,
                item.presentationType,
                item.status,
                fullName(item.author),
                item.author?.institution,
                item.keywords,
            ].map(normalize).join(' ');

            return haystack.includes(keyword);
        });
    }, [abstracts, search, statusFilter]);

    const selectedAbstract = useMemo(() => (
        abstracts.find((item) => item.id === selectedId) || filteredAbstracts[0] || null
    ), [abstracts, filteredAbstracts, selectedId]);

    const selectedPresenter = fullName(selectedAbstract?.author) || 'Not available';
    const selectedCategory = selectedAbstract?.category
        ? categoryLabels[selectedAbstract.category] || selectedAbstract.category.replace(/_/g, ' ')
        : 'Not available';

    return (
        <Layout headerStyle={1} footerStyle={1} headerBgWhite={true}>
            <main className="abstract-status-redesign">
                <section className="abstract-status-hero">
                    <div className="abstract-status-hero-copy">
                        <span>Abstract Portal</span>
                        <h1>Track your abstract review status</h1>
                        <p>
                            Review submitted abstracts, acceptance outcomes, presentation format, and submission details in one focused workspace.
                        </p>
                    </div>
                    <div className="abstract-status-hero-actions">
                        <Link href={`/${locale}/program-oral-poster`}>
                            <i className="fa-solid fa-list-check" />
                            Accepted Abstracts
                        </Link>
                        {ABSTRACT_SUBMISSION_IS_CLOSED ? (
                            <span className="abstract-status-closed">
                                <i className="fa-solid fa-lock" />
                                Submission Abstract Close
                            </span>
                        ) : (
                            <Link href={`/${locale}/abstract-submission`} className="abstract-status-primary">
                                <i className="fa-solid fa-plus" />
                                Submit Abstract
                            </Link>
                        )}
                    </div>
                </section>

                {!isAuthenticated ? (
                    <section className="abstract-status-auth-state">
                        <i className="fa-solid fa-user-lock" />
                        <h2>Sign in to view your abstract status</h2>
                        <p>Your submitted abstracts are linked to your registered ACCP 2026 account.</p>
                        <Link href={`/${locale}/login`}>Login</Link>
                    </section>
                ) : (
                    <>
                        <section className="abstract-status-metrics-grid">
                            <MetricCard label="Submitted" value={metrics.total} icon="fa-file-lines" tone="blue" />
                            <MetricCard label="Accepted" value={metrics.accepted} icon="fa-circle-check" tone="green" />
                            <MetricCard label="Under Review" value={metrics.pending} icon="fa-clock" tone="amber" />
                            <MetricCard label="Rejected" value={metrics.rejected} icon="fa-circle-xmark" tone="red" />
                        </section>

                        <section className="abstract-status-workspace">
                            <aside className="abstract-status-sidebar">
                                <div className="abstract-status-tools">
                                    <div className="abstract-status-search">
                                        <i className="fa-solid fa-magnifying-glass" />
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            placeholder="Search title, ID, category..."
                                            aria-label="Search abstracts"
                                        />
                                        {search && (
                                            <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="abstract-status-tabs" aria-label="Filter abstracts by status">
                                        {(['all', 'pending', 'accepted', 'rejected'] as AbstractStatusValue[]).map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                className={statusFilter === status ? 'active' : ''}
                                                onClick={() => setStatusFilter(status)}
                                            >
                                                {status === 'all' ? 'All' : statusMeta[status].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="abstract-status-loading">
                                        <i className="fa-solid fa-spinner fa-spin" />
                                        Loading abstracts...
                                    </div>
                                ) : error ? (
                                    <div className="abstract-status-error">
                                        <i className="fa-solid fa-triangle-exclamation" />
                                        {error}
                                    </div>
                                ) : filteredAbstracts.length === 0 ? (
                                    <div className="abstract-status-empty">
                                        <i className="fa-solid fa-inbox" />
                                        <h3>No abstracts found</h3>
                                        <p>Try clearing the search or changing the filter.</p>
                                    </div>
                                ) : (
                                    <div className="abstract-status-list">
                                        {filteredAbstracts.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`abstract-status-row ${selectedAbstract?.id === item.id ? 'active' : ''}`}
                                                onClick={() => setSelectedId(item.id)}
                                            >
                                                <span className="abstract-row-code">{item.trackingId || `ABS-${item.id}`}</span>
                                                <span className="abstract-row-title">{item.title || 'Untitled abstract'}</span>
                                                <span className="abstract-row-meta">
                                                    {item.presentationType === 'oral' ? 'Oral' : 'Poster'} · {formatDate(item.createdAt)}
                                                </span>
                                                <StatusPill status={item.status} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </aside>

                            <section className="abstract-status-detail-panel">
                                {selectedAbstract ? (
                                    <>
                                        <div className="abstract-detail-header">
                                            <div>
                                                <span>{selectedAbstract.trackingId || `ABS-${selectedAbstract.id}`}</span>
                                                <h2>{selectedAbstract.title || 'Untitled abstract'}</h2>
                                            </div>
                                            <StatusPill status={selectedAbstract.status} />
                                        </div>

                                        <div className="abstract-detail-info-grid">
                                            <InfoBlock label="Presenter">{selectedPresenter}</InfoBlock>
                                            <InfoBlock label="Presentation">{selectedAbstract.presentationType === 'oral' ? 'Oral Presentation' : 'Poster Presentation'}</InfoBlock>
                                            <InfoBlock label="Category">{selectedCategory}</InfoBlock>
                                            <InfoBlock label="Submitted">{formatDate(selectedAbstract.createdAt)}</InfoBlock>
                                        </div>

                                        {selectedAbstract.keywords && (
                                            <div className="abstract-keyword-strip">
                                                {selectedAbstract.keywords.split(',').map((keyword) => (
                                                    <span key={keyword}>{keyword.trim()}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="abstract-detail-content">
                                            {[
                                                ['Background', selectedAbstract.background],
                                                ['Objective', selectedAbstract.objective],
                                                ['Methods', selectedAbstract.methods],
                                                ['Results', selectedAbstract.results],
                                                ['Conclusion', selectedAbstract.conclusion],
                                            ].filter(([, value]) => value).map(([label, value]) => (
                                                <article key={label}>
                                                    <h3>{label}</h3>
                                                    <p>{value}</p>
                                                </article>
                                            ))}
                                        </div>

                                        {selectedAbstract.coAuthors && selectedAbstract.coAuthors.length > 0 && (
                                            <div className="abstract-coauthor-panel">
                                                <h3>Co-authors</h3>
                                                <div>
                                                    {selectedAbstract.coAuthors.map((author, index) => (
                                                        <span key={`${author.email || index}-${index}`}>
                                                            {index + 1}. {fullName(author) || 'Unnamed author'}
                                                            {author.institution ? ` · ${author.institution}` : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedAbstract.fullPaperUrl && (
                                            <a className="abstract-file-link" href={selectedAbstract.fullPaperUrl} target="_blank" rel="noreferrer">
                                                <i className="fa-solid fa-file-pdf" />
                                                View Uploaded File
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <div className="abstract-status-empty abstract-status-detail-empty">
                                        <i className="fa-solid fa-file-circle-info" />
                                        <h3>Select an abstract</h3>
                                        <p>Your abstract details will appear here.</p>
                                    </div>
                                )}
                            </section>
                        </section>
                    </>
                )}
            </main>

            <style jsx global>{`
                .abstract-status-redesign {
                    background:
                        linear-gradient(180deg, #f7f9fc 0%, #ffffff 44%, #f8fafc 100%);
                    min-height: 100vh;
                    padding: 118px 24px 94px;
                }

                .abstract-status-redesign > section {
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 1220px;
                }

                .abstract-status-hero {
                    align-items: end;
                    display: grid;
                    gap: 30px;
                    grid-template-columns: minmax(0, 1fr) auto;
                    margin-bottom: 28px;
                }

                .abstract-status-hero-copy span {
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

                .abstract-status-hero-copy span::before {
                    background: #ffba00;
                    content: "";
                    display: inline-block;
                    height: 3px;
                    width: 42px;
                }

                .abstract-status-hero h1 {
                    color: #101828;
                    font-size: clamp(34px, 5vw, 62px);
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.02;
                    margin: 0 0 16px;
                    max-width: 820px;
                }

                .abstract-status-hero p {
                    color: #536170;
                    font-size: 17px;
                    line-height: 1.75;
                    margin: 0;
                    max-width: 720px;
                }

                .abstract-status-hero-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .abstract-status-hero-actions a,
                .abstract-status-closed {
                    align-items: center;
                    border-radius: 8px;
                    display: inline-flex;
                    font-size: 14px;
                    font-weight: 900;
                    gap: 10px;
                    min-height: 48px;
                    padding: 13px 18px;
                    text-decoration: none;
                }

                .abstract-status-hero-actions a {
                    background: #ffffff;
                    border: 1px solid #dfe7f0;
                    color: #1a237e;
                    box-shadow: 0 14px 32px rgba(14, 23, 49, 0.08);
                }

                .abstract-status-hero-actions .abstract-status-primary {
                    background: #1a237e;
                    border-color: #1a237e;
                    color: #ffffff;
                }

                .abstract-status-closed {
                    background: #f2f4f7;
                    border: 1px solid #d0d5dd;
                    color: #667085;
                }

                .abstract-status-metrics-grid {
                    display: grid;
                    gap: 16px;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    margin-bottom: 28px;
                }

                .abstract-status-metric {
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    box-shadow: 0 18px 42px rgba(14, 23, 49, 0.08);
                    display: flex;
                    gap: 14px;
                    padding: 18px;
                }

                .abstract-status-metric > span {
                    align-items: center;
                    border-radius: 8px;
                    display: flex;
                    font-size: 18px;
                    height: 46px;
                    justify-content: center;
                    width: 46px;
                }

                .abstract-status-metric strong {
                    color: #101828;
                    display: block;
                    font-size: 31px;
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .abstract-status-metric small {
                    color: #667085;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 0.9px;
                    text-transform: uppercase;
                }

                .abstract-status-metric-blue > span { background: #eef2ff; color: #1a237e; }
                .abstract-status-metric-green > span { background: #dff8ed; color: #047857; }
                .abstract-status-metric-amber > span { background: #fff0c9; color: #a35b00; }
                .abstract-status-metric-red > span { background: #fee4e2; color: #b42318; }

                .abstract-status-workspace {
                    align-items: start;
                    display: grid;
                    gap: 28px;
                    grid-template-columns: minmax(360px, 0.72fr) minmax(0, 1fr);
                }

                .abstract-status-sidebar,
                .abstract-status-detail-panel,
                .abstract-status-auth-state {
                    background: #ffffff;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    box-shadow: 0 24px 60px rgba(14, 23, 49, 0.09);
                }

                .abstract-status-tools {
                    border-bottom: 1px solid #edf1f7;
                    padding: 22px;
                }

                .abstract-status-search {
                    align-items: center;
                    background: #f8fafc;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    display: grid;
                    gap: 10px;
                    grid-template-columns: 18px minmax(0, 1fr) auto;
                    margin-bottom: 14px;
                    min-height: 52px;
                    padding: 0 13px;
                }

                .abstract-status-search i {
                    color: #1a237e;
                }

                .abstract-status-search input {
                    background: transparent;
                    border: 0;
                    color: #101828;
                    font-size: 14px;
                    font-weight: 800;
                    height: 50px;
                    outline: 0;
                    width: 100%;
                }

                .abstract-status-search button {
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    color: #667085;
                    cursor: pointer;
                    display: flex;
                    height: 30px;
                    justify-content: center;
                    width: 30px;
                }

                .abstract-status-tabs {
                    display: grid;
                    gap: 8px;
                    grid-template-columns: repeat(4, 1fr);
                }

                .abstract-status-tabs button {
                    background: #ffffff;
                    border: 1px solid #dfe7f0;
                    border-radius: 8px;
                    color: #667085;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 900;
                    min-height: 40px;
                    padding: 8px;
                }

                .abstract-status-tabs button.active {
                    background: #1a237e;
                    border-color: #1a237e;
                    color: #ffffff;
                }

                .abstract-status-list {
                    display: grid;
                    max-height: 740px;
                    overflow: auto;
                }

                .abstract-status-row {
                    background: #ffffff;
                    border: 0;
                    border-bottom: 1px solid #edf1f7;
                    cursor: pointer;
                    display: grid;
                    gap: 7px;
                    justify-items: start;
                    padding: 20px 22px;
                    text-align: left;
                }

                .abstract-status-row.active {
                    background: #f5f8ff;
                    box-shadow: inset 4px 0 0 #1a237e;
                }

                .abstract-row-code {
                    color: #1a237e;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 0.7px;
                }

                .abstract-row-title {
                    color: #101828;
                    font-size: 15px;
                    font-weight: 900;
                    line-height: 1.45;
                }

                .abstract-row-meta {
                    color: #667085;
                    font-size: 13px;
                    font-weight: 700;
                }

                .abstract-status-pill {
                    align-items: center;
                    border-radius: 999px;
                    display: inline-flex;
                    font-size: 12px;
                    font-weight: 900;
                    gap: 7px;
                    line-height: 1;
                    padding: 8px 10px;
                }

                .abstract-status-pill-green { background: #dff8ed; color: #047857; }
                .abstract-status-pill-amber { background: #fff0c9; color: #a35b00; }
                .abstract-status-pill-red { background: #fee4e2; color: #b42318; }

                .abstract-status-detail-panel {
                    min-height: 620px;
                    padding: 32px;
                }

                .abstract-detail-header {
                    align-items: start;
                    border-bottom: 1px solid #edf1f7;
                    display: flex;
                    gap: 18px;
                    justify-content: space-between;
                    margin-bottom: 22px;
                    padding-bottom: 24px;
                }

                .abstract-detail-header span {
                    color: #1a237e;
                    display: block;
                    font-size: 13px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }

                .abstract-detail-header h2 {
                    color: #101828;
                    font-size: clamp(24px, 3vw, 36px);
                    font-weight: 900;
                    letter-spacing: 0;
                    line-height: 1.16;
                    margin: 0;
                }

                .abstract-detail-info-grid {
                    display: grid;
                    gap: 12px;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    margin-bottom: 22px;
                }

                .abstract-detail-info {
                    background: #f8fafc;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    padding: 14px;
                }

                .abstract-detail-info span {
                    color: #667085;
                    display: block;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 0.7px;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                }

                .abstract-detail-info strong {
                    color: #101828;
                    display: block;
                    font-size: 14px;
                    font-weight: 900;
                    line-height: 1.4;
                    overflow-wrap: anywhere;
                }

                .abstract-keyword-strip {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 24px;
                }

                .abstract-keyword-strip span {
                    background: #eef2ff;
                    border-radius: 999px;
                    color: #1a237e;
                    font-size: 12px;
                    font-weight: 900;
                    padding: 8px 11px;
                }

                .abstract-detail-content {
                    display: grid;
                    gap: 16px;
                }

                .abstract-detail-content article {
                    border-left: 4px solid #ffba00;
                    padding-left: 16px;
                }

                .abstract-detail-content h3,
                .abstract-coauthor-panel h3 {
                    color: #101828;
                    font-size: 16px;
                    font-weight: 900;
                    letter-spacing: 0;
                    margin: 0 0 8px;
                }

                .abstract-detail-content p {
                    color: #475467;
                    font-size: 15px;
                    line-height: 1.75;
                    margin: 0;
                }

                .abstract-coauthor-panel {
                    background: #f8fafc;
                    border: 1px solid #e4eaf2;
                    border-radius: 8px;
                    margin-top: 24px;
                    padding: 18px;
                }

                .abstract-coauthor-panel div {
                    display: grid;
                    gap: 8px;
                }

                .abstract-coauthor-panel span {
                    color: #475467;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 1.55;
                }

                .abstract-file-link {
                    align-items: center;
                    background: #1a237e;
                    border-radius: 8px;
                    color: #ffffff;
                    display: inline-flex;
                    font-size: 14px;
                    font-weight: 900;
                    gap: 10px;
                    margin-top: 24px;
                    padding: 13px 16px;
                    text-decoration: none;
                }

                .abstract-file-link:hover {
                    color: #ffffff;
                }

                .abstract-status-loading,
                .abstract-status-error,
                .abstract-status-empty,
                .abstract-status-auth-state {
                    align-items: center;
                    color: #667085;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    justify-content: center;
                    min-height: 260px;
                    padding: 30px;
                    text-align: center;
                }

                .abstract-status-auth-state {
                    max-width: 760px;
                    min-height: 360px;
                }

                .abstract-status-auth-state i,
                .abstract-status-empty i,
                .abstract-status-loading i,
                .abstract-status-error i {
                    color: #1a237e;
                    font-size: 34px;
                }

                .abstract-status-auth-state h2,
                .abstract-status-empty h3 {
                    color: #101828;
                    font-size: 25px;
                    font-weight: 900;
                    letter-spacing: 0;
                    margin: 0;
                }

                .abstract-status-auth-state p,
                .abstract-status-empty p {
                    margin: 0;
                }

                .abstract-status-auth-state a {
                    background: #1a237e;
                    border-radius: 8px;
                    color: #ffffff;
                    font-weight: 900;
                    margin-top: 10px;
                    padding: 13px 22px;
                    text-decoration: none;
                }

                .abstract-status-detail-empty {
                    min-height: 520px;
                }

                @media (max-width: 1199px) {
                    .abstract-status-metrics-grid,
                    .abstract-detail-info-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .abstract-status-workspace {
                        grid-template-columns: 1fr;
                    }

                    .abstract-status-list {
                        max-height: none;
                    }
                }

                @media (max-width: 767px) {
                    .abstract-status-redesign {
                        padding: 94px 16px 68px;
                    }

                    .abstract-status-hero {
                        grid-template-columns: 1fr;
                    }

                    .abstract-status-hero-actions {
                        justify-content: flex-start;
                    }

                    .abstract-status-metrics-grid,
                    .abstract-detail-info-grid {
                        grid-template-columns: 1fr;
                    }

                    .abstract-status-tabs {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .abstract-detail-header {
                        flex-direction: column;
                    }

                    .abstract-status-detail-panel {
                        padding: 22px;
                    }
                }
            `}</style>
        </Layout>
    );
}
