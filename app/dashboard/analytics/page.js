"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

const attendanceData = [
  { name: 'Mon', uv: 95 },
  { name: 'Tue', uv: 80 },
  { name: 'Wed', uv: 100 },
  { name: 'Thu', uv: 90 },
  { name: 'Fri', uv: 85 },
];

const performanceData = [
  { term: 'Mid 1', score: 75 },
  { term: 'Mid 2', score: 82 },
  { term: 'Mid 3', score: 88 },
  { term: 'Finals', score: 94 },
];

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div />;

    return (
        <div className="analytics-container animated-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Performance Analytics</h1>
                    <p className="page-subtitle">Deep dive into your core academic metrics over time.</p>
                </div>
            </div>

            <div className="chart-grid">
                {/* Chart 1: Weekly Attendance */}
                <div className="chart-card">
                    <h3>Weekly Attendance Pattern</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                                <YAxis fontSize={12} stroke="#94a3b8" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="uv" stroke="#2563eb" fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Term Performance Matrix */}
                <div className="chart-card">
                    <h3>Term Progression trajectory</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={performanceData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="term" fontSize={12} stroke="#94a3b8" />
                                <YAxis domain={[0, 100]} fontSize={12} stroke="#94a3b8" />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Overall Insights */}
            <div className="insights-panel mt-6">
                <h3>AI Insights</h3>
                <div className="insights-content">
                    <div className="insight-item positive">
                        <strong>Upward Trend:</strong> Your core subjects are showing an aggressive 14% improvement compared to Semester III.
                    </div>
                    <div className="insight-item warning">
                        <strong>Attention Needed:</strong> Attendance on Tuesdays consistently dips below the 85% requirement baseline.
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .page-header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                .page-title { font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .page-subtitle { color: #64748b; margin: 4px 0 0 0; font-size: 0.95rem; }

                .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                
                .chart-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .chart-card h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: #0f172a; }
                
                .insights-panel { background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px dashed #cbd5e1; }
                .insights-panel h3 { margin: 0 0 15px 0; font-size: 1.1rem; color: #0f172a; }
                
                .insights-content { display: flex; flex-direction: column; gap: 10px; }
                .insight-item { padding: 12px 16px; border-radius: 8px; font-size: 0.9rem; line-height: 1.5; }
                .insight-item strong { display: block; margin-bottom: 4px; }
                .positive { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
                .warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
                
                .mt-6 { margin-top: 30px; }
            `}</style>
        </div>
    );
}
