import type { Integration } from '../types';

export const integrations: Integration[] = [
    {
        id: 'salesforce',
        name: 'Salesforce',
        icon: 'SF',
        color: '#00A1E0',
        status: 'error',
        lastSync: '2026-01-08T11:23:45Z',
        errorMessage: 'Unable to authenticate with Salesforce. OAuth token expired.',
    },
    {
        id: 'slack',
        name: 'Slack',
        icon: 'SL',
        color: '#4A154B',
        status: 'connected',
        lastSync: '2026-01-08T11:45:00Z',
    },
    {
        id: 'hubspot',
        name: 'HubSpot',
        icon: 'HS',
        color: '#FF7A59',
        status: 'connected',
        lastSync: '2026-01-08T11:30:00Z',
    },
    {
        id: 'zendesk',
        name: 'Zendesk',
        icon: 'ZD',
        color: '#03363D',
        status: 'disconnected',
    },
    {
        id: 'intercom',
        name: 'Intercom',
        icon: 'IC',
        color: '#1F8DED',
        status: 'connected',
        lastSync: '2026-01-08T11:40:00Z',
    },
];
