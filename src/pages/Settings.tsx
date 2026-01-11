export function Settings() {
    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-description">Manage your account and preferences.</p>
            </header>

            <div className="settings-section">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Notifications</h3>
                        <p className="card-subtitle">Configure how you receive updates</p>
                    </div>
                    <div className="card-body">
                        <div className="settings-row">
                            <div>
                                <div className="settings-label">Email notifications</div>
                                <div className="settings-description">Receive daily digest emails</div>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-label">Sync failure alerts</div>
                                <div className="settings-description">Get notified when integrations fail</div>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-label">Weekly reports</div>
                                <div className="settings-description">Summary of sync activity</div>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Account</h3>
                        <p className="card-subtitle">Your account information</p>
                    </div>
                    <div className="card-body">
                        <div className="settings-row">
                            <div>
                                <div className="settings-label">Workspace</div>
                                <div className="settings-description">Acme Corporation</div>
                            </div>
                            <button className="btn btn-ghost btn-sm">Edit</button>
                        </div>

                        <div className="settings-row">
                            <div>
                                <div className="settings-label">Plan</div>
                                <div className="settings-description">Professional • 10 seats</div>
                            </div>
                            <button className="btn btn-ghost btn-sm">Upgrade</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
