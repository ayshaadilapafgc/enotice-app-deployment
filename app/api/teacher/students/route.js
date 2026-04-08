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
        
        if (decoded.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all verified students
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT', isVerified: true },
            select: { id: true, fullName: true, regNo: true }
        });

        // Get this teacher's subject specialization
        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { subjectTaught: true }
        });

        return NextResponse.json({ students, subjectTaught: teacher?.subjectTaught || 'General' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
