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
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Password Reset Requests</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review and manage user password reset requests.</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Name..." 
                        style={{ padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '300px', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                    <p style={{ color: '#64748b' }}>No password reset requests found.</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>User Details</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>Reason</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>Additional Info</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>Status</th>
                                <th style={{ textAlign: 'center', padding: '16px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2563eb' }}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{req.fullName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ID: {req.regNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ textTransform: 'capitalize', color: '#334155', fontWeight: '500' }}>{req.reason}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ maxWidth: '200px', fontSize: '0.85rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.details}>
                                            {req.details || "—"}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {getStatusBadge(req.status)}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {req.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'APPROVED')}
                                                    disabled={actionLoading === req.id}
                                                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'REJECTED')}
                                                    disabled={actionLoading === req.id}
                                                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#991b1b', cursor: 'pointer' }}
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>Processed</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
