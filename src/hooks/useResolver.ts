import { useState, useCallback } from 'react';
import type { UserContext, ResolverAnalysis, SupportTicket, RemediationAttempt } from '../types';
import { captureContext } from '../services/contextCapture';
import { analyzeIssue, generateSupportTicket, generateRemediationAttempt } from '../services/resolverEngine';

type ResolverState =
    | 'closed'
    | 'analyzing'
    | 'proposing'      // Shows what the agent found and proposes to try
    | 'confirming'     // User reviews prod impact and gives consent
    | 'attempting'     // Agent is actively trying to fix
    | 'attempt_failed' // Attempt didn't work, offer escalation
    | 'escalated'      // User chose to escalate
    | 'submitted';     // Ticket was submitted

export interface RemediationStep {
    id: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
}

export function useResolver() {
    const [state, setState] = useState<ResolverState>('closed');
    const [context, setContext] = useState<UserContext | null>(null);
    const [analysis, setAnalysis] = useState<ResolverAnalysis | null>(null);
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [attempt, setAttempt] = useState<RemediationAttempt | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [includeLogs, setIncludeLogs] = useState(true);
    const [hasConsented, setHasConsented] = useState(false);

    const openResolver = useCallback((
        page: string,
        action: string,
        errorMessage?: string
    ) => {
        // Capture context
        const capturedContext = captureContext(page, action, errorMessage);
        setContext(capturedContext);
        setAttempt(null);
        setCurrentStepIndex(0);

        // Start analyzing
        setState('analyzing');

        // Simulate analysis delay for realism
        setTimeout(() => {
            const resolverAnalysis = analyzeIssue(capturedContext);
            setAnalysis(resolverAnalysis);
            setState('proposing');
        }, 1500);
    }, []);

    const closeResolver = useCallback(() => {
        setState('closed');
        setContext(null);
        setAnalysis(null);
        setTicket(null);
        setAttempt(null);
        setCurrentStepIndex(0);
        setHasConsented(false);
    }, []);

    // Step 1: Show consent dialog before attempting
    const showConsent = useCallback(() => {
        if (!context || !analysis) return;

        // Generate the remediation attempt so user can see what will happen
        const remediationAttempt = generateRemediationAttempt(context, analysis);
        setAttempt(remediationAttempt);
        setHasConsented(false);
        setState('confirming');
    }, [context, analysis]);

    // Step 2: User toggles consent
    const toggleConsent = useCallback(() => {
        setHasConsented(prev => !prev);
    }, []);

    // Step 3: User confirms and we start the attempt
    const confirmAttempt = useCallback(() => {
        if (!attempt || !hasConsented) return;

        setCurrentStepIndex(0);
        setState('attempting');

        // Simulate step-by-step execution
        const steps = attempt.steps;
        let stepIndex = 0;

        const runNextStep = () => {
            if (stepIndex < steps.length) {
                setCurrentStepIndex(stepIndex);

                // Simulate step taking time
                setTimeout(() => {
                    stepIndex++;
                    if (stepIndex < steps.length) {
                        runNextStep();
                    } else {
                        // All steps completed - for demo, always fail to show escalation
                        setTimeout(() => {
                            setState('attempt_failed');
                        }, 800);
                    }
                }, 1200);
            }
        };

        runNextStep();
    }, [attempt, hasConsented]);

    const escalate = useCallback(() => {
        if (context && analysis) {
            const supportTicket = generateSupportTicket(context, analysis, attempt, includeLogs);
            setTicket(supportTicket);
            setState('escalated');
        }
    }, [context, analysis, attempt, includeLogs]);

    const toggleIncludeLogs = useCallback(() => {
        setIncludeLogs(prev => !prev);
    }, []);

    const submitTicket = useCallback(() => {
        setState('submitted');
    }, []);

    return {
        state,
        context,
        analysis,
        ticket,
        attempt,
        currentStepIndex,
        includeLogs,
        hasConsented,
        isOpen: state !== 'closed',
        openResolver,
        closeResolver,
        showConsent,
        toggleConsent,
        confirmAttempt,
        escalate,
        toggleIncludeLogs,
        submitTicket,
    };
}
