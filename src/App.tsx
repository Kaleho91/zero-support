import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { AgentDashboard } from './pages/AgentDashboard';
import { ResolverPanel } from './components/resolver/ResolverPanel';
import { useResolver } from './hooks/useResolver';
import { PerspectiveProvider, PerspectiveToggle, usePerspective } from './components/PerspectiveToggle';
import './index.css';

function AppContent() {
  const resolver = useResolver();
  const { perspective } = usePerspective();

  const handleReportIssue = (errorMessage: string) => {
    resolver.openResolver('Integrations', 'Sync Salesforce integration', errorMessage);
  };

  // Map state for ResolverPanel (handle 'closed' state)
  const panelState = resolver.state === 'closed' ? 'analyzing' : resolver.state;

  // Render based on perspective
  if (perspective === 'agent') {
    return (
      <>
        <AgentDashboard />
        <PerspectiveToggle />
      </>
    );
  }

  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/integrations"
            element={<Integrations onReportIssue={handleReportIssue} />}
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>

      <ResolverPanel
        isOpen={resolver.isOpen}
        state={panelState}
        analysis={resolver.analysis}
        ticket={resolver.ticket}
        attempt={resolver.attempt}
        currentStepIndex={resolver.currentStepIndex}
        includeLogs={resolver.includeLogs}
        hasConsented={resolver.hasConsented}
        onClose={resolver.closeResolver}
        onShowConsent={resolver.showConsent}
        onToggleConsent={resolver.toggleConsent}
        onConfirmAttempt={resolver.confirmAttempt}
        onEscalate={resolver.escalate}
        onToggleLogs={resolver.toggleIncludeLogs}
        onSubmit={resolver.submitTicket}
      />

      <PerspectiveToggle />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PerspectiveProvider>
        <AppContent />
      </PerspectiveProvider>
    </BrowserRouter>
  );
}

export default App;
