"use client";

import { useState, useEffect } from 'react';
import { Send, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminNotices() {
    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/admin/notices');
            const data = await res.json();
            if (data.notices) setNotices(data.notices);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchNotices(); }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (res.ok) {
                setTitle("");
                setContent("");
                fetchNotices(); // refresh
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchNotices();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="admin-cms-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Manager: Notices</h1>
                    <p className="page-subtitle">Draft and distribute campus-wide events and alerts.</p>
                </div>
            </div>

            <div className="cms-grid">
                {/* Editor Panel */}
                <div className="editor-panel">
                    <div className="panel-header">
                        <h2>Create New Notice</h2>
                        <span className="badge warning"><ShieldAlert size={12}/> Admin Only</span>
                    </div>
                    <form onSubmit={handlePost}>
                        <div className="form-group mt-4">
                            <label>Notice Headline</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. AI Workshop Tomorrow"
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label>Content / Details</label>
                            <textarea 
                                className="form-control text-area" 
                                rows="6"
                                placeholder="Describe the event, time, and location..."
                                value={content}
                                onChange={(e)=>setContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-primary mt-4" disabled={loading}>
                            <Send size={16}/> {loading ? 'Broadcasting...' : 'Publish Notice Globally'}
                        </button>
                    </form>
                </div>

                {/* Published List */}
                <div className="published-panel">
                    <div className="panel-header mb-4">
                        <h2>Live Notices</h2>
                    </div>
                    <div className="notice-feed">
                        {notices.length === 0 ? (
                            <p className="empty-text">No active notices.</p>
                        ) : notices.map(n => (
                            <div key={n.id} className="admin-notice-card">
                                <div>
                                    <h4>{n.title}</h4>
                                    <p>{n.content}</p>
                                    <small>Posted by {n.author.fullName} on {new Date(n.createdAt).toLocaleDateString()}</small>
                                </div>
                                <button className="delete-btn" onClick={() => handleDelete(n.id)}>
                                    <Trash2 size={18}/>
                                </button>
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
                .text-area { resize: vertical; }
                .btn-primary { width: 100%; background: var(--dark-blue); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .btn-primary:hover { background: var(--accent-blue); }
                .mt-4 { margin-top: 20px; } .mb-4 { margin-bottom: 20px; }
                
                .notice-feed { overflow-y: auto; flex: 1; }
                .admin-notice-card { background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
                .admin-notice-card h4 { margin: 0 0 5px 0; color: var(--dark-blue); font-size: 1rem; }
                .admin-notice-card p { margin: 0 0 10px 0; color: #475569; font-size: 0.85rem; line-height: 1.4; }
                .admin-notice-card small { color: #94a3b8; font-size: 0.75rem; }
                
                .delete-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .delete-btn:hover { background: #fecaca; }
                .empty-text { color: #94a3b8; font-style: italic; text-align: center; margin-top: 50px; }
            `}</style>
        </div>
    );
}
