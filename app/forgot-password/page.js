"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [regNo, setRegNo] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNo, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || "Password reset successfully.");
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Password <span>Recovery</span></h1>
                    <p>Enter your registration number to reset your password.</p>
                </div>
                
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg" style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>{success}</div>}
                
                <form onSubmit={handleReset}>
                    <div className="form-group">
                        <label htmlFor="reg_no">Registration No. / ID</label>
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
                        <label htmlFor="new_password">New Password</label>
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
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <div className="form-footer">
                        <Link href="/login">Back to Login</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
