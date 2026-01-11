import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
