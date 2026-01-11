import type { AgentTicket } from '../types';

interface JiraModalProps {
    ticket: AgentTicket;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jiraId: string) => void;
}

export function JiraEscalationModal({
    ticket,
    isOpen,
    onClose,
    onSubmit,
}: JiraModalProps) {
    if (!isOpen) return null;

    // Generate auto-populated content
    const summary = `${ticket.aiAnalysis.affectedService}: ${ticket.aiAnalysis.issueType}`;

    const description = generateJiraDescription(ticket);

    const handleSubmit = () => {
        // Mock JIRA ticket creation
        const mockJiraId = `ACME-${Math.floor(1000 + Math.random() * 9000)}`;
        onSubmit(mockJiraId);
    };

    return (
        <>
            <div className="jira-modal-overlay" onClick={onClose} />
            <div className="jira-modal">
                <div className="jira-modal-header">
                    <div className="jira-modal-title">
                        <JiraIcon />
                        <span>Create Engineering Ticket</span>
                    </div>
                    <button className="jira-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="jira-modal-body">
                    <div className="jira-form-row">
                        <div className="jira-form-group">
                            <label>Project</label>
                            <select className="jira-select" defaultValue="platform">
                                <option value="platform">ACME-Platform</option>
                                <option value="infra">ACME-Infrastructure</option>
                                <option value="integrations">ACME-Integrations</option>
                            </select>
                        </div>
                        <div className="jira-form-group">
                            <label>Type</label>
                            <select className="jira-select" defaultValue="bug">
                                <option value="bug">🐛 Bug</option>
                                <option value="task">📋 Task</option>
                                <option value="improvement">✨ Improvement</option>
                            </select>
                        </div>
                        <div className="jira-form-group">
                            <label>Priority</label>
                            <select className="jira-select" defaultValue={ticket.priority}>
                                <option value="urgent">🔴 Urgent</option>
                                <option value="high">🟠 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="jira-form-group">
                        <label>Summary <span className="auto-tag">auto-generated</span></label>
                        <input
                            type="text"
                            className="jira-input"
                            defaultValue={summary}
                        />
                    </div>

                    <div className="jira-form-group">
                        <label>Description <span className="auto-tag">auto-generated from support context</span></label>
                        <div className="jira-description-preview">
                            <pre>{description}</pre>
                        </div>
                    </div>

                    <div className="jira-options">
                        <label className="jira-checkbox">
                            <input type="checkbox" defaultChecked />
                            <span>Link support ticket {ticket.id}</span>
                        </label>
                        <label className="jira-checkbox">
                            <input type="checkbox" defaultChecked />
                            <span>Notify customer when resolved</span>
                        </label>
                    </div>
                </div>

                <div className="jira-modal-footer">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-jira" onClick={handleSubmit}>
                        <JiraIcon />
                        Create JIRA Ticket
                    </button>
                </div>
            </div>
        </>
    );
}

function generateJiraDescription(ticket: AgentTicket): string {
    const lines: string[] = [];

    lines.push('## Customer Impact');
    lines.push(`**Affecting:** ${ticket.customer.company} (${ticket.customer.planTier})`);
    lines.push(`**Customer:** ${ticket.customer.name} <${ticket.customer.email}>`);
    lines.push(`**Reported:** ${new Date(ticket.createdAt).toLocaleDateString()}`);
    lines.push(`**Account Health:** ${ticket.customer.accountHealth}`);
    lines.push('');

    lines.push('## Issue Summary');
    lines.push(ticket.aiAnalysis.whatHappened);
    lines.push('');

    lines.push('## Reproduction Steps');
    ticket.timeline.forEach((event, i) => {
        lines.push(`${i + 1}. ${event.event}`);
    });
    lines.push('');

    if (ticket.remediationAttempt) {
        lines.push('## Automated Remediation Attempted');
        ticket.remediationAttempt.steps.forEach(step => {
            const icon = step.status === 'completed' ? '✓' : '✗';
            lines.push(`${icon} ${step.description}`);
        });
        lines.push('');

        if (ticket.remediationAttempt.failureReason) {
            lines.push('## Root Cause Hypothesis');
            lines.push(ticket.remediationAttempt.failureReason);
            lines.push('');
        }
    }

    lines.push('## Recommended Action');
    lines.push(ticket.aiAnalysis.recommendedAction);
    lines.push('');

    if (ticket.logs && ticket.logs.length > 0) {
        lines.push('## Diagnostic Logs');
        lines.push('```');
        ticket.logs.forEach(log => lines.push(log));
        lines.push('```');
        lines.push('');
    }

    lines.push('## Environment');
    lines.push(`- **Browser:** ${ticket.environment.browser}`);
    lines.push(`- **OS:** ${ticket.environment.os}`);
    lines.push(`- **Page:** ${ticket.environment.page}`);

    return lines.join('\n');
}

const JiraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84H11.53zM6.77 6.8a4.36 4.36 0 0 0 4.34 4.34h1.8v1.72a4.36 4.36 0 0 0 4.34 4.34V7.63a.84.84 0 0 0-.83-.83H6.77zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.72c.01 2.39 1.95 4.34 4.34 4.34v-9.57a.84.84 0 0 0-.84-.83H2z" />
    </svg>
);
