import type { UserContext, ResolverAnalysis, SupportTicket, SourceCitation, RemediationAttempt, RemediationStep } from '../types';
import { helpArticles } from '../data/helpArticles';
import { knownIssues } from '../data/knownIssues';
import { codebaseNotes } from '../data/codebaseNotes';

export function analyzeIssue(context: UserContext): ResolverAnalysis {
    // Find relevant knowledge sources based on context
    const relevantArticles = findRelevantArticles(context);
    const relevantIssues = findRelevantIssues(context);
    const relevantNotes = findRelevantCodebaseNotes(context);

    // Build source citations
    const sources: SourceCitation[] = [
        ...relevantArticles.map(a => ({
            type: 'help-article' as const,
            id: a.id,
            title: a.title,
        })),
        ...relevantIssues.map(i => ({
            type: 'known-issue' as const,
            id: i.id,
            title: i.title,
        })),
        ...relevantNotes.map(n => ({
            type: 'codebase-note' as const,
            id: n.id,
            title: n.service,
        })),
    ];

    // Determine confidence based on matching sources
    const hasKnownIssue = relevantIssues.length > 0;
    const hasMatchingArticle = relevantArticles.length > 0;
    const hasCodebaseMatch = relevantNotes.length > 0;

    let confidenceLevel: 'high' | 'medium' | 'low';
    let confidenceExplanation: string;

    if (hasKnownIssue && hasMatchingArticle) {
        confidenceLevel = 'high';
        confidenceExplanation = 'This matches a known issue with documented resolution steps.';
    } else if (hasMatchingArticle || hasCodebaseMatch) {
        confidenceLevel = 'medium';
        confidenceExplanation = 'This matches documented patterns, though the specific cause may vary.';
    } else {
        confidenceLevel = 'low';
        confidenceExplanation = 'Limited matching documentation. Human review may be needed.';
    }

    // Generate analysis based on Salesforce error (the demo scenario)
    const isSalesforceError = context.errorMessage?.toLowerCase().includes('salesforce') ||
        context.errorMessage?.toLowerCase().includes('oauth') ||
        context.errorMessage?.toLowerCase().includes('authenticate');

    if (isSalesforceError) {
        return {
            whatIsHappening: 'The Salesforce integration is unable to complete sync operations because the OAuth authentication token has expired. This prevents the application from accessing your Salesforce data until re-authentication is completed.',
            whatChecked: {
                description: 'Reviewed integration authentication documentation, checked active known issues, and analyzed the SalesforceSyncService error patterns.',
                sources,
            },
            whatUsuallyFixes: {
                description: 'Re-authenticating with Salesforce typically resolves this issue. The OAuth token will be refreshed, restoring sync functionality.',
                steps: [
                    'Invalidate the current OAuth session',
                    'Request a new authentication token from Salesforce',
                    'Validate the new token with a test API call',
                    'Retry the sync operation',
                ],
            },
            confidence: {
                level: confidenceLevel,
                explanation: confidenceExplanation,
            },
        };
    }

    // Fallback generic analysis
    return {
        whatIsHappening: `An issue was detected on the ${context.page} page. ${context.errorMessage || 'The specific error details are being analyzed.'}`,
        whatChecked: {
            description: 'Searched help documentation and known issues for matching patterns.',
            sources,
        },
        whatUsuallyFixes: {
            description: 'Based on the available information, the following steps may help resolve this issue.',
            steps: [
                'Refresh the page and retry',
                'Check network connectivity',
                'Clear browser cache',
                'Escalate to support if issue persists',
            ],
        },
        confidence: {
            level: 'low',
            explanation: 'Unable to find a specific match for this issue. Human review is recommended.',
        },
    };
}

export function generateRemediationAttempt(
    context: UserContext,
    analysis: ResolverAnalysis
): RemediationAttempt {
    const isSalesforceError = context.errorMessage?.toLowerCase().includes('salesforce') ||
        context.errorMessage?.toLowerCase().includes('oauth');

    if (isSalesforceError) {
        const steps: RemediationStep[] = [
            {
                id: 'step-1',
                description: 'Revoking current OAuth session',
                detail: 'Clearing cached authentication tokens from the integration service...',
                status: 'pending',
            },
            {
                id: 'step-2',
                description: 'Requesting new authentication token',
                detail: 'Initiating OAuth 2.0 refresh flow with Salesforce API...',
                status: 'pending',
            },
            {
                id: 'step-3',
                description: 'Validating new credentials',
                detail: 'Testing API connection with refreshed token...',
                status: 'pending',
            },
            {
                id: 'step-4',
                description: 'Retrying sync operation',
                detail: 'Attempting to sync records with new authentication...',
                status: 'pending',
            },
        ];

        return {
            action: 'Attempting to refresh Salesforce authentication',
            steps,
            outcome: 'pending',
            failureReason: 'The refresh token has been revoked on the Salesforce side. Manual re-authorization is required by an admin with Salesforce access.',
        };
    }

    // Generic remediation
    return {
        action: 'Attempting automated remediation',
        steps: [
            {
                id: 'step-1',
                description: 'Clearing cached data',
                detail: 'Removing stale cache entries...',
                status: 'pending',
            },
            {
                id: 'step-2',
                description: 'Retrying operation',
                detail: 'Attempting the failed operation again...',
                status: 'pending',
            },
        ],
        outcome: 'pending',
        failureReason: 'The automated remediation could not resolve this issue.',
    };
}

