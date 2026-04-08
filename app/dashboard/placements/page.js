"use client";

import { MapPin, Calendar, Building, ChevronRight, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PlacementsPage() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/placements')
            .then(res => res.json())
            .then(data => {
                if (data.placements) setDrives(data.placements);
                setLoading(false);
            })
            .catch(e => { console.error(e); setLoading(false); });
    }, []);

    return (
        <div className="placements-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Placement Drives</h1>
                    <p className="page-subtitle">Discover upcoming recruitment opportunities and apply.</p>
                </div>
            </div>

            <div className="drives-grid">
                {loading ? (
                    <div className="loading-state">Syncing placement databases...</div>
                ) : drives.length === 0 ? (
                    <div className="empty-state">
                        <Briefcase size={48} color="#94a3b8" />
                        <h3>No Active Recruitment Campaigns</h3>
                        <p>The placement cell will post upcoming drives here.</p>
                    </div>
                ) : (
                    drives.map(drive => (
                        <div key={drive.id} className="drive-card">
                            <div className="card-top">
                                <div className="company-logo">
                                    <Building size={24} color="#2563eb" />
                                </div>
                                <div className="company-header">
                                    <h2>{drive.company}</h2>
                                    <span className="badge active">Actively Hiring</span>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <h3>{drive.description}</h3>
                                
                                <div className="meta-info mt-3">
                                    <div className="meta-item">
                                        <Briefcase size={16} color="#64748b" />
                                        <span><strong>Eligibility:</strong> {drive.eligibility}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={16} color="#64748b" />
                                        <span><strong>Drive Date:</strong> {new Date(drive.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button className="btn-primary">Apply Now <ChevronRight size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
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

                .drives-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
                
                .loading-state, .empty-state { grid-column: 1 / -1; padding: 60px; text-align: center; color: #64748b; background: white; border-radius: 12px; border: 1px dashed #cbd5e1; }
                .empty-state h3 { margin: 15px 0 5px 0; color: #0f172a; }

                .drive-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
                .drive-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); border-color: #cbd5e1; }

                .card-top { padding: 20px 20px 15px 20px; border-bottom: 1px solid #f1f5f9; display: flex; gap: 15px; align-items: center; }
                
                .company-logo { width: 56px; height: 56px; border-radius: 12px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #bfdbfe; }
                
                .company-header h2 { margin: 0 0 4px 0; font-size: 1.25rem; color: #0f172a; }
                .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .active { background: #dcfce7; color: #166534; }

                .card-body { padding: 20px; flex: 1; }
                .card-body h3 { margin: 0 0 15px 0; font-size: 1.05rem; color: #1e293b; }
                
                .meta-info { display: flex; flex-direction: column; gap: 10px; }
                .meta-item { display: flex; align-items: center; gap: 8px; color: #475569; font-size: 0.9rem; }
                .meta-item strong { color: #334155; }
                .mt-3 { margin-top: 15px; }

                .card-footer { padding: 15px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
                
                .btn-primary { background: var(--dark-blue); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.9rem; }
                .btn-primary:hover { background: var(--accent-blue); }
            `}</style>
        </div>
    );
}
