import { useState, useCallback } from 'react';

interface FailureRecord {
    count: number;
    lastFailure: string;
    errorMessage?: string;
}

interface UseFailureTrackerReturn {
    recordFailure: (featureId: string, errorMessage?: string) => boolean;
    clearFailures: (featureId: string) => void;
    getFailureCount: (featureId: string) => number;
    shouldShowHelp: (featureId: string) => boolean;
    getErrorMessage: (featureId: string) => string | undefined;
}

const FAILURE_THRESHOLD = 2; // Show help after 2nd failure

export function useFailureTracker(): UseFailureTrackerReturn {
    const [failures, setFailures] = useState<Record<string, FailureRecord>>({});

    const recordFailure = useCallback((featureId: string, errorMessage?: string): boolean => {
        let shouldTriggerHelp = false;

        setFailures(prev => {
            const current = prev[featureId] || { count: 0, lastFailure: '' };
            const newCount = current.count + 1;

            if (newCount >= FAILURE_THRESHOLD) {
                shouldTriggerHelp = true;
            }

            return {
                ...prev,
                [featureId]: {
                    count: newCount,
                    lastFailure: new Date().toISOString(),
                    errorMessage: errorMessage || current.errorMessage,
                },
            };
        });

        return shouldTriggerHelp;
    }, []);

    const clearFailures = useCallback((featureId: string) => {
        setFailures(prev => {
            const { [featureId]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    const getFailureCount = useCallback((featureId: string): number => {
        return failures[featureId]?.count || 0;
    }, [failures]);

    const shouldShowHelp = useCallback((featureId: string): boolean => {
        return (failures[featureId]?.count || 0) >= FAILURE_THRESHOLD;
    }, [failures]);

    const getErrorMessage = useCallback((featureId: string): string | undefined => {
        return failures[featureId]?.errorMessage;
    }, [failures]);

    return {
        recordFailure,
        clearFailures,
        getFailureCount,
        shouldShowHelp,
        getErrorMessage,
    };
}
