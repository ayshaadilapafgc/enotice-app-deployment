"use client";

import { useState, useEffect } from 'react';
import { Users, Award, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function BulkMarksPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    
    // Global max score for this batch of marks
    const [globalMaxScore, setGlobalMaxScore] = useState("100");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('/api/teacher/students');
                const data = await res.json();
                
                if (data.students) {
                    setStudents(data.students.map(s => ({
                        ...s,
                        score: ""
                    })));
                }
            } catch (error) {
                console.error(error);
                setErrorMsg("Failed to load student roster");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleInputChange = (id, value) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, score: value } : s));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        const marksData = students
            .filter(s => s.score !== "")
            .map(s => ({
                studentId: s.id,
                score: s.score,
                maxScore: globalMaxScore
            }));

        if (marksData.length === 0) {
            setErrorMsg("Please enter marks for at least one student.");
            setSubmitLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/teacher/marks/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ marksData })
            });

            if (res.ok) {
                setSuccessMsg(`Successfully uploaded marks for ${marksData.length} students!`);
                // Clear scores after success
                setStudents(prev => prev.map(s => ({ ...s, score: "" })));
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Failed to upload marks");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("Something went wrong");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="teacher-container animated-fade-in">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link href="/dashboard/teacher/students" className="back-link">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="page-title">Bulk Marks Entry</h1>
                        <p className="page-subtitle">Upload internal grades for a specific test or assignment.</p>
                    </div>
                </div>
            </div>

            {successMsg && <div className="success-banner"><CheckCircle size={16}/> {successMsg}</div>}
            {errorMsg && <div className="error-msg" style={{ marginBottom: '20px' }}>{errorMsg}</div>}

            <div className="student-list-card">
                <div className="bulk-actions-header" style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Set Maximum Marks for all:</label>
                        <input 
                            type="number" 
                            className="form-control compact-input" 
                            value={globalMaxScore} 
                            onChange={(e) => setGlobalMaxScore(e.target.value)}
                            style={{ maxWidth: '80px' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>This will apply to all students in this submission.</p>
                </div>

                {loading ? (
                    <div className="loading-state">Loading students...</div>
                ) : students.length === 0 ? (
                    <div className="empty-state">
                        <Users size={48} color="#94a3b8" />
                        <h3>No Students Found</h3>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <table className="teacher-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Full Name</th>
                                    <th>Marks Obtained</th>
                                    <th>Max Marks</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => {
                                    const percentage = student.score !== "" ? Math.round((student.score / globalMaxScore) * 100) : 0;
                                    
                                    return (
                                        <tr key={student.id}>
                                            <td className="st-id">{student.regNo}</td>
                                            <td className="st-name">{student.fullName}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="form-control compact-input" 
                                                    value={student.score} 
                                                    onChange={(e) => handleInputChange(student.id, e.target.value)}
                                                    placeholder="e.g. 85"
                                                    max={globalMaxScore}
                                                />
                                            </td>
                                            <td><span style={{ color: '#64748b' }}>{globalMaxScore}</span></td>
                                            <td>
                                                {student.score !== "" && (
                                                    <span className={`percentage-tag ${percentage < 40 ? 'low' : 'good'}`}>
                                                        {percentage}% {percentage < 40 ? '(Fail)' : '(Pass)'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary" disabled={submitLoading} style={{ width: 'auto', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Save size={18} />
                                {submitLoading ? "Uploading Marks..." : "Save All Grades"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style jsx>{`
                .teacher-container { padding: 20px; }
                .page-header { margin-bottom: 30px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
                .page-subtitle { color: #64748b; margin-top: 5px; }
                .back-link { color: #64748b; transition: color 0.2s; }
                .back-link:hover { color: #3b82f6; }
                
                .student-list-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .teacher-table { width: 100%; border-collapse: collapse; }
                .teacher-table th { text-align: left; padding: 12px 16px; background: #f8fafc; font-size: 0.85rem; color: #64748b; border-bottom: 2px solid #e2e8f0; }
                .teacher-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; }
                
                .st-id { font-family: monospace; color: #475569; }
                .st-name { font-weight: 600; color: #0f172a; }
                
                .compact-input { padding: 8px 12px; max-width: 100px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; }
                .compact-input:focus { border-color: #3b82f6; ring: 2px rgba(59, 130, 246, 0.1); }
                
                .percentage-tag { padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
                .percentage-tag.good { background: #dcfce7; color: #16a34a; }
                .percentage-tag.low { background: #fee2e2; color: #dc2626; }
                
                .success-banner { display: flex; align-items: center; gap: 8px; background: #dcfce7; color: #16a34a; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-weight: 600; }
                .error-msg { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 8px; font-weight: 600; }
                
                .loading-state, .empty-state { text-align: center; padding: 40px; color: #64748b; }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
            `}</style>
        </div>
    );
}
