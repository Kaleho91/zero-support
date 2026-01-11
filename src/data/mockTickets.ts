import type { AgentTicket } from '../types';

export const mockTickets: AgentTicket[] = [
    {
        id: 'ZS-2026-00847',
        status: 'new',
        priority: 'high',
        createdAt: '2026-01-08T13:56:00Z',
        customer: {
            id: 'cust-001',
            name: 'Sarah Chen',
            email: 'sarah.chen@techcorp.io',
            company: 'TechCorp Industries',
            planTier: 'Enterprise',
            accountHealth: 'healthy',
        },
        aiAnalysis: {
            issueType: 'Integration Authentication Failure',
            affectedService: 'Salesforce Sync',
            confidence: 'high',
            whatHappened: 'The Salesforce integration is failing to authenticate due to an expired OAuth token.',
            recommendedAction: 'Salesforce Connected App requires re-authorization from the customer\'s Salesforce admin.',
        },
        remediationAttempt: {
            steps: [
                { description: 'Revoked current OAuth session', status: 'completed' },
                { description: 'Requested new authentication token', status: 'completed' },
                { description: 'Validated new credentials', status: 'completed' },
                { description: 'Retried sync operation', status: 'failed' },
            ],
            failureReason: 'Refresh token has been revoked from the Salesforce admin console. Manual re-authorization is required.',
        },
        timeline: [
            { time: '01:54 PM', event: 'User navigated to Integrations page' },
            { time: '01:55 PM', event: 'User attempted to sync Salesforce' },
            { time: '01:55 PM', event: 'Sync failed: "Unable to authenticate"' },
            { time: '01:55 PM', event: 'User clicked Retry Sync' },
            { time: '01:55 PM', event: 'Sync failed again, ZeroSupport triggered' },
            { time: '01:56 PM', event: 'Agent auto-remediation attempted' },
            { time: '01:56 PM', event: 'Remediation failed, escalated to support' },
        ],
        logs: [
            '[2026-01-08T13:43:21Z] SalesforceSyncService: Initiating OAuth refresh',
            '[2026-01-08T13:43:22Z] OAuthProvider: Sending refresh token request to https://login.salesforce.com/services/oauth2/token',
            '[2026-01-08T13:43:23Z] OAuthProvider: ERROR - 400 Bad Request: "refresh_token has been revoked"',
            '[2026-01-08T13:43:23Z] SalesforceSyncService: Auth refresh failed, cannot proceed',
        ],
        environment: {
            browser: 'Chrome 120.0',
            os: 'macOS 14.2',
            page: '/integrations',
        },
        sourcesReferenced: [
            { type: 'help-article', title: 'Fixing Integration Authentication Issues' },
            { type: 'known-issue', title: 'Salesforce OAuth tokens expiring prematurely' },
            { type: 'codebase-note', title: 'SalesforceSyncService error patterns' },
        ],
    },
    {
        id: 'ZS-2026-00846',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2026-01-08T11:23:00Z',
        assignedTo: 'Alex Rivera',
        customer: {
            id: 'cust-002',
            name: 'James Wilson',
            email: 'j.wilson@acmeco.com',
            company: 'Acme Co',
            planTier: 'Pro',
            accountHealth: 'at_risk',
        },
        aiAnalysis: {
            issueType: 'Data Sync Delay',
            affectedService: 'HubSpot Sync',
            confidence: 'medium',
            whatHappened: 'Customer reports data is syncing with a 30+ minute delay.',
            recommendedAction: 'Check HubSpot API rate limits and sync queue backlog.',
        },
        timeline: [
            { time: '11:20 AM', event: 'User reported slow sync via chat' },
            { time: '11:22 AM', event: 'User triggered ZeroSupport' },
            { time: '11:23 AM', event: 'Escalated to support' },
        ],
        environment: {
            browser: 'Firefox 121.0',
            os: 'Windows 11',
            page: '/dashboard',
        },
        sourcesReferenced: [
            { type: 'help-article', title: 'Understanding Sync Delays' },
        ],
    },
    {
        id: 'ZS-2026-00842',
        status: 'resolved',
        priority: 'low',
        createdAt: '2026-01-07T16:45:00Z',
        assignedTo: 'Morgan Lee',
        customer: {
            id: 'cust-003',
            name: 'Emily Watson',
            email: 'emily@startupxyz.io',
            company: 'StartupXYZ',
            planTier: 'Starter',
            accountHealth: 'healthy',
        },
        aiAnalysis: {
            issueType: 'UI Display Issue',
            affectedService: 'Dashboard',
            confidence: 'high',
            whatHappened: 'Charts not rendering correctly on dashboard.',
            recommendedAction: 'Clear browser cache and refresh.',
        },
        timeline: [
            { time: '04:45 PM', event: 'User reported dashboard issue' },
            { time: '04:46 PM', event: 'Suggested cache clear, issue resolved' },
        ],
        environment: {
            browser: 'Safari 17.2',
            os: 'macOS 14.1',
            page: '/dashboard',
        },
        sourcesReferenced: [
            { type: 'help-article', title: 'Troubleshooting Display Issues' },
        ],
    },
];
