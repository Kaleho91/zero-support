interface ProactiveHelpPromptProps {
    featureName: string;
    errorMessage?: string;
    onAcceptHelp: () => void;
    onDismiss: () => void;
}

export function ProactiveHelpPrompt({
    featureName,
    errorMessage,
    onAcceptHelp,
    onDismiss,
}: ProactiveHelpPromptProps) {
    return (
        <div className="proactive-help-prompt">
            <div className="proactive-help-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>
            <div className="proactive-help-content">
                <h4 className="proactive-help-title">
                    Having trouble with {featureName}?
                </h4>
                <p className="proactive-help-text">
                    I noticed this isn't working as expected. I can help diagnose and potentially fix this issue.
                </p>
                {errorMessage && (
                    <p className="proactive-help-error">
                        Last error: {errorMessage}
                    </p>
                )}
            </div>
            <div className="proactive-help-actions">
                <button className="btn btn-primary btn-sm" onClick={onAcceptHelp}>
                    Yes, help me
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onDismiss}>
                    Dismiss
                </button>
            </div>
        </div>
    );
}
