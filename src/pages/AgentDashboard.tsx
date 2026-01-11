import { useState } from 'react';
import type { AgentTicket, TicketStatus } from '../types';
import { mockTickets } from '../data/mockTickets';
import { JiraEscalationModal } from '../components/JiraEscalationModal';
import { SmartResponseComposer } from '../components/SmartResponseComposer';
import { InsightsPanel, type EmergingPattern } from '../components/InsightsPanel';
import { EscalationWorkflowModal } from '../components/EscalationWorkflowModal';

// CRM Navigation Icons
const RadarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l8-8" /><path d="M12 2v10" />
    </svg>
);
const InboxIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
);

const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ChartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const StatusBadge = ({ status }: { status: TicketStatus }) => {
    const styles: Record<TicketStatus, { bg: string; color: string; label: string }> = {
        new: { bg: '#fef3c7', color: '#92400e', label: 'New' },
        in_progress: { bg: '#dbeafe', color: '#1e40af', label: 'In Progress' },
        pending_customer: { bg: '#f3e8ff', color: '#7c3aed', label: 'Pending Customer' },
        resolved: { bg: '#d1fae5', color: '#065f46', label: 'Resolved' },
    };
    const s = styles[status];
    return (
        <span className="agent-status-badge" style={{ backgroundColor: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
};

const PriorityIndicator = ({ priority }: { priority: string }) => {
    const colors: Record<string, string> = {
        urgent: '#dc2626',
        high: '#ea580c',
        medium: '#ca8a04',
        low: '#65a30d',
    };
    return (
        <span className="priority-dot" style={{ backgroundColor: colors[priority] }} title={priority} />
    );
};

const TicketListItem = ({
    ticket,
    isSelected,
    onClick,
    linkedJira,
}: {
    ticket: AgentTicket;
    isSelected: boolean;
    onClick: () => void;
    linkedJira?: string;
}) => (
    <div
        className={`ticket-list-item ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
    >
        <div className="ticket-list-header">
            <div className="ticket-list-id">
                <PriorityIndicator priority={ticket.priority} />
                {ticket.id}
                {linkedJira && <span className="jira-link-badge">🔗 {linkedJira}</span>}
            </div>
            <StatusBadge status={ticket.status} />
        </div>
        <div className="ticket-list-customer">{ticket.customer.name}</div>
        <div className="ticket-list-company">{ticket.customer.company}</div>
        <div className="ticket-list-issue">{ticket.aiAnalysis.issueType}</div>
        <div className="ticket-list-time">
            {new Date(ticket.createdAt).toLocaleString()}
        </div>
    </div>
);

const TicketDetail = ({
    ticket,
    linkedJira,
    onStatusChange,
    onEscalateToEngineering,
}: {
    ticket: AgentTicket;
    linkedJira?: string;
    onStatusChange: (status: TicketStatus) => void;
    onEscalateToEngineering: () => void;
}) => (
    <div className="ticket-detail">
        {/* Header */}
        <div className="ticket-detail-header">
            <div className="ticket-detail-header-left">
                <h2 className="ticket-detail-id">{ticket.id}</h2>
                <StatusBadge status={ticket.status} />
                <span className={`priority-badge priority-${ticket.priority}`}>
                    {ticket.priority.toUpperCase()}
                </span>
                {linkedJira && (
                    <span className="jira-linked-badge">
                        <JiraIcon />
                        {linkedJira}
                    </span>
                )}
            </div>
            <div className="ticket-detail-header-right">
                <select
                    className="status-select"
                    value={ticket.status}
                    onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
                >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending_customer">Pending Customer</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>
        </div>

        {/* Action Bar */}
        <div className="ticket-actions-bar">
            {!linkedJira ? (
                <button className="btn btn-jira-outline" onClick={onEscalateToEngineering}>
                    <JiraIcon />
                    Escalate to Engineering
                </button>
            ) : (
                <div className="jira-success-notice">
                    <JiraIcon />
                    <span>Linked to <strong>{linkedJira}</strong> — Engineering will be notified</span>
                </div>
            )}
        </div>

        {/* Smart Response Composer */}
        <SmartResponseComposer
            ticket={ticket}
            onUseResponse={(response) => console.log('Response used:', response)}
        />

        {/* Customer Info */}
        <div className="ticket-section">
            <h3 className="ticket-section-title">Customer</h3>
            <div className="customer-card">
                <div className="customer-avatar">
                    {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="customer-info">
                    <div className="customer-name">{ticket.customer.name}</div>
                    <div className="customer-email">{ticket.customer.email}</div>
                    <div className="customer-meta">
                        <span className="customer-company">{ticket.customer.company}</span>
                        <span className="customer-plan">{ticket.customer.planTier}</span>
                        <span className={`health-badge health-${ticket.customer.accountHealth}`}>
                            {ticket.customer.accountHealth.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* AI Analysis */}
        <div className="ticket-section">
            <h3 className="ticket-section-title">
                <span className="ai-badge">AI</span>
                Analysis Summary
            </h3>
            <div className="analysis-grid">
                <div className="analysis-item">
                    <div className="analysis-label">Issue Type</div>
                    <div className="analysis-value">{ticket.aiAnalysis.issueType}</div>
                </div>
                <div className="analysis-item">
                    <div className="analysis-label">Affected Service</div>
                    <div className="analysis-value">{ticket.aiAnalysis.affectedService}</div>
                </div>
                <div className="analysis-item">
                    <div className="analysis-label">Confidence</div>
                    <div className={`analysis-value confidence-${ticket.aiAnalysis.confidence}`}>
                        {ticket.aiAnalysis.confidence.toUpperCase()}
                    </div>
                </div>
                <div className="analysis-item full-width">
                    <div className="analysis-label">What Happened</div>
                    <div className="analysis-value">{ticket.aiAnalysis.whatHappened}</div>
                </div>
                <div className="analysis-item full-width">
                    <div className="analysis-label">Recommended Action</div>
                    <div className="analysis-value recommendation">{ticket.aiAnalysis.recommendedAction}</div>
                </div>
            </div>
        </div>

        {/* Remediation Attempt */}
        {ticket.remediationAttempt && (
            <div className="ticket-section">
                <h3 className="ticket-section-title">Remediation Attempted</h3>
                <div className="remediation-log">
                    {ticket.remediationAttempt.steps.map((step, i) => (
                        <div key={i} className={`remediation-step ${step.status}`}>
                            <span className="step-icon">
                                {step.status === 'completed' ? '✓' : '✗'}
                            </span>
                            {step.description}
                        </div>
                    ))}
                </div>
                {ticket.remediationAttempt.failureReason && (
                    <div className="failure-reason">
                        <strong>Why it failed:</strong> {ticket.remediationAttempt.failureReason}
                    </div>
                )}
            </div>
        )}

        {/* Timeline */}
        <div className="ticket-section">
            <h3 className="ticket-section-title">Customer Timeline</h3>
            <div className="event-timeline">
                {ticket.timeline.map((event, i) => (
                    <div key={i} className="timeline-event">
                        <div className="timeline-time">{event.time}</div>
                        <div className="timeline-text">{event.event}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Logs */}
        {ticket.logs && ticket.logs.length > 0 && (
            <div className="ticket-section">
                <h3 className="ticket-section-title">Diagnostic Logs</h3>
                <pre className="logs-output">
                    {ticket.logs.join('\n')}
                </pre>
            </div>
        )}

        {/* Environment */}
        <div className="ticket-section">
            <h3 className="ticket-section-title">Environment</h3>
            <div className="env-grid">
                <div className="env-item">
                    <span className="env-label">Browser</span>
                    <span className="env-value">{ticket.environment.browser}</span>
                </div>
                <div className="env-item">
                    <span className="env-label">OS</span>
                    <span className="env-value">{ticket.environment.os}</span>
                </div>
                <div className="env-item">
                    <span className="env-label">Page</span>
                    <span className="env-value">{ticket.environment.page}</span>
                </div>
            </div>
        </div>

        {/* Sources */}
        <div className="ticket-section">
            <h3 className="ticket-section-title">Knowledge Sources Referenced</h3>
            <div className="sources-list">
                {ticket.sourcesReferenced.map((source, i) => (
                    <span key={i} className={`source-tag source-${source.type}`}>
                        {source.title}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const JiraIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84H11.53zM6.77 6.8a4.36 4.36 0 0 0 4.34 4.34h1.8v1.72a4.36 4.36 0 0 0 4.34 4.34V7.63a.84.84 0 0 0-.83-.83H6.77zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.72c.01 2.39 1.95 4.34 4.34 4.34v-9.57a.84.84 0 0 0-.84-.83H2z" />
    </svg>
);

export function AgentDashboard() {
    const [tickets, setTickets] = useState<AgentTicket[]>(mockTickets);
    const [selectedId, setSelectedId] = useState<string>(tickets[0]?.id || '');
    const [jiraModalOpen, setJiraModalOpen] = useState(false);
    const [linkedJiras, setLinkedJiras] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<'tickets' | 'insights'>('tickets');
    const [escalationPattern, setEscalationPattern] = useState<EmergingPattern | null>(null);

    const selectedTicket = tickets.find(t => t.id === selectedId);

    const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
        setTickets(prev =>
            prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t))
        );
    };

    const handleJiraCreated = (jiraId: string) => {
        if (selectedTicket) {
            setLinkedJiras(prev => ({ ...prev, [selectedTicket.id]: jiraId }));
            // Auto-update status to show engineering is involved
            handleStatusChange(selectedTicket.id, 'in_progress');
        }
        setJiraModalOpen(false);
    };

    const newCount = tickets.filter(t => t.status === 'new').length;

    return (
        <div className="agent-dashboard">
            {/* Top Navigation Bar */}
            <nav className="crm-topnav">
                <div className="crm-topnav-left">
                    <div className="crm-logo">
                        <img src="/logo.png" alt="ZeroSupport" className="crm-logo-img" />
                        <span className="crm-product-name">ZeroSupport</span>
                    </div>
                    <div className="crm-nav-links">
                        <button
                            className={`crm-nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tickets')}
                        >
                            <InboxIcon />
                            Tickets
                            {newCount > 0 && <span className="nav-badge">{newCount}</span>}
                        </button>
                        <button
                            className={`crm-nav-link ${activeTab === 'insights' ? 'active' : ''}`}
                            onClick={() => setActiveTab('insights')}
                        >
                            <RadarIcon />
                            Insights
                        </button>
                        <button className="crm-nav-link">
                            <UsersIcon />
                            Customers
                        </button>
                        <button className="crm-nav-link">
                            <ChartIcon />
                            Analytics
                        </button>
                        <button className="crm-nav-link">
                            <SettingsIcon />
                            Settings
                        </button>
                    </div>
                </div>
                <div className="crm-topnav-right">
                    <button className="crm-search-btn">
                        <SearchIcon />
                        <span>Search tickets...</span>
                        <kbd>⌘K</kbd>
                    </button>
                    <button className="crm-notification-btn">
                        <BellIcon />
                        <span className="notification-dot" />
                    </button>
                    <div className="crm-agent-profile">
                        <div className="agent-avatar">JD</div>
                        <div className="agent-info">
                            <span className="agent-name">Jane Doe</span>
                            <span className="agent-role">Support Agent</span>
                        </div>
                    </div>
                </div>
            </nav>

            {activeTab === 'tickets' ? (
                <div className="agent-dashboard-content">
                    {/* Sub-header */}
                    <header className="agent-header">
                        <div className="agent-header-left">
                            <h1 className="agent-title">Support Queue</h1>
                            <div className="queue-filters">
                                <button className="filter-btn active">All Tickets</button>
                                <button className="filter-btn">My Tickets</button>
                                <button className="filter-btn">Unassigned</button>
                            </div>
                        </div>
                        <div className="agent-header-right">
                            <span className="queue-stats">
                                <span className="stat"><strong>{newCount}</strong> New</span>
                                <span className="stat"><strong>{tickets.filter(t => t.status === 'in_progress').length}</strong> In Progress</span>
                            </span>
                        </div>
                    </header>

                    <div className="agent-layout">
                        <div className="ticket-list">
                            {tickets.map(ticket => (
                                <TicketListItem
                                    key={ticket.id}
                                    ticket={ticket}
                                    isSelected={ticket.id === selectedId}
                                    onClick={() => setSelectedId(ticket.id)}
                                    linkedJira={linkedJiras[ticket.id]}
                                />
                            ))}
                        </div>

                        <div className="ticket-detail-panel">
                            {selectedTicket ? (
                                <TicketDetail
                                    ticket={selectedTicket}
                                    linkedJira={linkedJiras[selectedTicket.id]}
                                    onStatusChange={(status) => handleStatusChange(selectedTicket.id, status)}
                                    onEscalateToEngineering={() => setJiraModalOpen(true)}
                                />
                            ) : (
                                <div className="no-ticket-selected">
                                    Select a ticket to view details
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="agent-dashboard-content">
                    <InsightsPanel
                        onStartEscalation={(pattern) => {
                            setEscalationPattern(pattern);
                        }}
                        onViewTickets={() => {
                            setActiveTab('tickets');
                        }}
                    />
                </div>
            )}

            {/* JIRA Modal */}
            {selectedTicket && (
                <JiraEscalationModal
                    ticket={selectedTicket}
                    isOpen={jiraModalOpen}
                    onClose={() => setJiraModalOpen(false)}
                    onSubmit={handleJiraCreated}
                />
            )}

            {/* Escalation Workflow Modal */}
            <EscalationWorkflowModal
                pattern={escalationPattern}
                isOpen={!!escalationPattern}
                onClose={() => setEscalationPattern(null)}
                onComplete={() => {
                    setEscalationPattern(null);
                    // TODO: Could show a toast notification here
                }}
            />
        </div>
    );
}
