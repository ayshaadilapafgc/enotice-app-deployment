"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [regNo, setRegNo] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [subjectTaught, setSubjectTaught] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, regNo, password, role, subjectTaught: role === 'TEACHER' ? subjectTaught : null })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Registration secure! Account is Pending Admin Approval. Redirecting...");
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="login-container register-container">
                <div className="login-header">
                    <h1>Institute Register</h1>
                    <p>Request account activation from the administration.</p>
                </div>
                
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg" style={{color: 'green', background: '#dcfce7', padding: '10px', borderRadius: '8px', marginBottom: '15px'}}>{success}</div>}
                
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Account Role Request</label>
                        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="ADMIN">System Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input 
                            type="text" 
                            id="fullname" 
                            className="form-control" 
                            placeholder="Enter your full name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg_no">Registration No. / ID</label>
                        <input 
                            type="text" 
                            id="reg_no" 
                            className="form-control" 
                            placeholder="Enter unique ID" 
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value)}
                            required 
                        />
                    </div>
                    
                    {role === 'TEACHER' && (
                        <div className="form-group" style={{animation: 'fadeIn 0.3s ease'}}>
                            <label htmlFor="subject">Subject Taught Specialization</label>
                            <input 
                                type="text" 
                                id="subject" 
                                className="form-control" 
                                placeholder="e.g. Data Structures" 
                                value={subjectTaught}
                                onChange={(e) => setSubjectTaught(e.target.value)}
                                required 
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Secure Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="Choose a strong password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Submitting Request..." : "Request Account Creation"}
                    </button>
                    <div className="form-footer">
                        <Link href="/login">Return to Login</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
