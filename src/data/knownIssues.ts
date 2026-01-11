import type { KnownIssue } from '../types';

export const knownIssues: KnownIssue[] = [
    {
        id: 'salesforce-oauth-token-expiry',
        title: 'Salesforce OAuth tokens expiring prematurely',
        description: 'Some users are experiencing Salesforce OAuth tokens expiring before the expected 2-hour window. This appears to be related to Salesforce session policy settings.',
        status: 'investigating',
        affectedServices: ['salesforce-integration', 'crm-sync'],
        workaround: 'Re-authenticate via Settings > Integrations. If the issue recurs frequently, check your Salesforce org\'s session timeout settings.',
        lastUpdated: '2026-01-08T10:30:00Z',
    },
    {
        id: 'slack-rate-limiting',
        title: 'Intermittent Slack notification delays',
        description: 'High-volume workspaces may experience 1-2 minute delays in Slack notifications due to rate limiting.',
        status: 'monitoring',
        affectedServices: ['slack-integration'],
        workaround: 'No action required. Notifications will be delivered with a slight delay.',
        lastUpdated: '2026-01-07T16:45:00Z',
    },
    {
        id: 'hubspot-field-sync',
        title: 'HubSpot custom field sync issue',
        description: 'Custom fields created after initial integration setup may not sync automatically.',
        status: 'identified',
        affectedServices: ['hubspot-integration'],
        workaround: 'Disconnect and reconnect the HubSpot integration to refresh field mappings.',
        lastUpdated: '2026-01-06T09:15:00Z',
    },
];
