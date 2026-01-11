import { useState, useEffect } from 'react';
import type { EmergingPattern } from './InsightsPanel';

interface EscalationModalProps {
    pattern: EmergingPattern | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

type Step = 'acknowledge' | 'aggregate' | 'review';

export function EscalationWorkflowModal({ pattern, isOpen, onClose, onComplete }: EscalationModalProps) {
    if (!isOpen || !pattern) return null;

    const [currentStep, setCurrentStep] = useState<Step>('acknowledge');
    const [emailSelection, setEmailSelection] = useState<string[]>(pattern.affectedCustomers);
    const [jiraSummary, setJiraSummary] = useState(`[Escalation] ${pattern.title}`);
    const [jiraDescription, setJiraDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (pattern) {
            setJiraDescription(generateJiraDescription(pattern));
            setEmailSelection(pattern.affectedCustomers);
        }
    }, [pattern]);

    const handleNext = () => {
        if (currentStep === 'acknowledge') setCurrentStep('aggregate');
        else if (currentStep === 'aggregate') setCurrentStep('review');
    };

    const handleBack = () => {
        if (currentStep === 'aggregate') setCurrentStep('acknowledge');
        else if (currentStep === 'review') setCurrentStep('aggregate');
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onComplete();
        }, 1500);
    };

    return (
        <>
            <div className="jira-modal-overlay" onClick={onClose} />
            <div className="escalation-modal">
                <div className="escalation-header">
                    <div className="escalation-title">
                        <RocketIcon />
                        <span>Escalation Workflow</span>
                    </div>
                    <div className="escalation-subtitle">
                        Responding to: <strong>{pattern.title}</strong>
                    </div>
                </div>

                <div className="workflow-steps">
                    <div className={`step-item ${currentStep === 'acknowledge' ? 'active' : ''} ${['aggregate', 'review'].includes(currentStep) ? 'completed' : ''}`}>
                        <div className="step-circle">1</div>
                        <span>Acknowledge</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step-item ${currentStep === 'aggregate' ? 'active' : ''} ${currentStep === 'review' ? 'completed' : ''}`}>
                        <div className="step-circle">2</div>
                        <span>Aggregate</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step-item ${currentStep === 'review' ? 'active' : ''}`}>
                        <div className="step-circle">3</div>
                        <span>Review</span>
                    </div>
                </div>

                <div className="escalation-body">
                    {currentStep === 'acknowledge' && (
                        <div className="step-content">
                            <h3>Broad Acknowledgement</h3>
                            <p className="step-desc">Notify all {pattern.affectedCustomers.length} affected customers that we are investigating.</p>

                            <div className="affected-list">
                                <div className="list-header">
                                    <input
                                        type="checkbox"
                                        checked={emailSelection.length === pattern.affectedCustomers.length}
                                        onChange={(e) => setEmailSelection(e.target.checked ? pattern.affectedCustomers : [])}
                                    />
                                    <span>Select All ({pattern.affectedCustomers.length})</span>
                                </div>
                                <div className="list-items">
                                    {pattern.affectedCustomers.map(customer => (
                                        <label key={customer} className="list-item">
                                            <input
                                                type="checkbox"
                                                checked={emailSelection.includes(customer)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setEmailSelection([...emailSelection, customer]);
                                                    else setEmailSelection(emailSelection.filter(c => c !== customer));
                                                }}
                                            />
                                            <span>{customer}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="template-preview">
                                <div className="template-label">Email Template:</div>
                                <div className="template-box">
                                    <p><strong>Subject:</strong> Investigating {pattern.affectedService} issues</p>
                                    <p>Hi [Contact Name],</p>
                                    <p>We've detected an issue affecting your {pattern.affectedService} integration. Our engineering team is currently investigating <strong>{pattern.title}</strong> as a high priority.</p>
                                    <p>We will update you as soon as we have more information.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'aggregate' && (
                        <div className="step-content">
                            <h3>Engineering Handoff</h3>
                            <p className="step-desc">Create a single JIRA ticket aggregating data from {pattern.ticketCount} user reports.</p>

                            <div className="form-group">
                                <label>Issue Summary</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={jiraSummary}
                                    onChange={(e) => setJiraSummary(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Aggregated Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows={10}
                                    value={jiraDescription}
                                    onChange={(e) => setJiraDescription(e.target.value)}
                                />
                            </div>

                            <div className="logs-attach">
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Attach {pattern.ticketCount} diagnostic log files
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep === 'review' && (
                        <div className="step-content">
                            <h3>Review & Execute</h3>
                            <p className="step-desc">Confirm actions to be taken.</p>

                            <div className="action-summary">
                                <div className="summary-item">
                                    <div className="summary-icon"><MailIcon /></div>
                                    <div className="summary-details">
                                        <strong>Send Acknowledgement Emails</strong>
                                        <span>To {emailSelection.length} customers</span>
                                    </div>
                                    <div className="summary-check">✓</div>
                                </div>

                                <div className="summary-item">
                                    <div className="summary-icon"><JiraIcon /></div>
                                    <div className="summary-details">
                                        <strong>Create JIRA Ticket</strong>
                                        <span>Project: PLATFORM • Priority: Critical</span>
                                    </div>
                                    <div className="summary-check">✓</div>
                                </div>

                                <div className="summary-item">
                                    <div className="summary-icon"><SlackIcon /></div>
                                    <div className="summary-details">
                                        <strong>Post to Slack</strong>
                                        <span>#incident-response</span>
                                    </div>
                                    <div className="summary-check">✓</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="escalation-footer">
                    {currentStep !== 'acknowledge' && (
                        <button className="btn btn-ghost" onClick={handleBack}>Back</button>
                    )}
                    <div className="spacer" />
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    {currentStep !== 'review' ? (
                        <button className="btn btn-primary" onClick={handleNext}>
                            Next Step
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Executing...' : 'Execute Workflow'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

function generateJiraDescription(pattern: EmergingPattern): string {
    return `h2. Incident Summary
${pattern.title} detected affecting ${pattern.ticketCount} customers.

h3. Impact
- **Severity**: ${pattern.severity.toUpperCase()}
- **Affected Customers**: ${pattern.affectedCustomers.join(', ')}
- **First Report**: ${pattern.firstReportedAt}

h3. Technical Analysis
Common factors identified across tickets:
${pattern.commonFactors.map(f => `- ${f}`).join('\n')}

h3. Linked Tickets
Aggregated from ${pattern.ticketCount} support tickets. See attachments for full logs.`;
}

// Icons
const RocketIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const JiraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84H11.53zM6.77 6.8a4.36 4.36 0 0 0 4.34 4.34h1.8v1.72a4.36 4.36 0 0 0 4.34 4.34V7.63a.84.84 0 0 0-.83-.83H6.77zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.72c.01 2.39 1.95 4.34 4.34 4.34v-9.57a.84.84 0 0 0-.84-.83H2z" />
    </svg>
);

const SlackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.52v-6.315zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52h-2.52zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.527 2.527 0 0 1 2.523-2.522h6.314a2.527 2.527 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.523h-6.314z" />
    </svg>
);
