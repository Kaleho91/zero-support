import type { CodebaseNote } from '../types';

export const codebaseNotes: CodebaseNote[] = [
    {
        id: 'salesforce-sync-service',
        service: 'SalesforceSyncService',
        description: 'Handles bidirectional sync between the application and Salesforce CRM. Uses OAuth 2.0 for authentication with automatic token refresh. Sync runs every 15 minutes for connected accounts.',
        commonFailureModes: [
            'TOKEN_EXPIRED - OAuth token has expired and refresh failed',
            'RATE_LIMITED - Salesforce API rate limit exceeded',
            'FIELD_MAPPING_ERROR - Source field not found in Salesforce schema',
            'PERMISSION_DENIED - Insufficient API permissions on Salesforce object',
        ],
        errorCodes: {
            'SF_AUTH_001': 'OAuth token expired or revoked',
            'SF_AUTH_002': 'Refresh token invalid',
            'SF_SYNC_001': 'Field mapping configuration error',
            'SF_SYNC_002': 'Record validation failed in Salesforce',
        },
    },
    {
        id: 'integration-manager',
        service: 'IntegrationManager',
        description: 'Central service managing all third-party integrations. Handles connection lifecycle, credential storage, and sync scheduling.',
        commonFailureModes: [
            'CONNECTION_TIMEOUT - Third-party service unreachable',
            'INVALID_CREDENTIALS - Stored credentials rejected by service',
            'WEBHOOK_DELIVERY_FAILED - Outbound webhook returned non-2xx status',
        ],
        errorCodes: {
            'INT_001': 'Integration not found',
            'INT_002': 'Connection test failed',
            'INT_003': 'Webhook signature validation failed',
        },
    },
    {
        id: 'notification-service',
        service: 'NotificationService',
        description: 'Dispatches notifications to connected channels (Slack, email, in-app). Implements retry logic with exponential backoff.',
        commonFailureModes: [
            'CHANNEL_NOT_FOUND - Target Slack channel deleted or bot removed',
            'RATE_LIMITED - Slack API rate limit exceeded',
            'TEMPLATE_ERROR - Notification template rendering failed',
        ],
        errorCodes: {
            'NOTIF_001': 'Delivery failed after max retries',
            'NOTIF_002': 'Invalid channel configuration',
        },
    },
];
