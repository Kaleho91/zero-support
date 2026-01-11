export function Dashboard() {
    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">Welcome back. Here's an overview of your workspace.</p>
            </header>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Active Users</div>
                    <div className="metric-value">2,847</div>
                    <div className="metric-change positive">↑ 12% from last week</div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">Total Records Synced</div>
                    <div className="metric-value">48.2K</div>
                    <div className="metric-change positive">↑ 8% from last week</div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">API Calls (24h)</div>
                    <div className="metric-value">12,493</div>
                    <div className="metric-change negative">↓ 3% from yesterday</div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">Active Integrations</div>
                    <div className="metric-value">4</div>
                    <div className="metric-change">1 requires attention</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                    <p className="card-subtitle">Latest sync events and updates</p>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Integration</th>
                                <th>Records</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sync completed</td>
                                <td>Slack</td>
                                <td>124</td>
                                <td>2 min ago</td>
                            </tr>
                            <tr>
                                <td>Sync completed</td>
                                <td>HubSpot</td>
                                <td>892</td>
                                <td>15 min ago</td>
                            </tr>
                            <tr>
                                <td style={{ color: 'var(--color-error)' }}>Sync failed</td>
                                <td>Salesforce</td>
                                <td>—</td>
                                <td>23 min ago</td>
                            </tr>
                            <tr>
                                <td>Sync completed</td>
                                <td>Intercom</td>
                                <td>56</td>
                                <td>1 hour ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