export function generateSupportTicket(
    context: UserContext,
    analysis: ResolverAnalysis,
    attempt?: RemediationAttempt | null,
    includeLogs?: boolean
): SupportTicket {
    const timeline = [
        {
            time: getRelativeTime(context.timestamp, -120),
            action: 'User navigated to Integrations page',
        },
        {
            time: getRelativeTime(context.timestamp, -60),
            action: 'User attempted to sync Salesforce integration',
        },
        {
            time: getRelativeTime(context.timestamp, -45),
            action: 'Sync failed with error: "Unable to authenticate with Salesforce"',
        },
        {
            time: getRelativeTime(context.timestamp, -30),
            action: 'User triggered ZeroSupport via "Something isn\'t working"',
        },
        {
            time: getRelativeTime(context.timestamp, -15),
            action: 'ZeroSupport analyzed the issue and proposed remediation',
        },
    ];

    // Add remediation attempt steps to timeline
    if (attempt) {
        timeline.push({
            time: getRelativeTime(context.timestamp, -10),
            action: `Agent attempted: ${attempt.action}`,
        });

        attempt.steps.forEach((step, i) => {
            timeline.push({
                time: getRelativeTime(context.timestamp, -8 + i),
                action: `Step ${i + 1}: ${step.description}`,
            });
        });

        timeline.push({
            time: getRelativeTime(context.timestamp, 0),
            action: `Remediation failed: ${attempt.failureReason}`,
        });
    }

    const logs = includeLogs ? [
        '[2026-01-08T13:43:21Z] SalesforceSyncService: Initiating OAuth refresh',
        '[2026-01-08T13:43:22Z] OAuthProvider: Sending refresh token request to https://login.salesforce.com/services/oauth2/token',
        '[2026-01-08T13:43:23Z] OAuthProvider: ERROR - Received 400 Bad Request: {"error":"invalid_grant","error_description":"refresh token has been revoked"}',
        '[2026-01-08T13:43:23Z] SalesforceSyncService: Token refresh failed, marking integration as errored',
        '[2026-01-08T13:43:24Z] IntegrationManager: Updated Salesforce status to ERROR',
    ] : undefined;

    return {
        summary: attempt
            ? `Integration sync failure on ${context.page} page. ZeroSupport attempted automated remediation (${attempt.action}) but was unsuccessful. ${attempt.failureReason} Manual intervention by a support engineer is recommended.`
            : `Integration sync failure on ${context.page} page. User attempted to sync Salesforce integration but encountered authentication error.`,
        timeline,
        environment: {
            browser: context.environment.browser,
            os: context.environment.os,
            page: context.page,
        },
        hypotheses: [
            'OAuth refresh token has been revoked from Salesforce admin console',
            'Salesforce Connected App configuration may have changed',
            'User who authorized the integration may no longer have required permissions',
            'Salesforce org may have enforced new session policies',
        ],
        sourcesReferenced: analysis.whatChecked.sources,
        attemptedRemediation: attempt || undefined,
        logs,
    };
}

function findRelevantArticles(context: UserContext) {
    const searchTerms = [
        context.page.toLowerCase(),
        ...(context.errorMessage?.toLowerCase().split(' ') || []),
    ];

    return helpArticles.filter(article =>
        article.keywords.some(keyword =>
            searchTerms.some(term => term.includes(keyword) || keyword.includes(term))
        )
    );
}

function findRelevantIssues(context: UserContext) {
    const errorLower = context.errorMessage?.toLowerCase() || '';

    return knownIssues.filter(issue =>
        issue.affectedServices.some(service =>
            errorLower.includes(service.split('-')[0]) ||
            context.page.toLowerCase().includes(service.split('-')[0])
        )
    );
}

function findRelevantCodebaseNotes(context: UserContext) {
    const errorLower = context.errorMessage?.toLowerCase() || '';
    const pageLower = context.page.toLowerCase();

    return codebaseNotes.filter(note =>
        note.service.toLowerCase().includes(pageLower) ||
        errorLower.includes(note.service.toLowerCase().split('service')[0])
    );
}

function getRelativeTime(baseTime: string, offsetSeconds: number): string {
    const date = new Date(baseTime);
    date.setSeconds(date.getSeconds() + offsetSeconds);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
