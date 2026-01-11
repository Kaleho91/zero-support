import { useState } from 'react';

export interface EmergingPattern {
    id: string;
    title: string;
    severity: 'critical' | 'warning' | 'info';
    ticketCount: number;
    baselineRate: number; // Normal tickets per hour
    currentRate: number; // Current tickets per hour
    affectedCustomers: string[];
    commonFactors: string[];
    firstReportedAt: string;
    issueType: string;
    affectedService: string;
}

// Mock emerging patterns
const mockPatterns: EmergingPattern[] = [
    {
        id: 'pattern-1',
        title: 'Salesforce OAuth Failures',
        severity: 'critical',
        ticketCount: 12,
        baselineRate: 0.5,
        currentRate: 6,
        affectedCustomers: ['TechCorp Industries', 'Acme Co', 'StartupXYZ', 'DataFlow Inc', 'CloudSync Labs', 'Enterprise Solutions'],
        commonFactors: ['All using Connected App v2.3', 'OAuth refresh token revoked', 'Started after 2pm EST'],
        firstReportedAt: '2 hours ago',
        issueType: 'Integration Authentication Failure',
        affectedService: 'Salesforce Sync',
    },
    {
        id: 'pattern-2',
        title: 'Dashboard Loading Delays',
        severity: 'warning',
        ticketCount: 5,
        baselineRate: 1,
        currentRate: 2.5,
        affectedCustomers: ['MegaCorp', 'TechStart'],
        commonFactors: ['Large dataset users (>100k records)', 'Chrome browser'],
        firstReportedAt: '45 min ago',
        issueType: 'Performance Issue',
        affectedService: 'Dashboard',
    },
];

interface InsightsPanelProps {
    onStartEscalation: (pattern: EmergingPattern) => void;
    onViewTickets: (pattern: EmergingPattern) => void;
}

export function InsightsPanel({ onStartEscalation, onViewTickets }: InsightsPanelProps) {
    const [patterns] = useState<EmergingPattern[]>(mockPatterns);
    const [dismissedPatterns, setDismissedPatterns] = useState<Set<string>>(new Set());

    const activePatterns = patterns.filter(p => !dismissedPatterns.has(p.id));
    const criticalCount = activePatterns.filter(p => p.severity === 'critical').length;

    const handleDismiss = (patternId: string) => {
        setDismissedPatterns(prev => new Set([...prev, patternId]));
    };

    const getChangePercentage = (pattern: EmergingPattern) => {
        return Math.round(((pattern.currentRate - pattern.baselineRate) / pattern.baselineRate) * 100);
    };

    return (
        <div className="insights-panel">
            <div className="insights-header">
                <div className="insights-title">
                    <RadarIcon />
                    <span>Pattern Detection</span>
                    {criticalCount > 0 && (
                        <span className="critical-badge">{criticalCount} Critical</span>
                    )}
                </div>
                <div className="insights-subtitle">
                    Monitoring {patterns.length} potential patterns across all tickets
                </div>
            </div>

            {activePatterns.length === 0 ? (
                <div className="no-patterns">
                    <CheckCircleIcon />
                    <span>No emerging patterns detected. All systems nominal.</span>
                </div>
            ) : (
                <div className="patterns-list">
                    {activePatterns.map(pattern => (
                        <div key={pattern.id} className={`pattern-card severity-${pattern.severity}`}>
                            <div className="pattern-header">
                                <div className="pattern-severity">
                                    {pattern.severity === 'critical' && <AlertTriangleIcon />}
                                    {pattern.severity === 'warning' && <AlertIcon />}
                                    {pattern.severity === 'info' && <InfoIcon />}
                                    <span className="severity-label">{pattern.severity.toUpperCase()}</span>
                                </div>
                                <button
                                    className="dismiss-btn"
                                    onClick={() => handleDismiss(pattern.id)}
                                    title="Dismiss this pattern"
                                >
                                    ×
                                </button>
                            </div>

                            <h3 className="pattern-title">{pattern.title}</h3>

                            <div className="pattern-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{pattern.ticketCount}</span>
                                    <span className="stat-label">tickets</span>
                                </div>
                                <div className="stat-item highlight">
                                    <span className="stat-value">↑{getChangePercentage(pattern)}%</span>
                                    <span className="stat-label">vs baseline</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{pattern.affectedCustomers.length}</span>
                                    <span className="stat-label">customers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{pattern.firstReportedAt}</span>
                                    <span className="stat-label">first report</span>
                                </div>
                            </div>

                            <div className="pattern-details">
                                <div className="detail-section">
                                    <h4>Affected Customers</h4>
                                    <div className="customer-tags">
                                        {pattern.affectedCustomers.slice(0, 4).map((customer, i) => (
                                            <span key={i} className="customer-tag">{customer}</span>
                                        ))}
                                        {pattern.affectedCustomers.length > 4 && (
                                            <span className="customer-tag more">
                                                +{pattern.affectedCustomers.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Common Factors</h4>
                                    <ul className="factors-list">
                                        {pattern.commonFactors.map((factor, i) => (
                                            <li key={i}>{factor}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pattern-actions">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => onViewTickets(pattern)}
                                >
                                    <TicketIcon />
                                    View {pattern.ticketCount} Tickets
                                </button>
                                <button
                                    className="btn btn-primary-danger"
                                    onClick={() => onStartEscalation(pattern)}
                                >
                                    <RocketIcon />
                                    Start Escalation Workflow
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Icons
const RadarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l8-8" /><path d="M12 2v10" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
    </svg>
);

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const TicketIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
    </svg>
);

const RocketIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);
