"use client";

import { UserCircle, Mail, Phone, MapPin, ShieldCheck, Calendar, BookOpen, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editEnrollment, setEditEnrollment] = useState('');
    const [editSemester, setEditSemester] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMounted(true);
        fetch('/api/auth/me').then(r => r.json()).then(data => {
            if(data.user) {
                setUser(data.user);
                setEditName(data.user.fullName || '');
                setEditPhone(data.user.phone || '');
                setEditLocation(data.user.location || '');
                setEditEnrollment(data.user.enrollmentYear || '');
                setEditSemester(data.user.currentSemester || '');
            }
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    fullName: editName,
                    phone: editPhone,
                    location: editLocation,
                    enrollmentYear: editEnrollment,
                    currentSemester: editSemester
                })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setIsEditing(false);
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || 'Failed to update');
            }
        } catch (e) {
            setMessage('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return <div />;

    return (
        <div className="profile-container animated-fade-in">
            <div className="profile-header-banner">
                <div className="banner-overlay"></div>
            </div>
            
            <div className="profile-content-grid">
                {/* Left Column: ID Card */}
                <div className="profile-card user-id-card">
                    <div className="avatar-wrapper">
                        <UserCircle size={100} className="avatar-icon" strokeWidth={1} />
                        <div className="status-badge online"></div>
                    </div>
                    {isEditing ? (
                        <input 
                            type="text" 
                            className="form-control-inline" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={loading}
                        />
                    ) : (
                        <h2>{user ? user.fullName : "Loading..."}</h2>
                    )}
                    <p className="role-tag student">{user?.role === 'TEACHER' ? 'Faculty Member' : 'Computer Science Student'}</p>
                    
                    <div className="id-details mt-4">
                        <div className="detail-row">
                            <span>Reg. Number</span>
                            <strong>{user ? user.regNo : "..."}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Enrollment Year</span>
                            {isEditing ? (
                                <input type="text" className="form-control-inline-sm" value={editEnrollment} onChange={e=>setEditEnrollment(e.target.value)} disabled={loading}/>
                            ) : (
                                <strong>{user?.enrollmentYear || '2023'}</strong>
                            )}
                        </div>
                        <div className="detail-row">
                            <span>Current Semester</span>
                            {isEditing ? (
                                <input type="text" className="form-control-inline-sm" value={editSemester} onChange={e=>setEditSemester(e.target.value)} disabled={loading}/>
                            ) : (
                                <strong>{user?.currentSemester || 'Semester IV'}</strong>
                            )}
                        </div>
                    </div>

                    {message && <div style={{color: '#16a34a', fontSize: '0.85rem', marginBottom: '10px'}}>{message}</div>}
                    
                    {isEditing ? (
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                            <button className="btn-primary w-100" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                            <button className="btn-secondary w-100" onClick={() => { 
                                setIsEditing(false); 
                                setEditName(user.fullName || '');
                                setEditPhone(user.phone || '');
                                setEditLocation(user.location || '');
                                setEditEnrollment(user.enrollmentYear || '');
                                setEditSemester(user.currentSemester || '');
                            }} disabled={loading}>Cancel</button>
                        </div>
                    ) : (
                        <button className="btn-primary mt-4 w-100" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    )}
                </div>

                {/* Right Column: Info & Activity */}
                <div className="profile-details-section">
                    <div className="profile-card info-card">
                        <h3 className="card-title">Contact Information</h3>
                        <div className="contact-grid mt-4">
                            <div className="contact-item">
                                <Mail className="contact-icon" size={20} />
                                <div>
                                    <small>Email Address</small>
                                    <p>{user ? `${user.regNo.toLowerCase()}@college.edu` : "..."}</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" size={20} />
                                <div>
                                    <small>Phone Number</small>
                                    {isEditing ? (
                                        <input type="text" className="form-control-inline-sm" value={editPhone} onChange={e=>setEditPhone(e.target.value)} disabled={loading}/>
                                    ) : (
                                        <p>{user?.phone || '+1 (555) 123-4567'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="contact-item">
                                <MapPin className="contact-icon" size={20} />
                                <div>
                                    <small>Location / Hostel</small>
                                    {isEditing ? (
                                        <input type="text" className="form-control-inline-sm" value={editLocation} onChange={e=>setEditLocation(e.target.value)} disabled={loading}/>
                                    ) : (
                                        <p>{user?.location || 'Block B, Room 142'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="contact-item">
                                <ShieldCheck className="contact-icon" size={20} />
                                <div>
                                    <small>Account Status</small>
                                    <p className="status-good">Verified User</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card mt-4">
                        <h3 className="card-title">Recent Academic Activity</h3>
                        <div className="activity-timeline mt-4">
                            <div className="timeline-item">
                                <div className="timeline-icon bg-blue"><BookOpen size={16} color="white" /></div>
                                <div className="timeline-content">
                                    <h4>Submitted Assignment: Math 202</h4>
                                    <p>Uploaded PDF 'calculus_final.pdf'</p>
                                    <span className="time"><Clock size={12}/> 2 hours ago</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon bg-green"><Calendar size={16} color="white" /></div>
                                <div className="timeline-content">
                                    <h4>Registered for Spring Carnival</h4>
                                    <p>Generated e-ticket #4928</p>
                                    <span className="time"><Clock size={12}/> Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-container { max-width: 1100px; margin: 0 auto; }
                .animated-fade-in { animation: fadeIn 0.4s ease forwards; }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .profile-header-banner {
                    height: 180px;
                    border-radius: 16px;
                    background: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop') center/cover;
                    position: relative;
                    margin-bottom: -60px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                .banner-overlay {
                    position: absolute; inset: 0; border-radius: 16px;
                    background: linear-gradient(to top, rgba(15, 23, 42, 0.7), transparent);
                }

                .profile-content-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 25px;
                    position: relative;
                    z-index: 10;
                    padding: 0 20px;
                }

                .profile-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
                }

                .user-id-card { text-align: center; }
                .avatar-wrapper { position: relative; width: 100px; height: 100px; margin: 0 auto 15px; }
                .avatar-icon { color: var(--dark-blue); background: white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .status-badge {
                    position: absolute; bottom: 5px; right: 8px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;
                }
                .status-badge.online { background: #22c55e; }
                
                .user-id-card h2 { font-size: 1.4rem; font-weight: 800; color: var(--dark-blue); margin: 0; }
                .role-tag { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; margin-top: 5px; }
                .role-tag.student { background: #e0f2fe; color: #0284c7; }

                .id-details { text-align: left; background: #f8fafc; padding: 15px; border-radius: 12px; }
                .detail-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; }
                .detail-row:last-child { border: none; margin: 0; padding: 0; }
                .detail-row span { color: #64748b; font-weight: 500; }
                .detail-row strong { color: #334155; }

                .card-title { font-size: 1.15rem; font-weight: 700; color: var(--dark-blue); border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
                
                .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .contact-item { display: flex; align-items: flex-start; gap: 12px; }
                .contact-icon { color: #94a3b8; margin-top: 3px; }
                .contact-item small { display: block; color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
                .contact-item p { margin: 2px 0 0 0; color: #0f172a; font-size: 0.95rem; font-weight: 500; }
                .status-good { color: #16a34a !important; font-weight: 700 !important; }

                .activity-timeline { padding-left: 10px; border-left: 2px solid #e2e8f0; }
                .timeline-item { display: flex; gap: 15px; margin-bottom: 20px; position: relative; }
                .timeline-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; left: -27px; top: -5px; border: 4px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .bg-blue { background: #3b82f6; } .bg-green { background: #10b981; }
                .timeline-content h4 { margin: 0; font-size: 0.95rem; color: #1e293b; }
                .timeline-content p { margin: 4px 0; font-size: 0.85rem; color: #64748b; }
                .timeline-content .time { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: #94a3b8; font-weight: 600; }

                .btn-primary { width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; background: var(--dark-blue); color: white; border: none; cursor: pointer; transition: 0.2s; }
                .btn-primary:hover:not(:disabled) { background: var(--accent-blue); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
                .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
                .btn-secondary { width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer; transition: 0.2s; }
                .btn-secondary:hover:not(:disabled) { background: #cbd5e1; }
                .btn-secondary:disabled { opacity: 0.7; cursor: not-allowed; }
                .form-control-inline { width: 80%; padding: 8px 12px; margin: 0 auto 10px; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center; font-size: 1.2rem; font-weight: 700; color: var(--dark-blue); outline: none; display: block;}
                .form-control-inline:focus { border-color: var(--dark-blue); box-shadow: 0 0 0 2px rgba(37,99,235,0.2); }
                .form-control-inline-sm { width: 140px; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; color: var(--dark-blue); outline: none; }
                .form-control-inline-sm:focus { border-color: var(--dark-blue); box-shadow: 0 0 0 2px rgba(37,99,235,0.2); }
                .mt-4 { margin-top: 20px; }
                .w-100 { width: 100%; }
            `}</style>
        </div>
    );
}
