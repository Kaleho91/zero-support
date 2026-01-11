import { useState } from 'react';
import type { AgentTicket } from '../types';

interface SmartResponseProps {
    ticket: AgentTicket;
    onUseResponse: (response: string) => void;
}

type FilterType = 'all' | 'customer' | 'module' | 'high_csat';

interface ResponseStats {
    customerTickets: number;
    moduleTickets: number;
    csatScore: number;
}

// Simulated response generation based on filters and ticket context
function generateSmartResponse(ticket: AgentTicket, _filters: FilterType[]): string {
    const customerName = ticket.customer.name.split(' ')[0];
    const issueType = ticket.aiAnalysis.issueType;
    const service = ticket.aiAnalysis.affectedService;

    // Base response that adapts to context
    const responses: Record<string, string> = {
        'Integration Authentication Failure': `Hi ${customerName},

Thank you for reaching out. I can see that your ${service} integration is experiencing an authentication issue.

This typically occurs when the OAuth token has expired or been revoked. Based on similar cases we've resolved successfully, here's what usually works:

1. **Navigate to Settings → Integrations** in your dashboard
2. **Click "Reconnect"** next to ${service}
3. **Re-authorize the connection** when prompted

This should refresh your authentication tokens and restore the sync.

If you're still seeing issues after reconnecting, please let me know and I'll escalate this to our engineering team for a deeper look.

Best regards,
Jane`,

        'Data Sync Delay': `Hi ${customerName},

I see you're experiencing delays with your ${service} data sync. I understand how important timely data is for your workflow.

Looking at your account, I can see we had some processing delays in the last hour. Here's what's happening:

- **Current sync status**: Queued for processing
- **Estimated completion**: Within the next 15 minutes
- **Your data**: Safe and will sync completely

If the delay extends beyond 30 minutes, please reply to this message and I'll prioritize your sync manually.

Best regards,
Jane`,

        'UI Display Issue': `Hi ${customerName},

Thanks for reporting this display issue. I've reviewed the details you provided and have a few suggestions that typically resolve this:

1. **Clear your browser cache** (Cmd/Ctrl + Shift + Delete)
2. **Try a hard refresh** (Cmd/Ctrl + Shift + R)
3. **Check if you have any browser extensions** that might be interfering

If the issue persists after trying these steps, could you share a screenshot? This will help me understand exactly what you're seeing.

Best regards,
Jane`,
    };

    return responses[issueType] || responses['Integration Authentication Failure'];
}

function getResponseStats(_ticket: AgentTicket): ResponseStats {
    // Simulated stats based on ticket context
    return {
        customerTickets: Math.floor(Math.random() * 15) + 5,
        moduleTickets: Math.floor(Math.random() * 100) + 50,
        csatScore: 94 + Math.floor(Math.random() * 5),
    };
}

export function SmartResponseComposer({ ticket, onUseResponse }: SmartResponseProps) {
    const [activeFilters, setActiveFilters] = useState<FilterType[]>(['high_csat', 'module']);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedResponse, setEditedResponse] = useState('');

    const stats = getResponseStats(ticket);
    const suggestedResponse = generateSmartResponse(ticket, activeFilters);

    const toggleFilter = (filter: FilterType) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const handleUse = () => {
        onUseResponse(isEditing ? editedResponse : suggestedResponse);
    };

    const handleEdit = () => {
        setEditedResponse(suggestedResponse);
        setIsEditing(true);
    };

    return (
        <div className="smart-response-composer">
            <div className="smart-response-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="smart-response-title">
                    <LightbulbIcon />
                    <span>Suggested Response</span>
                    <span className="smart-response-badge">AI</span>
                </div>
                <button className="expand-btn">
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <>
                    <div className="smart-response-context">
                        Based on{' '}
                        <strong>{stats.customerTickets} similar tickets</strong> from {ticket.customer.company},{' '}
                        <strong>{stats.moduleTickets} {ticket.aiAnalysis.affectedService} resolutions</strong>, and{' '}
                        responses with <strong>{stats.csatScore}% CSAT</strong>
                    </div>

                    <div className="smart-response-filters">
                        <span className="filter-label">Optimize for:</span>
                        <button
                            className={`filter-chip ${activeFilters.includes('customer') ? 'active' : ''}`}
                            onClick={() => toggleFilter('customer')}
                        >
                            <CustomerIcon />
                            This Customer
                        </button>
                        <button
                            className={`filter-chip ${activeFilters.includes('module') ? 'active' : ''}`}
                            onClick={() => toggleFilter('module')}
                        >
                            <ModuleIcon />
                            {ticket.aiAnalysis.affectedService}
                        </button>
                        <button
                            className={`filter-chip ${activeFilters.includes('high_csat') ? 'active' : ''}`}
                            onClick={() => toggleFilter('high_csat')}
                        >
                            <StarIcon />
                            High CSAT
                        </button>
                    </div>

                    <div className="smart-response-preview">
                        {isEditing ? (
                            <textarea
                                className="response-editor"
                                value={editedResponse}
                                onChange={(e) => setEditedResponse(e.target.value)}
                                rows={12}
                            />
                        ) : (
                            <pre className="response-text">{suggestedResponse}</pre>
                        )}
                    </div>

                    <div className="smart-response-actions">
                        <button className="btn btn-primary" onClick={handleUse}>
                            <SendIcon />
                            Use This Response
                        </button>
                        {!isEditing ? (
                            <button className="btn btn-ghost" onClick={handleEdit}>
                                <EditIcon />
                                Edit
                            </button>
                        ) : (
                            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        )}
                        <button className="btn btn-ghost" onClick={() => setActiveFilters(['high_csat'])}>
                            <RefreshIcon />
                            Regenerate
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Icons
const LightbulbIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.4V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.6A7 7 0 0 0 12 2z" />
    </svg>
);

const CustomerIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const ModuleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const SendIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);
