"use client";

import { BookOpen, Award, Link as LinkIcon, Download, GraduationCap, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AcademicHubPage() {
    const [marks, setMarks] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/student/academic')
            .then(res => res.json())
            .then(data => {
                if (data.marks) setMarks(data.marks);
                if (data.materials) setMaterials(data.materials);
                if (data.attendance) setAttendance(data.attendance);
                setLoading(false);
            })
            .catch(e => { console.error(e); setLoading(false); });
    }, []);

    const totalAttended = attendance.reduce((sum, a) => sum + a.attendedClasses, 0);
    const totalClasses = attendance.reduce((sum, a) => sum + a.totalClasses, 0);
    const overallAttendance = totalClasses === 0 ? "N/A" : Math.round((totalAttended / totalClasses) * 100) + "%";

    return (
        <div className="academic-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Personal Academic Hub</h1>
                    <p className="page-subtitle">Your comprehensive portal for grades, materials, and internal tracking.</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Aggregating academic data...</div>
            ) : (
                <div className="hub-grid">
                    {/* Left Column */}
                    <div className="left-col">
                        <div className="dashboard-card mb-4 summary-card attendance-card">
                            <div className="flex-spread">
                                <div>
                                    <h3>Overall Attendance Track</h3>
                                    <p className="text-muted">Aggregated across all registered subjects.</p>
                                </div>
                                <div className="big-percentage">{overallAttendance}</div>
                            </div>
                            
                            <div className="mt-4 attendance-breakdown">
                                {attendance.length === 0 ? <p className="text-muted">No attendance reports uploaded yet.</p> : attendance.map(a => (
                                    <div key={a.id} className="subject-attendance">
                                        <span>{a.subject} ({a.teacher.fullName})</span>
                                        <strong>{a.attendedClasses} / {a.totalClasses}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <h2 className="card-title"><BookOpen size={18}/> Course Materials Directory</h2>
                            <div className="materials-list mt-3">
                                {materials.length === 0 ? (
                                    <p className="text-muted italic">No question papers uploaded by teachers.</p>
                                ) : (
                                    materials.map(mat => (
                                        <div key={mat.id} className="material-item">
                                            <div className="mat-icon">
                                                <Download size={16} />
                                            </div>
                                            <div className="mat-info">
                                                <h4>{mat.title}</h4>
                                                <span className="mat-meta">Format: PDF/External • Subj: {mat.subject}</span>
                                            </div>
                                            <a href={mat.url} target="_blank" rel="noreferrer" className="btn-link"><LinkIcon size={14}/> Access</a>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-col">
                        <div className="dashboard-card marks-card">
                            <h2 className="card-title"><Award size={18}/> Official Internal Scorecard</h2>
                            {marks.length === 0 ? (
                                <div className="empty-state">
                                    <GraduationCap size={40} color="#cbd5e1" />
                                    <p className="mt-2 text-muted">No internal marks published to your ledger yet.</p>
                                </div>
                            ) : (
                                <table className="marks-table mt-4">
                                    <thead>
                                        <tr>
                                            <th>Subject / Assigner</th>
                                            <th>Date Awarded</th>
                                            <th>Obtained</th>
                                            <th>Maximum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {marks.map(mark => (
                                            <tr key={mark.id}>
                                                <td className="subject-cell">
                                                    <strong>{mark.subject}</strong>
                                                    <small>{mark.teacher?.fullName}</small>
                                                </td>
                                                <td className="date-cell">{new Date(mark.createdAt).toLocaleDateString()}</td>
                                                <td className="score-cell">{mark.score}</td>
                                                <td>{mark.maxScore}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }

                .hub-grid { display: flex; gap: 24px; align-items: flex-start; }
                .left-col { flex: 1; display: flex; flex-direction: column; }
                .right-col { flex: 1.3; }

                .dashboard-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .card-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.2rem; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
                .mb-4 { margin-bottom: 24px; }
                .mt-2 { margin-top: 10px; }
                .mt-3 { margin-top: 15px; }
                .mt-4 { margin-top: 20px; }
                .text-muted { color: #64748b; font-size: 0.85rem; margin: 0; }
                .italic { font-style: italic; }

                .attendance-card { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; border: none; }
                .attendance-card h3 { margin: 0 0 5px 0; color: white; }
                .attendance-card .text-muted { color: #94a3b8; }
                .flex-spread { display: flex; justify-content: space-between; align-items: center; }
                .big-percentage { font-size: 3rem; font-weight: 800; color: #38bdf8; line-height: 1; }
                .attendance-breakdown { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 8px; }
                .subject-attendance { display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; }
                .subject-attendance:last-child { border-bottom: none; padding-bottom: 0; }

                .materials-list { display: flex; flex-direction: column; gap: 12px; }
                .material-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; background: #f8fafc; }
                .material-item:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-color: #cbd5e1; }
                .mat-icon { width: 40px; height: 40px; border-radius: 8px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .mat-info { flex: 1; }
                .mat-info h4 { margin: 0 0 2px 0; font-size: 0.95rem; color: #0f172a; }
                .mat-meta { font-size: 0.75rem; color: #64748b; }
                
                .btn-link { background: white; color: var(--dark-blue); border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
                .btn-link:hover { background: #f1f5f9; }

                .marks-card { min-height: 500px; }
                .empty-state { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 0; }
                
                .marks-table { width: 100%; border-collapse: collapse; }
                .marks-table th { text-align: left; padding: 12px; background: #f8fafc; font-size: 0.8rem; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
                .marks-table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
                
                .subject-cell { display: flex; flex-direction: column; }
                .subject-cell strong { font-size: 0.95rem; color: #0f172a; }
                .subject-cell small { font-size: 0.75rem; color: #94a3b8; }
                
                .date-cell { font-size: 0.85rem; color: #64748b; }
                .score-cell { font-size: 1.2rem; font-weight: 800; color: var(--dark-blue); }

                .loading-state { text-align: center; color: #64748b; padding: 40px; font-style: italic; }
            `}</style>
        </div>
    );
}
