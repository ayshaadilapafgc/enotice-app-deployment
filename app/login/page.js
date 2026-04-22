"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, BookOpen, Shield } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState("STUDENT"); // STUDENT, TEACHER, ADMIN
    const [regNo, setRegNo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNo, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || "Invalid credentials for this role");
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
                    <h1>e<span>Notice</span></h1>
                    <p>Select your portal and login to your account.</p>
                </div>
                
                {/* Role Selectors */}
                <div className="role-selector">
                   <button 
                       type="button" 
                       className={`role-tab ${role === 'STUDENT' ? 'active' : ''}`}
                       onClick={() => setRole('STUDENT')}
                   >
                       <User size={18} /> Student
                   </button>
                   <button 
                       type="button" 
                       className={`role-tab ${role === 'TEACHER' ? 'active' : ''}`}
                       onClick={() => setRole('TEACHER')}
                   >
                       <BookOpen size={18} /> Teacher
                   </button>
                   <button 
                       type="button" 
                       className={`role-tab ${role === 'ADMIN' ? 'active' : ''}`}
                       onClick={() => setRole('ADMIN')}
                   >
                       <Shield size={18} /> Admin
                   </button>
                </div>

                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="reg_no">{role === 'STUDENT' ? 'Registration No.' : role === 'TEACHER' ? 'Faculty ID' : 'Admin ID'}</label>
                        <input 
                            type="text" 
                            id="reg_no" 
                            className="form-control" 
                            placeholder={`Enter your ${role.toLowerCase()} ID`} 
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="Enter password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Verifying..." : `Login as ${role.charAt(0) + role.slice(1).toLowerCase()}`}
                    </button>
                    <div className="form-footer">
                        <Link href="/forgot-password">Forgot your password?</Link> 
                        <span style={{ margin: "0 10px", color: "#cbd5e1" }}>|</span> 
                        <Link href="/register">Create an Account</Link>
                    </div>
                </form>
            </div>
            
            <style jsx>{`
                .role-selector {
                    display: flex;
                    justify-content: space-between;
                    background: #f1f5f9;
                    padding: 5px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }
                .role-tab {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .role-tab:hover {
                    color: var(--dark-blue);
                }
                .role-tab.active {
                    background: white;
                    color: var(--accent-blue);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    transform: scale(1.02);
                }
            `}</style>
        </main>
    );
}
