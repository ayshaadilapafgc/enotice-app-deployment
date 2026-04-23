"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, FileText, Send, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState('request'); // 'request' or 'reset'
    
    // Request form state
    const [regNo, setRegNo] = useState("");
    const [fullName, setFullName] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    
    // Reset form state
    const [resetRegNo, setResetRegNo] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNo, fullName, reason, details })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || "Request submitted successfully.");
                // After successful request, maybe show a message and stay on page or switch to reset step
                setResetRegNo(regNo);
            } else {
                setError(data.error || "Failed to submit request");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNo: resetRegNo, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || "Password reset successfully.");
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || "Failed to reset password. Is your request approved?");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="login-container" style={{ maxWidth: '500px' }}>
                <div className="login-header">
                    <h1>Password <span>Recovery</span></h1>
                    <p>
                        {step === 'request' 
                            ? "Submit a request to admin to reset your password." 
                            : "Reset your password once your request is approved."}
                    </p>
                </div>
                
                {error && <div className="error-msg" style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #fee2e2' }}>{error}</div>}
                {success && <div className="success-msg" style={{ background: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #dcfce7' }}>{success}</div>}
                
                <div className="tab-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <button 
                        onClick={() => setStep('request')} 
                        className={`tab-btn ${step === 'request' ? 'active' : ''}`}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: step === 'request' ? 'var(--primary-color, #2563eb)' : '#f3f4f6', color: step === 'request' ? 'white' : '#6b7280', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s' }}
                    >
                        Request Reset
                    </button>
                    <button 
                        onClick={() => setStep('reset')} 
                        className={`tab-btn ${step === 'reset' ? 'active' : ''}`}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: step === 'reset' ? 'var(--primary-color, #2563eb)' : '#f3f4f6', color: step === 'reset' ? 'white' : '#6b7280', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s' }}
                    >
                        Complete Reset
                    </button>
                </div>

                {step === 'request' ? (
                    <form onSubmit={handleRequest}>
                        <div className="form-group">
                            <label htmlFor="reg_no"><User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Registration No. / ID</label>
                            <input 
                                type="text" 
                                id="reg_no" 
                                className="form-control" 
                                placeholder="Enter your ID" 
                                value={regNo}
                                onChange={(e) => setRegNo(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="full_name"><User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Full Name</label>
                            <input 
                                type="text" 
                                id="full_name" 
                                className="form-control" 
                                placeholder="Enter your full name" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reason"><FileText size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Reason for Reset</label>
                            <select 
                                id="reason" 
                                className="form-control" 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="forgot">Forgot Password</option>
                                <option value="compromised">Account Compromised</option>
                                <option value="expired">Password Expired</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="details"><Send size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Additional Details</label>
                            <textarea 
                                id="details" 
                                className="form-control" 
                                placeholder="Any other info for the admin..." 
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <div className="form-group">
                            <label htmlFor="reset_reg_no"><User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Registration No. / ID</label>
                            <input 
                                type="text" 
                                id="reset_reg_no" 
                                className="form-control" 
                                placeholder="Enter your ID" 
                                value={resetRegNo}
                                onChange={(e) => setResetRegNo(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="new_password"><Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> New Password</label>
                            <input 
                                type="password" 
                                id="new_password" 
                                className="form-control" 
                                placeholder="Enter new password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password"><ShieldCheck size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Confirm Password</label>
                            <input 
                                type="password" 
                                id="confirm_password" 
                                className="form-control" 
                                placeholder="Confirm new password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="form-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link href="/login" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Back to Login</Link>
                </div>
            </div>
            
            <style jsx>{`
                .auth-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #f8fafc;
                    padding: 20px;
                }
                .login-container {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    width: 100%;
                }
                .login-header h1 {
                    font-size: 1.8rem;
                    margin-bottom: 8px;
                    color: #1e293b;
                }
                .login-header h1 span {
                    color: var(--primary-color, #2563eb);
                }
                .login-header p {
                    color: #64748b;
                    margin-bottom: 24px;
                    font-size: 0.95rem;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #334155;
                    font-size: 0.9rem;
                }
                .form-control {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                    outline: none;
                }
                .form-control:focus {
                    border-color: var(--primary-color, #2563eb);
                }
                .btn-primary {
                    background: var(--primary-color, #2563eb);
                    color: white;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .tab-btn:hover {
                    background: #e5e7eb !important;
                }
                .tab-btn.active:hover {
                    background: var(--primary-color, #2563eb) !important;
                }
            `}</style>
        </main>
    );
}
