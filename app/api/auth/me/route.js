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
        try { 
            decoded = decodeJwt(token); 
        } catch(e) { 
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); 
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, fullName: true, regNo: true, role: true, isVerified: true, subjectTaught: true, phone: true, location: true, enrollmentYear: true, currentSemester: true }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}
