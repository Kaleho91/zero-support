// TypeScript interfaces for ZeroSupport

export interface Integration {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'connected' | 'error' | 'disconnected';
  lastSync?: string;
  errorMessage?: string;
}

export interface UserContext {
  page: string;
  action: string;
  errorMessage?: string;
  timestamp: string;
  environment: {
    browser: string;
    os: string;
    version: string;
  };
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}

export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedServices: string[];
  workaround?: string;
  lastUpdated: string;
}

export interface CodebaseNote {
  id: string;
  service: string;
  description: string;
  commonFailureModes: string[];
  errorCodes?: Record<string, string>;
}

export interface SourceCitation {
  type: 'help-article' | 'known-issue' | 'codebase-note';
  id: string;
  title: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ResolverAnalysis {
  whatIsHappening: string;
  whatChecked: {
    description: string;
    sources: SourceCitation[];
  };
  whatUsuallyFixes: {
    description: string;
    steps: string[];
  };
  confidence: {
    level: ConfidenceLevel;
    explanation: string;
  };
}

export interface SupportTicket {
  summary: string;
  timeline: {
    time: string;
    action: string;
  }[];
  environment: {
    browser: string;
    os: string;
    page: string;
  };
  hypotheses: string[];
  sourcesReferenced: SourceCitation[];
  attemptedRemediation?: RemediationAttempt;
  logs?: string[];
}

export interface RemediationStep {
  id: string;
  description: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface RemediationAttempt {
  action: string;
  steps: RemediationStep[];
  outcome: 'pending' | 'success' | 'failed';
  failureReason?: string;
}

// Agent Dashboard Types
export type TicketStatus = 'new' | 'in_progress' | 'pending_customer' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AccountHealth = 'healthy' | 'at_risk' | 'churned';

export interface AgentTicket {
  id: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  assignedTo?: string;

  customer: {
    id: string;
    name: string;
    email: string;
    company: string;
    planTier: string;
    accountHealth: AccountHealth;
  };

  aiAnalysis: {
    issueType: string;
    affectedService: string;
    confidence: ConfidenceLevel;
    whatHappened: string;
    recommendedAction: string;
  };

  remediationAttempt?: {
    steps: { description: string; status: 'completed' | 'failed' }[];
    failureReason?: string;
  };

  timeline: { time: string; event: string }[];
  logs?: string[];
  environment: { browser: string; os: string; page: string };
  sourcesReferenced: { type: string; title: string }[];
}


