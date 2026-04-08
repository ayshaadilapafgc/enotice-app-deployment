import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export default async function DashboardLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let user = { fullName: "Guest User", role: "STUDENT" };
    
    if (token) {
        try {
            // Decode claims. Note: in a true secure environment, you'd want to also verify the signature,
            // but middleware already verified the signature for route protection. 
            // We just need the payload here for UI rendering.
            user = decodeJwt(token); 
        } catch (e) {
            console.error("Failed decoding token in layout", e);
        }
    }

    return (
        <div className="dashboard-app-layout">
            <Sidebar userRole={user.role} />
            <div className="dashboard-main-content">
                <TopNav userName={user.fullName} userRole={user.role} />
                <div className="dashboard-scroll-area">
                    {children}
                </div>
            </div>
        </div>
    );
}
