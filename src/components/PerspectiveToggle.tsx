import { useState, createContext, useContext } from 'react';

export type Perspective = 'user' | 'agent';

interface PerspectiveContextType {
    perspective: Perspective;
    togglePerspective: () => void;
}

const PerspectiveContext = createContext<PerspectiveContextType | null>(null);

export function usePerspective(): PerspectiveContextType {
    const context = useContext(PerspectiveContext);
    if (!context) {
        throw new Error('usePerspective must be used within PerspectiveProvider');
    }
    return context;
}

export function PerspectiveProvider({ children }: { children: React.ReactNode }) {
    const [perspective, setPerspective] = useState<Perspective>('user');

    const togglePerspective = () => {
        setPerspective(prev => (prev === 'user' ? 'agent' : 'user'));
    };

    return (
        <PerspectiveContext.Provider value={{ perspective, togglePerspective }}>
            {children}
        </PerspectiveContext.Provider>
    );
}

// Floating toggle button component
export function PerspectiveToggle() {
    const { perspective, togglePerspective } = usePerspective();
    const isAgent = perspective === 'agent';

    return (
        <button
            className={`perspective-toggle ${isAgent ? 'agent-mode' : 'user-mode'}`}
            onClick={togglePerspective}
            title={isAgent ? 'Switch to User View' : 'Switch to Agent View'}
        >
            <div className="perspective-toggle-track">
                <div className="perspective-toggle-thumb" />
            </div>
            <div className="perspective-toggle-labels">
                <span className={`perspective-label ${!isAgent ? 'active' : ''}`}>
                    <UserIcon />
                    User
                </span>
                <span className={`perspective-label ${isAgent ? 'active' : ''}`}>
                    <AgentIcon />
                    Agent
                </span>
            </div>
        </button>
    );
}

const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const AgentIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
