import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Fetch Both Pending and Verified Users
        const pendingUsers = await prisma.user.findMany({
            where: { isVerified: false, role: { not: 'ADMIN' } },
            select: { id: true, fullName: true, regNo: true, role: true, subjectTaught: true, createdAt: true }
        });

        const verifiedUsers = await prisma.user.findMany({
            where: { isVerified: true, role: { not: 'ADMIN' } },
            select: { id: true, fullName: true, regNo: true, role: true, subjectTaught: true, createdAt: true }
        });

        return NextResponse.json({ pending: pendingUsers, verified: verifiedUsers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
