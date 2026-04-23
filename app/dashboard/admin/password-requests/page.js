"use client";

import { useState, useEffect } from 'react';
import { Check, X, Clock, User, FileText, AlertCircle, Search } from 'lucide-react';

export default function AdminPasswordRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/password-requests');
            const data = await res.json();
            if (res.ok) {
                setRequests(data);
            }
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status) => {
        setActionLoading(id);
        try {
            const res = await fetch('/api/admin/password-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            if (res.ok) {
                setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
            }
        } catch (err) {
            console.error("Action failed", err);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRequests = requests.filter(req => 
        req.regNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        req.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Pending</span>;
            case 'APPROVED':
                return <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Approved</span>;
            case 'REJECTED':
                return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Rejected</span>;
            case 'COMPLETED':
                return <span style={{ background: '#e0f2fe', color: '#075985', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Completed</span>;
            default:
                return <span>{status}</span>;
        }
    };


    return (
        <div className="admin-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Password Recovery Portal</h1>
                    <p className="page-subtitle">Review and approve user password reset requests.</p>
                </div>
                <div className="search-bar">
                    <Search size={16} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Name..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="users-list-card mb-8">
                <div className="card-top">
                    <h2>Pending Reset Requests</h2>
                </div>
                {loading ? (
                    <div className="loading-state">Scanning recovery queue...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="empty-state">
                        <Check size={48} color="#10b981" />
                        <h3>Recovery Queue Clear</h3>
                        <p>No pending password reset requests found.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User Details</th>
                                <th>Reason</th>
                                <th>Additional Info</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.id}>
                                    <td className="user-name">
                                        {req.fullName} <br/>
                                        <small className="text-muted">ID: {req.regNo}</small>
                                    </td>
                                    <td>
                                        <span className="subject-tag" style={{ textTransform: 'capitalize' }}>{req.reason}</span>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '200px', fontSize: '0.85rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.details}>
                                            {req.details || "—"}
                                        </div>
                                    </td>
                                    <td><small>{new Date(req.createdAt).toLocaleDateString()}</small></td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td className="action-buttons">
                                        {req.status === 'PENDING' ? (
                                            <>
                                                <button className="accept-btn" onClick={() => handleAction(req.id, 'APPROVED')} disabled={actionLoading === req.id}>
                                                    <Check size={16} /> Approve
                                                </button>
                                                <button className="reject-btn" onClick={() => handleAction(req.id, 'REJECTED')} disabled={actionLoading === req.id}>
                                                    <X size={16} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }

                .search-bar { background: #f8fafc; display: flex; align-items: center; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 300px; }
                .search-icon { color: #94a3b8; margin-right: 8px; }
                .search-input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.85rem; }

                .users-list-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                .card-top h2 { margin: 0; color: #0f172a; font-size: 1.2rem; }
                
                .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 180px; color: #64748b; text-align: center; }
                .empty-state h3 { margin: 15px 0 5px 0; color: #0f172a; font-size: 1.1rem; }
                
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 12px 16px; background: #f8fafc; font-size: 0.8rem; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
                .admin-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                
                .user-name { font-weight: 600; color: #0f172a; font-size: 0.95rem; }
                .text-muted { color: #64748b; font-weight: normal; }
                
                .subject-tag { background: #fef08a; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }

                .action-buttons { display: flex; gap: 10px; }
                .accept-btn { background: #16a34a; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.8rem; }
                .accept-btn:hover { background: #15803d; }
                .reject-btn { background: white; border: 1px solid #ef4444; color: #ef4444; padding: 8px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.8rem; }
                .reject-btn:hover { background: #fef2f2; }
                button:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
