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
        if (decoded.role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const url = new URL(req.url);
        const studentId = url.searchParams.get('studentId');

        if (!studentId) return NextResponse.json({ error: 'Missing student Id' }, { status: 400 });

        const teacher = await prisma.user.findUnique({ where: { id: decoded.id } });

        const marks = await prisma.mark.findMany({
            where: { studentId, teacherId: teacher.id },
            orderBy: { createdAt: 'desc' }
        });
        
        const attendance = await prisma.attendanceSummary.findFirst({
            where: { studentId, teacherId: teacher.id }
        });

        return NextResponse.json({ marks, attendance });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error loading reports' }, { status: 500 });
    }
}
