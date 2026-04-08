"use client";

import { Search, Bell, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopNav({ userName, userRole }) {
    const router = useRouter();

    const handleLogout = async () => {
        // Simple client-side logout to drop cookies (In prod, call an API)
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/login');
    };

    return (
        <header className="top-nav">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search Public Notices..." />
            </div>

            <div className="user-profile-widget">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>
                <div className="profile-details">
                    <UserCircle size={28} className="profile-avatar" />
                    <div className="profile-info">
                        <span className="profile-name">{userName}</span>
                        <span className="profile-role">{userRole}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">Log out</button>
            </div>
        </header>
    );
}
