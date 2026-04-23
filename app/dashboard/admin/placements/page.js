"use client";

import { useState, useEffect } from 'react';
import { Briefcase, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminPlacements() {
    const [placements, setPlacements] = useState([]);
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [date, setDate] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchPlacements = async () => {
        try {
            const res = await fetch('/api/admin/placements');
            const data = await res.json();
            if (data.placements) setPlacements(data.placements);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchPlacements(); }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/placements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company, description, eligibility, date, link })
            });
            if (res.ok) {
                setCompany(""); setDescription(""); setEligibility(""); setDate(""); setLink("");
                fetchPlacements();
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/admin/placements?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchPlacements();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="admin-cms-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Manager: Placements</h1>
                    <p className="page-subtitle">Schedule upcoming campus recruitment drives.</p>
                </div>
            </div>

            <div className="cms-grid">
                <div className="editor-panel">
                    <div className="panel-header">
                        <h2>Add Recruitment Drive</h2>
                        <span className="badge warning"><ShieldAlert size={12}/> Admin Only</span>
                    </div>
                    <form onSubmit={handlePost}>
                        <div className="form-group mt-4">
                            <label>Company Name</label>
                            <input type="text" className="form-control" placeholder="e.g. Google" value={company} onChange={(e)=>setCompany(e.target.value)} required />
                        </div>
                        <div className="form-group mt-4">
                            <label>Role Description</label>
                            <input type="text" className="form-control" placeholder="e.g. Software Engineer Intern" value={description} onChange={(e)=>setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group mt-4">
                            <label>Eligibility Criteria</label>
                            <input type="text" className="form-control" placeholder="e.g. 70% Overrall score" value={eligibility} onChange={(e)=>setEligibility(e.target.value)} required />
                        </div>
                        <div className="form-group mt-4">
                            <label>Drive Date</label>
                            <input type="date" className="form-control" value={date} onChange={(e)=>setDate(e.target.value)} required />
                        </div>
                        <div className="form-group mt-4">
                            <label>Registration Link</label>
                            <input type="url" className="form-control" placeholder="https://..." value={link} onChange={(e)=>setLink(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary mt-4" disabled={loading}>
                            <Briefcase size={16}/> {loading ? 'Saving...' : 'Post Placement Option'}
                        </button>
                    </form>
                </div>

                {/* Published List */}
                <div className="published-panel">
                    <div className="panel-header mb-4">
                        <h2>Active Drives</h2>
                    </div>
                    <div className="notice-feed">
                        {placements.length === 0 ? (
                            <p className="empty-text">No active drives.</p>
                        ) : placements.map(p => (
                            <div key={p.id} className="admin-notice-card">
                                <div>
                                    <h4>{p.company}</h4>
                                    <p>{p.description} <br/> <strong>Eligibility:</strong> {p.eligibility}</p>
                                    <small>Date: {new Date(p.date).toLocaleDateString()}</small>
                                    {p.link && (
                                        <div style={{marginTop: '8px'}}>
                                            <a 
                                                href={p.link.startsWith('http') ? p.link : `https://${p.link}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{color: '#3b82f6', textDecoration: 'underline'}}
                                            >
                                                Placement Web Link
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <button className="delete-btn" onClick={() => handleDelete(p.id)}><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }

                .cms-grid { display: flex; gap: 20px; align-items: flex-start; }
                .editor-panel { flex: 1.2; background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .published-panel { flex: 1; background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; height: 600px; display: flex; flex-direction: column; }
                
                .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                .panel-header h2 { margin: 0; font-size: 1.2rem; color: #0f172a; }
                
                .badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .warning { background: #fef3c7; color: #d97706; }
                
                .form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; }
                .btn-primary { width: 100%; background: var(--dark-blue); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .btn-primary:hover { background: var(--accent-blue); }
                .mt-4 { margin-top: 20px; } .mb-4 { margin-bottom: 20px; }
                
                .notice-feed { overflow-y: auto; flex: 1; }
                .admin-notice-card { background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
                .admin-notice-card h4 { margin: 0 0 5px 0; color: var(--dark-blue); font-size: 1rem; }
                .admin-notice-card p { margin: 0 0 10px 0; color: #475569; font-size: 0.85rem; line-height: 1.4; }
                .admin-notice-card small { color: #94a3b8; font-size: 0.75rem; font-weight: bold; }
                
                .delete-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
                .delete-btn:hover { background: #fecaca; }
                .empty-text { color: #94a3b8; font-style: italic; text-align: center; margin-top: 50px; }
            `}</style>
        </div>
    );
}
