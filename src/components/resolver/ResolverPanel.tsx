import type { ResolverAnalysis, SupportTicket, SourceCitation, RemediationAttempt } from '../../types';

interface ResolverPanelProps {
    isOpen: boolean;
    state: 'analyzing' | 'proposing' | 'confirming' | 'attempting' | 'attempt_failed' | 'escalated' | 'submitted';
    analysis: ResolverAnalysis | null;
    ticket: SupportTicket | null;
    attempt: RemediationAttempt | null;
    currentStepIndex: number;
    includeLogs: boolean;
    hasConsented: boolean;
    onClose: () => void;
    onShowConsent: () => void;
    onToggleConsent: () => void;
    onConfirmAttempt: () => void;
    onEscalate: () => void;
    onToggleLogs: () => void;
    onSubmit: () => void;
}

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M15 5L5 15M5 5l10 10" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.667 5L7.5 14.167 3.333 10" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <circle cx="8" cy="8" r="6" strokeOpacity="0.25" />
        <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
);

const SourceBadge = ({ source }: { source: SourceCitation }) => {
    const typeLabels = {
        'help-article': 'Help',
        'known-issue': 'Known Issue',
        'codebase-note': 'Technical',
    };

    return (
        <span className="source-citation">
            {typeLabels[source.type]}: {source.title}
        </span>
    );
};

