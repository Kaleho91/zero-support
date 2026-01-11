import type { HelpArticle } from '../types';

export const helpArticles: HelpArticle[] = [
    {
        id: 'integration-auth-guide',
        title: 'Fixing Integration Authentication Issues',
        content: `# Fixing Integration Authentication Issues

When an integration fails to authenticate, it's typically due to one of these causes:

## Common Causes

1. **Expired OAuth Token** - OAuth tokens expire after a set period. Re-authenticating refreshes the token.
2. **Revoked Permissions** - The connected account may have had its permissions revoked in the third-party service.
3. **API Rate Limiting** - Too many requests can temporarily block authentication attempts.

## Resolution Steps

1. Navigate to Settings > Integrations
2. Click "Reconnect" on the affected integration
3. Complete the OAuth flow in the popup window
4. Verify the sync status shows "Connected"

If the issue persists after re-authentication, check the third-party service's status page for any ongoing incidents.`,
        category: 'Integrations',
        keywords: ['authentication', 'oauth', 'token', 'expired', 'reconnect', 'permissions'],
    },
    {
        id: 'salesforce-sync-guide',
        title: 'Salesforce Sync Troubleshooting',
        content: `# Salesforce Sync Troubleshooting

Salesforce sync issues are usually related to authentication or field mapping.

## Authentication Issues

Salesforce OAuth tokens expire every 2 hours. If sync fails with an authentication error:

1. Go to Integrations page
2. Click "Reconnect" on Salesforce
3. Log in with your Salesforce credentials

## Field Mapping Issues

If specific fields aren't syncing:

1. Check that the fields exist in your Salesforce org
2. Verify field-level security allows API access
3. Review the field mapping in Integration Settings`,
        category: 'Integrations',
        keywords: ['salesforce', 'sync', 'authentication', 'field mapping', 'oauth'],
    },
    {
        id: 'slack-notifications-guide',
        title: 'Configuring Slack Notifications',
        content: `# Configuring Slack Notifications

Set up Slack notifications to receive real-time updates in your workspace.

## Setup Steps

1. Click "Connect" on the Slack integration
2. Select your Slack workspace
3. Choose the channel for notifications
4. Configure which events trigger notifications

## Troubleshooting

If notifications aren't appearing:

- Verify the bot is added to the target channel
- Check that the notification types are enabled
- Ensure the Slack app hasn't been uninstalled from your workspace`,
        category: 'Integrations',
        keywords: ['slack', 'notifications', 'channel', 'bot', 'workspace'],
    },
];
