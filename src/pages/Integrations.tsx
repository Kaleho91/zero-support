import { useState } from 'react';
import { integrations } from '../data/integrations';
import type { Integration } from '../types';
import { getTimeAgo } from '../services/contextCapture';
import { useFailureTracker } from '../hooks/useFailureTracker';
import { ProactiveHelpPrompt } from '../components/ProactiveHelpPrompt';

interface IntegrationsProps {
    onReportIssue: (errorMessage: string) => void;
}

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z" />
    </svg>
);

const SyncIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 1v4h4" />
        <path d="M13 13v-4h-4" />
        <path d="M11.5 5A5 5 0 0 0 3 3.5L1 5" />
        <path d="M2.5 9A5 5 0 0 0 11 10.5l2-1.5" />
    </svg>
);

function IntegrationCard({
    integration,
    onSync,
    isSyncing,
    showHelpPrompt,
    onAcceptHelp,
    onDismissHelp,
    errorMessage,
}: {
    integration: Integration;
    onSync: () => void;
    isSyncing: boolean;
    showHelpPrompt: boolean;
    onAcceptHelp: () => void;
    onDismissHelp: () => void;
    errorMessage?: string;
}) {
    const isError = integration.status === 'error';
    const isConnected = integration.status === 'connected';
    const isDisconnected = integration.status === 'disconnected';

    return (
        <div className="integration-card-wrapper">
            <div className="integration-card">
                <div
                    className="integration-icon"
                    style={{ backgroundColor: `${integration.color}15`, color: integration.color }}
                >
                    {integration.icon}
                </div>

                <div className="integration-info">
                    <div className="integration-name">{integration.name}</div>
                    <div className="integration-status">
                        {isConnected && integration.lastSync && `Last synced ${getTimeAgo(integration.lastSync)}`}
                        {isDisconnected && 'Not connected'}
                        {isError && 'Sync failed'}
                    </div>

                    {isError && integration.errorMessage && (
                        <div className="error-banner">
                            <div className="error-banner-content">
                                <span className="error-icon">
                                    <AlertIcon />
                                </span>
                                <div className="error-text">
                                    <div className="error-title">Authentication Error</div>
                                    <div className="error-description">{integration.errorMessage}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="integration-actions">
                    <span className={`badge ${isConnected ? 'badge-success' : isError ? 'badge-error' : 'badge-neutral'}`}>
                        {isConnected ? 'Connected' : isError ? 'Error' : 'Disconnected'}
                    </span>

                    {/* Sync button for error state - triggers failure tracking */}
                    {isError && (
                        <button
                            className={`btn btn-secondary btn-sm ${isSyncing ? 'syncing' : ''}`}
                            onClick={onSync}
                            disabled={isSyncing}
                        >
                            <SyncIcon />
                            {isSyncing ? 'Syncing...' : 'Retry Sync'}
                        </button>
                    )}

                    {!isError && (
                        <button className="btn btn-ghost btn-sm">
                            {isConnected ? 'Configure' : 'Connect'}
                        </button>
                    )}
                </div>
            </div>

            {/* Proactive help prompt appears after 2nd failure */}
            {showHelpPrompt && (
                <ProactiveHelpPrompt
                    featureName={`${integration.name} sync`}
                    errorMessage={errorMessage}
                    onAcceptHelp={onAcceptHelp}
                    onDismiss={onDismissHelp}
                />
            )}
        </div>
    );
}

export function Integrations({ onReportIssue }: IntegrationsProps) {
    const failureTracker = useFailureTracker();
    const [syncingId, setSyncingId] = useState<string | null>(null);
    const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set());

    const handleSync = (integration: Integration) => {
        const featureId = `${integration.id}-sync`;

        // Show syncing state
        setSyncingId(integration.id);

        // Simulate sync attempt (always fails for demo)
        setTimeout(() => {
            setSyncingId(null);

            // Record the failure
            const shouldShowHelp = failureTracker.recordFailure(
                featureId,
                integration.errorMessage
            );

            // If this triggered help, make sure it's not dismissed
            if (shouldShowHelp) {
                setDismissedPrompts(prev => {
                    const next = new Set(prev);
                    next.delete(featureId);
                    return next;
                });
            }
        }, 1500);
    };

    const handleAcceptHelp = (integration: Integration) => {
        const featureId = `${integration.id}-sync`;
        failureTracker.clearFailures(featureId);
        onReportIssue(integration.errorMessage || 'Integration sync failed');
    };

    const handleDismissHelp = (integrationId: string) => {
        const featureId = `${integrationId}-sync`;
        setDismissedPrompts(prev => new Set(prev).add(featureId));
    };

    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Integrations</h1>
                <p className="page-description">Connect your tools to sync data automatically.</p>
            </header>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Connected Services</h3>
                    <p className="card-subtitle">Manage your active integrations</p>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {integrations.map(integration => {
                        const featureId = `${integration.id}-sync`;
                        const showHelp = failureTracker.shouldShowHelp(featureId) &&
                            !dismissedPrompts.has(featureId);

                        return (
                            <IntegrationCard
                                key={integration.id}
                                integration={integration}
                                onSync={() => handleSync(integration)}
                                isSyncing={syncingId === integration.id}
                                showHelpPrompt={showHelp}
                                onAcceptHelp={() => handleAcceptHelp(integration)}
                                onDismissHelp={() => handleDismissHelp(integration.id)}
                                errorMessage={failureTracker.getErrorMessage(featureId)}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
