"use client";

import { useState, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, Trash2, ShieldAlert, FileText } from 'lucide-react';

export default function TeacherMaterials() {
    const [papers, setPapers] = useState([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchPapers = async () => {
        try {
            const res = await fetch('/api/teacher/materials');
            const data = await res.json();
            if (data.papers) setPapers(data.papers);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchPapers(); }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/teacher/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url })
            });
            if (res.ok) {
                setTitle(""); setUrl("");
                fetchPapers();
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="materials-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Classroom Materials</h1>
                    <p className="page-subtitle">Upload previous question papers and curriculum resources to your students.</p>
                </div>
            </div>

            <div className="cms-grid">
                {/* Editor Panel */}
                <div className="editor-panel">
                    <div className="panel-header">
                        <h2>Distribute Question Paper</h2>
                    </div>
                    <form onSubmit={handlePost}>
                        <div className="form-group mt-4">
                            <label>Document Title</label>
                            <input type="text" className="form-control" placeholder="e.g. Mid-Term 2025 Paper" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group mt-4">
                            <label>Direct File URL (Google Drive, OneDrive, etc.)</label>
                            <input type="url" className="form-control" placeholder="https://drive.google.com/file/d/..." value={url} onChange={(e)=>setUrl(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary mt-4" disabled={loading}>
                            <UploadCloud size={16}/> {loading ? 'Uploading...' : 'Publish to Students'}
                        </button>
                    </form>
                </div>

                {/* Published List */}
                <div className="published-panel">
                    <div className="panel-header mb-4">
                        <h2>Your Uploaded Materials</h2>
                    </div>
                    <div className="notice-feed">
                        {papers.length === 0 ? (
                            <p className="empty-text">No materials uploaded yet.</p>
                        ) : papers.map(p => (
                            <div key={p.id} className="admin-notice-card">
                                <div>
                                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                        <FileText size={16} color="#3b82f6" />
                                        <h4>{p.title}</h4>
                                    </div>
                                    <a href={p.url} target="_blank" rel="noreferrer" className="link-url"><LinkIcon size={12}/> View Original File</a>
                                </div>
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
                
                .form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; }
                .btn-primary { width: 100%; background: var(--dark-blue); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .btn-primary:hover { background: var(--accent-blue); }
                .mt-4 { margin-top: 20px; } .mb-4 { margin-bottom: 20px; }
                
                .notice-feed { overflow-y: auto; flex: 1; }
                .admin-notice-card { background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
                .admin-notice-card h4 { margin: 0; color: var(--dark-blue); font-size: 1rem; }
                .link-url { display: inline-flex; align-items: center; gap: 4px; background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-decoration: none; margin-top: 10px; }
                .link-url:hover { background: #c7d2fe; }
                
                .empty-text { color: #94a3b8; font-style: italic; text-align: center; margin-top: 50px; }
            `}</style>
        </div>
    );
}
