"use client";

import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, ShieldAlert, CheckCircle2, Search, XCircle } from 'lucide-react';

export default function AdminUsersPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.pending) setPendingUsers(data.pending);
            if (data.verified) setVerifiedUsers(data.verified);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId, action) => {
        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action })
            });
            if (res.ok) {
                fetchUsers(); // Complete refresh to rebalance both tables
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="admin-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Identity Management Portal</h1>
                    <p className="page-subtitle">Verify, reject, or revoke access to the ecosystem components.</p>
                </div>
            </div>

            {/* Pending Requests Queue */}
            <div className="users-list-card mb-8">
                <div className="card-top">
                    <h2>Pending Verification Requests</h2>
                </div>
                {loading ? (
                    <div className="loading-state">Scanning pending requests...</div>
                ) : pendingUsers.length === 0 ? (
                    <div className="empty-state">
                        <CheckCircle2 size={48} color="#10b981" />
                        <h3>Secure Checkpoint Clear</h3>
                        <p>There are no pending account registrations waiting for your approval.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Name</th>
                                <th>Credentials / ID</th>
                                <th>Details</th>
                                <th>Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map((user) => (
                                <tr key={user.id}>
                                    <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                                    <td className="user-name">{user.fullName}</td>
                                    <td className="user-id"><ShieldAlert size={14} className="mr-1"/> {user.regNo}</td>
                                    <td>
                                        {user.role === 'TEACHER' ? <span className="subject-tag">Subj: {user.subjectTaught}</span> : <span className="student-tag">Enrolled Student</span>}
                                    </td>
                                    <td className="action-buttons">
                                        <button className="accept-btn" onClick={() => handleAction(user.id, 'VERIFY')} disabled={actionLoading === user.id}>
                                            <UserPlus size={16} /> Accept
                                        </button>
                                        <button className="reject-btn" onClick={() => handleAction(user.id, 'REJECT')} disabled={actionLoading === user.id}>
                                            <UserMinus size={16} /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Full Historical Database */}
            <div className="users-list-card fade-delay">
                <div className="card-top">
                    <h2>Verified System Directory</h2>
                    <div className="search-bar">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search verified users..." className="search-input" />
                    </div>
                </div>
                {loading ? ( <div className="loading-state">Loading user database...</div> ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Name</th>
                                <th>Metrics</th>
                                <th>Timestamp Granted</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifiedUsers.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No verified users populated yet.</td></tr>}
                            {verifiedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                                    <td className="user-name">{user.fullName} <br/><small className="text-muted">{user.regNo}</small></td>
                                    <td>
                                        {user.role === 'TEACHER' ? <span className="subject-tag">Subj: {user.subjectTaught}</span> : <span className="student-tag">Enrolled Student</span>}
                                    </td>
                                    <td><small>{new Date(user.createdAt).toLocaleDateString()}</small></td>
                                    <td>
                                        <button className="reject-btn" onClick={() => handleAction(user.id, 'REVOKE')} disabled={actionLoading === user.id}>
                                            <XCircle size={16} /> Revoke Access
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                .fade-delay { opacity: 0; animation: fadeIn 0.4s 0.2s ease forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }

                .mb-8 { margin-bottom: 40px; }
                .users-list-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                .card-top h2 { margin: 0; color: #0f172a; font-size: 1.2rem; }
                
                .search-bar { background: #f8fafc; display: flex; align-items: center; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 250px; }
                .search-icon { color: #94a3b8; margin-right: 8px; }
                .search-input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.85rem; }

                .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 180px; color: #64748b; text-align: center; }
                .empty-state h3 { margin: 15px 0 5px 0; color: #0f172a; font-size: 1.1rem; }
                
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 12px 16px; background: #f8fafc; font-size: 0.8rem; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
                .admin-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .admin-table tr:hover td { background: #f8fafc; }
                
                .role-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
                .teacher { background: #fee2e2; color: #b91c1c; }
                .student { background: #e0e7ff; color: #4338ca; }
                
                .user-name { font-weight: 600; color: #0f172a; font-size: 0.95rem; }
                .user-id { display: flex; align-items: center; color: #475569; font-size: 0.85rem; font-family: monospace; }
                .mr-1 { margin-right: 5px; }
                
                .subject-tag { background: #fef08a; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
                .student-tag { color: #94a3b8; font-size: 0.8rem; font-style: italic; }
                .text-muted { color: #64748b; font-weight: normal; }

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
