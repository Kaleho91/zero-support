import type { UserContext } from '../types';

export function captureContext(
    page: string,
    action: string,
    errorMessage?: string
): UserContext {
    return {
        page,
        action,
        errorMessage,
        timestamp: new Date().toISOString(),
        environment: {
            browser: getBrowserInfo(),
            os: getOSInfo(),
            version: '2.4.1', // Mock app version
        },
    };
}

function getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
}

function getOSInfo(): string {
    const platform = navigator.platform;
    if (platform.includes('Mac')) return 'macOS';
    if (platform.includes('Win')) return 'Windows';
    if (platform.includes('Linux')) return 'Linux';
    return 'Unknown OS';
}

export function formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export function getTimeAgo(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
