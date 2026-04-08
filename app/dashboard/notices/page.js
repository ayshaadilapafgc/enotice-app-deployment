"use client";

import { AlertCircle, Clock, FileText, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NoticesPage() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/notices')
            .then(res => res.json())
            .then(data => {
                if (data.notices) setNotices(data.notices);
                setLoading(false);
            })
            .catch(e => { console.error(e); setLoading(false); });
    }, []);

    return (
        <div className="notices-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Institution Board</h1>
                    <p className="page-subtitle">Official announcements directly from the administration.</p>
                </div>
            </div>

            <div className="notices-grid">
                {loading ? (
                    <div className="loading-state">Loading official notices...</div>
                ) : notices.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} color="#94a3b8" />
                        <h3>No Active Notices</h3>
                        <p>The administration has not posted any official notices yet.</p>
                    </div>
                ) : (
                    notices.map((notice, i) => (
                        <div key={notice.id} className="notice-card">
                            <div className="notice-content">
                                <div className="notice-header">
                                    <div className="notice-meta">
                                        <span className="badge urgent"><AlertCircle size={12}/> Official</span>
                                        <span className="date-text"><Clock size={12}/> {new Date(notice.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <h2 className="title">{notice.title}</h2>
                                <p className="description">{notice.content}</p>
                                
                                <div className="notice-footer">
                                    <div className="author-info">
                                        <div className="avatar">{notice.author.fullName.charAt(0)}</div>
                                        <span>Posted by <strong>{notice.author.fullName}</strong></span>
                                    </div>
                                    <button className="btn-download"><Download size={16}/></button>
                                </div>
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

                .notices-grid { display: flex; flex-direction: column; gap: 20px; }
                
                .loading-state, .empty-state { padding: 40px; text-align: center; color: #64748b; background: white; border-radius: 12px; border: 1px dashed #cbd5e1; }
                .empty-state h3 { margin: 15px 0 5px 0; color: #0f172a; }

                .notice-card { display: flex; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s; }
                .notice-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

                .notice-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
                
                .notice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
                .notice-meta { display: flex; gap: 15px; align-items: center; }
                
                .badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .urgent { background: #fee2e2; color: #b91c1c; }
                
                .date-text { display: flex; align-items: center; gap: 4px; color: #64748b; font-size: 0.85rem; font-weight: 500; }

                .title { margin: 0 0 10px 0; font-size: 1.3rem; color: #0f172a; line-height: 1.3; }
                .description { margin: 0 0 20px 0; color: #475569; font-size: 0.95rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

                .notice-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f1f5f9; }
                
                .author-info { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #64748b; }
                .avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
                
                .btn-download { background: #f8fafc; border: 1px solid #cbd5e1; color: #475569; padding: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .btn-download:hover { background: #e2e8f0; color: var(--dark-blue); }
            `}</style>
        </div>
    );
}