const ConfidenceIndicator = ({ level, explanation }: { level: string; explanation: string }) => (
    <div className="confidence-indicator">
        <span className={`confidence-level ${level}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} confidence
        </span>
        <span className="confidence-explanation">{explanation}</span>
    </div>
);

const AnalyzingState = () => (
    <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
        <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto var(--space-4)',
            border: '3px solid var(--color-bg-tertiary)',
            borderTopColor: 'var(--color-accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        }} />
        <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Analyzing the issue...
        </p>
    </div>
);

// New: Proposing view - shows what the agent found and offers to try
const ProposingView = ({
    analysis,
    onShowConsent,
}: {
    analysis: ResolverAnalysis;
    onShowConsent: () => void;
}) => (
    <>
        <div className="resolver-body">
            <div className="resolver-section">
                <h4 className="resolver-section-title">What seems to be happening</h4>
                <div className="resolver-section-content">
                    <p>{analysis.whatIsHappening}</p>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">What I checked</h4>
                <div className="resolver-section-content">
                    <p>{analysis.whatChecked.description}</p>
                    <div className="source-list">
                        {analysis.whatChecked.sources.map((source, i) => (
                            <SourceBadge key={i} source={source} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">How confident this is</h4>
                <ConfidenceIndicator
                    level={analysis.confidence.level}
                    explanation={analysis.confidence.explanation}
                />
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">Proposed remediation</h4>
                <div className="resolution-box">
                    <div className="resolution-title">{analysis.whatUsuallyFixes.description}</div>
                    <div className="resolution-steps">
                        <p style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent-text)' }}>
                            I can attempt the following on your behalf:
                        </p>
                        <ol>
                            {analysis.whatUsuallyFixes.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <div className="resolver-footer">
            <button className="btn btn-primary" onClick={onShowConsent}>
                Try to fix this for me
            </button>
        </div>
    </>
);

// New: Confirming view - user reviews prod impact and gives consent
const ConfirmingView = ({
    attempt,
    hasConsented,
    onToggleConsent,
    onConfirmAttempt,
    onClose,
}: {
    attempt: RemediationAttempt;
    hasConsented: boolean;
    onToggleConsent: () => void;
    onConfirmAttempt: () => void;
    onClose: () => void;
}) => (
    <>
        <div className="resolver-body">
            <div className="consent-warning">
                <div className="consent-warning-icon">⚠️</div>
                <div className="consent-warning-content">
                    <h4 className="consent-warning-title">This action will modify production data</h4>
                    <p className="consent-warning-text">
                        The following changes will be made to your live Salesforce integration.
                        Please review before proceeding.
                    </p>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">Actions to be performed</h4>
                <div className="resolver-section-content">
                    <div className="action-preview">
                        {attempt.steps.map((step, i) => (
                            <div key={step.id} className="action-preview-item">
                                <span className="action-preview-number">{i + 1}</span>
                                <div className="action-preview-content">
                                    <div className="action-preview-title">{step.description}</div>
                                    <div className="action-preview-detail">{step.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">Reversal capability</h4>
                <div className="reversal-notice">
                    <div className="reversal-icon">↩️</div>
                    <div className="reversal-content">
                        <p><strong>If something goes wrong:</strong></p>
                        <ul>
                            <li>OAuth credentials can be revoked and re-established</li>
                            <li>No data will be deleted or modified in Salesforce</li>
                            <li>Sync state can be reset if the attempt fails</li>
                            <li>A support ticket can be created with full context</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="resolver-section">
                <label className="consent-checkbox">
                    <input
                        type="checkbox"
                        checked={hasConsented}
                        onChange={onToggleConsent}
                    />
                    <span className="consent-checkbox-text">
                        I understand that this will modify production integration settings and authorize ZeroSupport to proceed
                    </span>
                </label>
            </div>
        </div>

        <div className="resolver-footer">
            <button
                className="btn btn-primary"
                onClick={onConfirmAttempt}
                disabled={!hasConsented}
            >
                Proceed with remediation
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
                Cancel
            </button>
        </div>
    </>
);


// New: Attempting view - shows step-by-step progress
const AttemptingView = ({
    attempt,
    currentStepIndex,
}: {
    attempt: RemediationAttempt;
    currentStepIndex: number;
}) => (
    <div className="resolver-body">
        <div className="resolver-section">
            <h4 className="resolver-section-title">Attempting remediation</h4>
            <div className="resolver-section-content">
                <p style={{ marginBottom: 'var(--space-4)' }}>{attempt.action}</p>

                <div className="remediation-steps">
                    {attempt.steps.map((step, i) => {
                        const isActive = i === currentStepIndex;
                        const isCompleted = i < currentStepIndex;
                        const isPending = i > currentStepIndex;

                        return (
                            <div
                                key={step.id}
                                className={`remediation-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="remediation-step-indicator">
                                    {isCompleted ? (
                                        <CheckIcon />
                                    ) : isActive ? (
                                        <SpinnerIcon />
                                    ) : (
                                        <span className="step-number">{i + 1}</span>
                                    )}
                                </div>
                                <div className="remediation-step-content">
                                    <div className={`remediation-step-title ${isPending ? 'pending' : ''}`}>
                                        {step.description}
                                    </div>
                                    {(isActive || isCompleted) && (
                                        <div className="remediation-step-detail">{step.detail}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);

// New: Attempt failed view - shows what was tried and offers escalation
const AttemptFailedView = ({
    attempt,
    includeLogs,
    onToggleLogs,
    onEscalate,
}: {
    attempt: RemediationAttempt;
    includeLogs: boolean;
    onToggleLogs: () => void;
    onEscalate: () => void;
}) => (
    <>
        <div className="resolver-body">
            <div className="resolver-section">
                <div className="attempt-failed-header">
                    <div className="attempt-failed-icon">!</div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: 'var(--text-base)' }}>Unable to resolve automatically</h4>
                        <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                            The automated remediation was unsuccessful.
                        </p>
                    </div>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">What was attempted</h4>
                <div className="resolver-section-content">
                    <p style={{ marginBottom: 'var(--space-3)' }}>{attempt.action}</p>
                    <div className="remediation-steps compact">
                        {attempt.steps.map((step, i) => (
                            <div key={step.id} className="remediation-step completed compact">
                                <div className="remediation-step-indicator small">
                                    <CheckIcon />
                                </div>
                                <span className="remediation-step-title">{step.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">Why it didn't work</h4>
                <div className="resolver-section-content">
                    <p>{attempt.failureReason}</p>
                </div>
            </div>

            <div className="resolver-section">
                <h4 className="resolver-section-title">Ticket options</h4>
                <div className="resolver-section-content">
                    <label className="log-toggle">
                        <input
                            type="checkbox"
                            checked={includeLogs}
                            onChange={onToggleLogs}
                        />
                        <span className="log-toggle-text">
                            Include diagnostic logs
                            <span className="log-toggle-hint">Helps support engineers diagnose faster</span>
                        </span>
                    </label>
                </div>
            </div>
        </div>

        <div className="resolver-footer">
            <button className="btn btn-primary" onClick={onEscalate}>
                Create support ticket
            </button>
        </div>
    </>
);

const TicketView = ({ ticket, onClose, onSubmit }: { ticket: SupportTicket; onClose: () => void; onSubmit: () => void }) => (
    <>
        <div className="resolver-body">
            <div className="ticket-preview">
                <div className="ticket-header">
                    <div className="ticket-header-icon">
                        <CheckIcon />
                    </div>
                    <div className="ticket-header-text">
                        <h3>Support ticket ready</h3>
                        <p>This context will help the support team resolve your issue faster.</p>
                    </div>
                </div>

                <div className="ticket-section">
                    <h4 className="ticket-section-title">Issue Summary</h4>
                    <div className="ticket-section-content">
                        {ticket.summary}
                    </div>
                </div>

                <div className="ticket-section">
                    <h4 className="ticket-section-title">Action Timeline</h4>
                    <div className="ticket-section-content">
                        <div className="ticket-timeline">
                            {ticket.timeline.map((item, i) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-time">{item.time}</div>
                                    <div className="timeline-action">{item.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ticket-section">
                    <h4 className="ticket-section-title">Environment</h4>
                    <div className="ticket-section-content">
                        <ul>
                            <li><strong>Browser:</strong> {ticket.environment.browser}</li>
                            <li><strong>OS:</strong> {ticket.environment.os}</li>
                            <li><strong>Page:</strong> {ticket.environment.page}</li>
                        </ul>
                    </div>
                </div>

                <div className="ticket-section">
                    <h4 className="ticket-section-title">Hypotheses</h4>
                    <div className="ticket-section-content">
                        <ul>
                            {ticket.hypotheses.map((h, i) => (
                                <li key={i}>{h}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {ticket.logs && ticket.logs.length > 0 && (
                    <div className="ticket-section">
                        <h4 className="ticket-section-title">Diagnostic Logs</h4>
                        <div className="ticket-section-content logs">
                            <pre className="log-output">
                                {ticket.logs.join('\n')}
                            </pre>
                        </div>
                    </div>
                )}

                <div className="ticket-section">
                    <h4 className="ticket-section-title">Sources Referenced</h4>
                    <div className="ticket-section-content">
                        <div className="source-list" style={{ marginTop: 0 }}>
                            {ticket.sourcesReferenced.map((source, i) => (
                                <SourceBadge key={i} source={source} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="resolver-footer">
            <button className="btn btn-primary" onClick={onSubmit}>
                Submit to support
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
                Close
            </button>
        </div>
    </>
);

const SubmittedView = ({ onClose }: { onClose: () => void }) => (
    <>
        <div className="resolver-body">
            <div className="submitted-success">
                <div className="submitted-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#ecfdf5" />
                        <path d="M32 18L21 29L16 24" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="submitted-title">Ticket submitted</h3>
                <p className="submitted-description">
                    Your support ticket has been submitted. A support engineer will review your case and reach out shortly.
                </p>
                <div className="submitted-ticket-id">
                    Ticket ID: <strong>ZS-2026-00847</strong>
                </div>
                <p className="submitted-note">
                    You'll receive an email confirmation with tracking details.
                </p>
            </div>
        </div>

        <div className="resolver-footer">
            <button className="btn btn-primary" onClick={onClose}>
                Done
            </button>
        </div>
    </>
);

export function ResolverPanel({
    isOpen,
    state,
    analysis,
    ticket,
    attempt,
    currentStepIndex,
    includeLogs,
    hasConsented,
    onClose,
    onShowConsent,
    onToggleConsent,
    onConfirmAttempt,
    onEscalate,
    onToggleLogs,
    onSubmit,
}: ResolverPanelProps) {
    const getTitle = () => {
        switch (state) {
            case 'analyzing':
                return 'Analyzing the issue';
            case 'proposing':
                return 'Issue identified';
            case 'confirming':
                return 'Review before proceeding';
            case 'attempting':
                return 'Attempting to resolve';
            case 'attempt_failed':
                return 'Unable to resolve automatically';
            case 'escalated':
                return 'Escalate to support';
            case 'submitted':
                return 'Success';
            default:
                return 'ZeroSupport';
        }
    };

    const getSubtitle = () => {
        switch (state) {
            case 'analyzing':
                return 'Searching knowledge base and analyzing context...';
            case 'proposing':
                return 'Review the findings and let me try to fix it';
            case 'confirming':
                return 'This action will affect production data';
            case 'attempting':
                return 'Please wait while I attempt the remediation...';
            case 'attempt_failed':
                return 'A support engineer will need to help with this';
            case 'escalated':
                return 'Review the information that will be shared';
            case 'submitted':
                return 'Your ticket has been submitted';
            default:
                return '';
        }
    };

    return (
        <>
            <div
                className={`resolver-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <div className={`resolver-panel ${isOpen ? 'open' : ''}`}>
                <div className="resolver-header">
                    <div>
                        <h2 className="resolver-title">{getTitle()}</h2>
                        <p className="resolver-subtitle">{getSubtitle()}</p>
                    </div>
                    <button className="resolver-close" onClick={onClose} aria-label="Close panel">
                        <CloseIcon />
                    </button>
                </div>

                {state === 'analyzing' && <AnalyzingState />}

                {state === 'proposing' && analysis && (
                    <ProposingView
                        analysis={analysis}
                        onShowConsent={onShowConsent}
                    />
                )}

                {state === 'confirming' && attempt && (
                    <ConfirmingView
                        attempt={attempt}
                        hasConsented={hasConsented}
                        onToggleConsent={onToggleConsent}
                        onConfirmAttempt={onConfirmAttempt}
                        onClose={onClose}
                    />
                )}

                {state === 'attempting' && attempt && (
                    <AttemptingView
                        attempt={attempt}
                        currentStepIndex={currentStepIndex}
                    />
                )}

                {state === 'attempt_failed' && attempt && (
                    <AttemptFailedView
                        attempt={attempt}
                        includeLogs={includeLogs}
                        onToggleLogs={onToggleLogs}
                        onEscalate={onEscalate}
                    />
                )}

                {state === 'escalated' && ticket && (
                    <TicketView ticket={ticket} onClose={onClose} onSubmit={onSubmit} />
                )}

                {state === 'submitted' && (
                    <SubmittedView onClose={onClose} />
                )}
            </div>
        </>
    );
}


