"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Megaphone, Award, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [marksData, setMarksData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [materialsData, setMaterialsData] = useState([]);
    const [stats, setStats] = useState({ notices: 0 });
    
    useEffect(() => {
        setMounted(true);
        fetch('/api/student/marks').then(res => res.json()).then(data => {
            if(data.marks) setMarksData(data.marks);
        }).catch(e => console.error(e));

        fetch('/api/admin/notices').then(res => res.json()).then(data => {
            if(data.notices) {
                setEventsData(data.notices.slice(0, 4)); 
                setStats(prev => ({ ...prev, notices: data.notices.length }));
            }
        }).catch(e => console.error(e));

        fetch('/api/student/academic').then(res => res.json()).then(data => {
            if(data.attendance) setAttendanceData(data.attendance);
            if(data.materials) setMaterialsData(data.materials);
        }).catch(e => console.error(e));
    }, []);

    const totalAttended = attendanceData.reduce((sum, a) => sum + a.attendedClasses, 0);
    const totalClasses = attendanceData.reduce((sum, a) => sum + a.totalClasses, 0);
    const overallAttendance = totalClasses === 0 ? "N/A" : Math.round((totalAttended / totalClasses) * 100) + "%";

    // Prepare chart data from real attendance
    const chartData = attendanceData.map(a => ({
        name: a.subject.substring(0, 5),
        uv: Math.round((a.attendedClasses / a.totalClasses) * 100)
    }));

    if (!mounted) return <div />;

    return (
        <div className="dashboard-grid-layout">
            <div className="main-column" style={{flex: 1}}>
                
                {/* Top Row: Overview & Events */}
                <div className="top-row">
                    <section className="overview-panel dashboard-card">
                        <h2 className="panel-title">Campus eNotice Overview</h2>
                        <div className="metrics-grid">
                            <div className="metric-box">
                                <h3>Campus Notices</h3>
                                <div className="metric-content">
                                    <div className="icon-wrapper bg-blue"><Megaphone size={24} color="white" /></div>
                                    <div className="metric-text">
                                        <p>Total: <strong>{stats.notices}</strong></p>
                                        <p>Live alerts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="metric-box">
                                <h3>Academic Records</h3>
                                <div className="metric-content">
                                    <div className="icon-wrapper bg-gray"><Award size={24} color="white" /></div>
                                    <div className="metric-text">
                                        <p className="large-stat">{overallAttendance}</p>
                                        <p>Avg Attendance</p>
                                    </div>
                                </div>
                            </div>
                            <div className="metric-box">
                                <h3>Placement Drives</h3>
                                <div className="metric-content">
                                    <div className="icon-wrapper bg-dark-blue"><Briefcase size={24} color="white" /></div>
                                    <div className="metric-text">
                                        <p>Open Drives: <strong>Live</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="events-panel dashboard-card">
                        <div className="panel-header-inline">
                            <h2 className="panel-title">Upcoming Events</h2>
                            <select className="date-filter"><option>Last 30 Days</option></select>
                        </div>
                        <div className="events-list">
                            {eventsData.length === 0 ? (
                                <p style={{fontSize:'0.85rem', color:'#64748b', padding:'10px'}}>No upcoming events.</p>
                            ) : eventsData.map((event, i) => (
                                <div key={event.id} className="event-item">
                                    <div className={`event-img bg-img-${(i % 4) + 1}`}></div>
                                    <h4>{event.title}</h4>
                                    <p>{new Date(event.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Bottom Row: Analytics */}
                <section className="analytics-panel dashboard-card">
                    <h2 className="panel-title">Academic Hub Detailed Analytics</h2>
                    
                    <div className="analytics-layout">
                        {/* Chart */}
                        <div className="chart-container">
                            <h3>Attendance Trend</h3>
                            <div className="chart-wrapper">
                                {chartData.length === 0 ? (
                                    <p className="my-4" style={{color:'#64748b'}}>No attendance data available.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                                            <YAxis tick={{fontSize: 12}} />
                                            <Tooltip cursor={{fill: '#f8fafc'}} />
                                            <Bar dataKey="uv" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Middle Tables Container */}
                        <div className="analytics-middle-col">
                            <div className="marks-table">
                                <h3>Official Internal Marks</h3>
                                {marksData.length === 0 ? (
                                    <p className="no-marks my-4">No marks assigned yet. Check back when teachers upload.</p>
                                ) : (
                                    <table>
                                        <thead><tr><th>Subject / Teacher</th><th>Score</th><th>Max</th></tr></thead>
                                        <tbody>
                                            {marksData.map(mark => (
                                                <tr key={mark.id}>
                                                    <td>
                                                        <div style={{display:'flex', flexDirection:'column'}}>
                                                            <strong>{mark.subject}</strong>
                                                            <small style={{color:'#94a3b8'}}>{mark.teacher?.fullName}</small>
                                                        </div>
                                                    </td>
                                                    <td><span style={{fontWeight:600, color: 'var(--dark-blue)'}}>{mark.score}</span></td>
                                                    <td>{mark.maxScore}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            
                            <div className="papers-table mt-4">
                                <h3>Question Papers / Academic Materials</h3>
                                {materialsData.length === 0 ? (
                                    <p className="no-marks my-4">No materials uploaded.</p>
                                ) : (
                                    <table>
                                        <tbody>
                                            {materialsData.map(m => (
                                                <tr key={m.id}>
                                                    <td>
                                                        <strong>{m.title}</strong><br/>
                                                        <small style={{color:'#64748b'}}>{m.subject}</small>
                                                    </td>
                                                    <td className="pdf-link">
                                                        <a href={m.url} target="_blank" rel="noopener noreferrer">View</a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            <style jsx>{`
                .dashboard-grid-layout {
                    display: flex;
                    gap: 20px;
                    width: 100%;
                }
                .main-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .dashboard-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .panel-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: var(--dark-blue);
                }
                .top-row {
                    display: flex;
                    gap: 20px;
                }
                .overview-panel { flex: 1.5; }
                .events-panel { flex: 1; }
                
                .metrics-grid {
                    display: flex;
                    gap: 15px;
                }
                .metric-box {
                    flex: 1;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 15px;
                    background: #f8fafc;
                }
                .metric-box h3 { font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 12px; }
                .metric-content { display: flex; align-items: flex-start; gap: 12px; }
                .icon-wrapper {
                    width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
                }
                .bg-blue { background: #3b82f6; }
                .bg-gray { background: #64748b; }
                .bg-dark-blue { background: #1e293b; }
                
                .metric-text p { font-size: 0.85rem; margin: 2px 0; color: #334155; }
                .metric-text strong { font-weight: 700; color: #0f172a; font-size: 1rem; }
                .large-stat { font-size: 1.8rem !important; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 4px !important; }
                .small-text { font-size: 0.75rem !important; color: #64748b !important; line-height: 1.2; }
                .mt-1 { margin-top: 5px; }
                .mt-2 { margin-top: 10px; }
                .mt-4 { margin-top: 20px; }
                .my-4 { margin-top: 20px; margin-bottom: 20px; }

                .panel-header-inline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .panel-header-inline h2 { margin: 0; }
                .date-filter { border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; background: white; outline: none; }
                
                .events-list { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
                .event-item { min-width: 120px; }
                .event-img { width: 100%; height: 75px; border-radius: 8px; background: #e2e8f0; margin-bottom: 8px; background-size: cover; background-position: center; }
                .bg-img-1 { background-image: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'); }
                .bg-img-2 { background-image: url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop'); }
                .bg-img-3 { background-image: url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&h=200&fit=crop'); }
                .bg-img-4 { background-image: url('https://images.unsplash.com/photo-1507676184212-beceef3a72eb?w=300&h=200&fit=crop'); }
                .event-item h4 { font-size: 0.75rem; font-weight: 700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--dark-blue); }
                .event-item p { font-size: 0.7rem; color: #64748b; margin: 2px 0 0 0; }

                .analytics-layout { display: flex; gap: 40px; }
                .chart-container { flex: 1.5; border-right: 1px solid #f1f5f9; padding-right: 20px; }
                .analytics-middle-col { flex: 1.5; }

                .chart-container h3, .marks-table h3, .papers-table h3 { font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 12px; }
                
                table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
                th { text-align: left; padding: 6px; color: #0f172a; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
                td { padding: 12px 6px; border-bottom: 1px solid #f1f5f9; color: #334155; }
                tr:last-child td { border-bottom: none; }
                
                .pdf-link a { color: #3b82f6; font-weight: 600; text-decoration: underline; cursor: pointer; }
                
            `}</style>
        </div>
    );
}
