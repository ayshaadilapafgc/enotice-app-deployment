"use client";

import Link from 'next/link';
import { LayoutDashboard, FileText, GraduationCap, Briefcase, BarChart3, Wrench, Settings, User, Users, Database, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ userRole }) {
    const pathname = usePathname();

    const studentNav = [
        { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Notices', icon: FileText, href: '/dashboard/notices' },
        { label: 'Academic Hub', icon: GraduationCap, href: '/dashboard/academic' },
        { label: 'Placements', icon: Briefcase, href: '/dashboard/placements' },
        { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    ];

    const teacherNav = [
        { label: 'Teacher Overview', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'My Students', icon: Users, href: '/dashboard/teacher/students' },
        { label: 'Class Materials', icon: FileText, href: '/dashboard/teacher/materials' },
        { label: 'Institution Notices', icon: FileText, href: '/dashboard/notices' },
    ];

    const adminNav = [
        { label: 'Platform Overview', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Manage Placements', icon: Briefcase, href: '/dashboard/admin/placements' },
        { label: 'Manage Notices', icon: FileText, href: '/dashboard/admin/notices' },
        { label: 'Password Requests', icon: Lock, href: '/dashboard/admin/password-requests' },
    ];

    let activeNav = studentNav;
    if (userRole === 'TEACHER') activeNav = teacherNav;
    if (userRole === 'ADMIN') activeNav = adminNav;

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">eN</div>
                <div className="logo-text">
                    <h2>eNotice</h2>
                    <p>PUBLIC NOTICES ONLINE</p>
                </div>
            </div>

            <nav className="sidebar-nav primary-nav">
                {activeNav.map((item) => (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        <item.icon size={20} className="nav-icon" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-divider"></div>

            <nav className="sidebar-nav secondary-nav">
                {userRole === 'ADMIN' && (
                    <div className="admin-section">
                        <div className="section-title">
                            <Wrench size={18} />
                            <div>
                                <span>System Admin</span>
                                <small>Limited to admin role</small>
                            </div>
                        </div>
                        <div className="sub-nav">
                            <Link href="/dashboard/admin/users" className="nav-item sub-item">
                                <Users size={16} className="nav-icon" /> User Management
                            </Link>
                            <Link href="/dashboard/admin/password-requests" className="nav-item sub-item">
                                <Lock size={16} className="nav-icon" /> Password Resets
                            </Link>
                            <Link href="/dashboard/admin/database" className="nav-item sub-item">
                                <Database size={16} className="nav-icon" /> Database Maintenance
                            </Link>
                        </div>
                    </div>
                )}

                <Link href="/dashboard/settings" className="nav-item">
                    <Settings size={20} className="nav-icon" />
                    <span>Settings</span>
                </Link>
                <Link href="/dashboard/profile" className="nav-item">
                    <User size={20} className="nav-icon" />
                    <span>Profile</span>
                </Link>
            </nav>
        </aside>
    );
}
