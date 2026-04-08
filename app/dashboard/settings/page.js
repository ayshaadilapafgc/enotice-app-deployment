"use client";

import { Lock, Bell, Moon, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="settings-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Account Settings</h1>
                    <p className="page-subtitle">Manage your personal preferences and security.</p>
                </div>
                {saved && <span className="save-badge">Changes Saved Successfully!</span>}
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <div className="card-header">
                        <Lock size={20} className="header-icon" />
                        <h2>Security & Privacy</h2>
                    </div>
                    
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Change Password</label>
                            <p>Update your credentials regularly to stay secure.</p>
                        </div>
                        <button className="btn-outline">Update</button>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Two-Step Verification</label>
                            <p>Add an extra layer of security (Requires Auth App).</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <Bell size={20} className="header-icon" />
                        <h2>Notifications</h2>
                    </div>
                    
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Email Bulletins</label>
                            <p>Receive important notices directly to your academic email.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Grade Upload Alerts</label>
                            <p>Get notified instantly when a Teacher drops new marks.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <Smartphone size={20} className="header-icon" />
                        <h2>App Preferences</h2>
                    </div>
                    
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Dark Mode</label>
                            <p>Toggle low-light visual interface.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="save-container">
                <button className="btn-primary" onClick={handleSave}>Save Preference Layout</button>
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }
                
                .save-badge { background: #dcfce7; color: #16a34a; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }

                .settings-grid { display: flex; flex-direction: column; gap: 20px; max-width: 800px; }
                .settings-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                
                .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
                .card-header h2 { margin: 0; font-size: 1.2rem; color: #0f172a; }
                .header-icon { color: var(--dark-blue); }

                .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .setting-row:last-child { margin-bottom: 0; }
                .setting-info label { font-size: 1rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 4px; }
                .setting-info p { font-size: 0.85rem; color: #64748b; margin: 0; }

                .btn-outline { background: transparent; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }

                .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 24px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                input:checked + .slider { background-color: #10b981; }
                input:checked + .slider:before { transform: translateX(20px); }

                .save-container { margin-top: 30px; }
                .btn-primary { background: var(--dark-blue); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-primary:hover { background: var(--accent-blue); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
            `}</style>
        </div>
    );
}
