"use client";

import { useState, useEffect } from 'react';
import { Users, FileOutput, CheckCircle, GraduationCap, Clock, Award } from 'lucide-react';

export default function TeacherStudentsPage() {
    const [students, setStudents] = useState([]);
    const [subjectTaught, setSubjectTaught] = useState("");
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [activeTarget, setActiveTarget] = useState(null);
    const [activeTab, setActiveTab] = useState('GRADE'); // GRADE, ATTENDANCE, REPORT
    
    // Grading States
    const [score, setScore] = useState("");
    const [maxScore, setMaxScore] = useState("100");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    
    // Attendance States
    const [attended, setAttended] = useState("");
    const [total, setTotal] = useState("");
    
    // Report Data
    const [reportMarks, setReportMarks] = useState([]);
    const [reportAttendance, setReportAttendance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/teacher/students');
                const data = await res.json();
                if (data.students) setStudents(data.students);
                if (data.subjectTaught) setSubjectTaught(data.subjectTaught);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, []);
    
    // When a student is selected to view reports, fetch their historical data
    useEffect(() => {
        if (activeTarget && activeTab === 'REPORT') {
            fetch(`/api/teacher/students/report?studentId=${activeTarget}`)
                .then(res => res.json())
                .then(data => {
                    setReportMarks(data.marks || []);
                    setReportAttendance(data.attendance || null);
                });
        }
    }, [activeTarget, activeTab]);

    const handleSelectStudent = (id) => {
        setActiveTarget(id);
        setSuccessMsg("");
    };

    const handleSubmitGrade = async (e) => {
        e.preventDefault();
        setSubmitLoading(true); setSuccessMsg("");

        try {
            const res = await fetch('/api/teacher/marks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: activeTarget, score, maxScore })
            });
            if (res.ok) setSuccessMsg("Marks securely uploaded!");
        } catch (error) { console.error(error); } 
        finally { setSubmitLoading(false); setTimeout(() => setSuccessMsg(""), 2500); }
    };
    
    const handleSubmitAttendance = async (e) => {
        e.preventDefault();
        setSubmitLoading(true); setSuccessMsg("");

        try {
            const res = await fetch('/api/teacher/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: activeTarget, attendedClasses: attended, totalClasses: total })
            });
            if (res.ok) setSuccessMsg("Attendance metrics synced!");
        } catch (error) { console.error(error); } 
        finally { setSubmitLoading(false); setTimeout(() => setSuccessMsg(""), 2500); }
    };

    return (
        <div className="teacher-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Enrolled Students</h1>
                    <p className="page-subtitle">Currently managing class for: <strong className="subject-target">{subjectTaught}</strong></p>
                </div>
            </div>

            <div className="teacher-grid">
                <div className="student-list-card">
                    {loading ? (
                        <div className="loading-state">Loading classroom roster...</div>
                    ) : students.length === 0 ? (
                        <div className="empty-state">
                            <Users size={48} color="#94a3b8" />
                            <h3>No Verified Students</h3>
                            <p>Students must be accepted by the Admin before appearing here.</p>
                        </div>
                    ) : (
                        <table className="teacher-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Full Legal Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className={activeTarget === student.id ? 'active-row' : ''}>
                                        <td className="st-id"><GraduationCap size={16} className="mr-1"/> {student.regNo}</td>
                                        <td className="st-name">{student.fullName}</td>
                                        <td>
                                            <button className="grade-btn" onClick={() => handleSelectStudent(student.id)}>
                                                <FileOutput size={16} /> Manage Student
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {activeTarget && (
                    <div className="grading-panel">
                        <div className="tab-navigation">
                            <button className={activeTab === 'GRADE' ? 'active-tab' : ''} onClick={() => setActiveTab('GRADE')}>Grade</button>
                            <button className={activeTab === 'ATTENDANCE' ? 'active-tab' : ''} onClick={() => setActiveTab('ATTENDANCE')}>Attendance</button>
                            <button className={activeTab === 'REPORT' ? 'active-tab' : ''} onClick={() => setActiveTab('REPORT')}>Report</button>
                        </div>

                        {successMsg && <div className="success-banner"><CheckCircle size={16}/> {successMsg}</div>}

                        {activeTab === 'GRADE' && (
                            <form onSubmit={handleSubmitGrade} className="grading-form fadeInTab">
                                <h3>Upload Specific Marks</h3>
                                <div className="form-group">
                                    <label>Marks Obtained</label>
                                    <input type="number" className="form-control huge-input" placeholder="e.g. 85" value={score} onChange={(e) => setScore(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Maximum Possible Score</label>
                                    <input type="number" className="form-control" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} required />
                                </div>
                                <div className="btn-group">
                                    <button type="submit" className="btn-submit" disabled={submitLoading}>{submitLoading ? "Uploading..." : "Save Grade"}</button>
                                </div>
                            </form>
                        )}
                        
                        {activeTab === 'ATTENDANCE' && (
                            <form onSubmit={handleSubmitAttendance} className="grading-form fadeInTab">
                                <h3>Manage Attendance Ledger</h3>
                                <div className="form-group">
                                    <label>Total Classes Hosted in Subject</label>
                                    <input type="number" className="form-control" placeholder="e.g. 40" value={total} onChange={(e) => setTotal(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Classes Successfully Attended</label>
                                    <input type="number" className="form-control huge-input" placeholder="e.g. 35" value={attended} onChange={(e) => setAttended(e.target.value)} required />
                                </div>
                                <div className="btn-group">
                                    <button type="submit" className="btn-submit" disabled={submitLoading}>{submitLoading ? "Syncing..." : "Update Attendance"}</button>
                                </div>
                            </form>
                        )}
                        
                        {activeTab === 'REPORT' && (
                            <div className="report-panel fadeInTab">
                                <h3>Student Performance Overview</h3>
                                <div className="report-box mb-4">
                                    <h4><Clock size={16}/> Current Attendance Track</h4>
                                    {reportAttendance ? (
                                        <p className="report-stat">
                                            <strong>{reportAttendance.attendedClasses}</strong> / {reportAttendance.totalClasses} Classes
                                            <span style={{float:'right', color:'var(--dark-blue)', fontWeight:'bold'}}>
                                                {Math.round((reportAttendance.attendedClasses/reportAttendance.totalClasses)*100)}%
                                            </span>
                                        </p>
                                    ) : <p className="text-muted">No attendance tracked yet.</p>}
                                </div>
                                <div className="report-box">
                                    <h4><Award size={16}/> Historical Grades File</h4>
                                    {reportMarks.length === 0 ? <p className="text-muted">No grades uploaded yet.</p> : (
                                        <table className="mini-report-table">
                                            <tbody>
                                                {reportMarks.map(m => (
                                                    <tr key={m.id}>
                                                        <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                                        <td><strong>{m.score}</strong> / {m.maxScore}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                .fadeInTab { animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }
                .subject-target { color: var(--accent-blue); background: #e0f2fe; padding: 2px 8px; border-radius: 4px; }

                .teacher-grid { display: flex; gap: 20px; align-items: flex-start; }

                .student-list-card { flex: 1.5; background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; min-height: 300px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                
                .teacher-table { width: 100%; border-collapse: collapse; }
                .teacher-table th { text-align: left; padding: 12px 16px; background: #f8fafc; font-size: 0.85rem; color: #64748b; border-bottom: 2px solid #e2e8f0; }
                .teacher-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; transition: 0.2s; }
                .active-row td { background: #eff6ff; }
                .st-id { font-family: monospace; color: #475569; font-size: 0.9rem; display: flex; align-items: center; }
                .mr-1 { margin-right: 8px; color: #94a3b8; }
                .st-name { font-weight: 600; color: #0f172a; font-size: 1rem; }

                .grade-btn { background: white; border: 1px solid #cbd5e1; color: var(--dark-blue); padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.85rem; }
                .grade-btn:hover { background: #f8fafc; border-color: var(--accent-blue); color: var(--accent-blue); }

                .grading-panel { flex: 1; background: white; border-radius: 12px; padding: 24px; border: 2px solid var(--accent-blue); box-shadow: 0 10px 25px rgba(2, 132, 199, 0.1); position: sticky; top: 20px; animation: slideIn 0.3s; }
                @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

                .tab-navigation { display: flex; gap: 5px; background: #f1f5f9; padding: 4px; border-radius: 8px; margin-bottom: 20px; }
                .tab-navigation button { flex: 1; padding: 8px; border-radius: 6px; border: none; background: transparent; font-weight: 600; font-size: 0.8rem; color: #64748b; cursor: pointer; transition: 0.2s; }
                .tab-navigation button.active-tab { background: white; color: var(--dark-blue); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

                .success-banner { display: flex; align-items: center; gap: 8px; background: #dcfce7; color: #16a34a; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-weight: 600; font-size: 0.9rem; }

                .grading-form h3 { margin: 0 0 15px 0; color: #0f172a; font-size: 1.1rem; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: #475569; }
                .form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; }
                .huge-input { font-size: 1.5rem; font-weight: 800; color: var(--dark-blue); }
                
                .btn-group { display: flex; gap: 10px; margin-top: 30px; }
                .btn-submit { flex: 1; background: var(--dark-blue); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-submit:hover { background: var(--accent-blue); }
                
                .report-panel h3 { margin: 0 0 15px 0; font-size: 1.1rem; color: #0f172a; }
                .report-box h4 { display:flex; align-items:center; gap:8px; margin: 0 0 10px 0; font-size: 0.9rem; color: #475569; }
                .report-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
                .mb-4 { margin-bottom: 15px; }
                .report-stat { margin: 0; font-size: 0.95rem; color: #334155; }
                .text-muted { font-size: 0.85rem; color: #94a3b8; font-style: italic; margin: 0; }
                
                .mini-report-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
                .mini-report-table td { padding: 8px 4px; border-bottom: 1px solid #e2e8f0; color: #334155; }
                .mini-report-table tr:last-child td { border-bottom: none; }
            `}</style>
        </div>
    );
}
