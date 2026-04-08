import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        if (decoded.role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { studentId, attendedClasses, totalClasses } = await req.json();

        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        // Use 'upsert' to create if not exists, or update if exists
        const attendance = await prisma.attendanceSummary.upsert({
            where: {
                studentId_teacherId: {
                    studentId,
                    teacherId: teacher.id
                }
            },
            update: {
                attendedClasses: parseInt(attendedClasses, 10),
                totalClasses: parseInt(totalClasses, 10),
            },
            create: {
                studentId,
                teacherId: teacher.id,
                subject: teacher.subjectTaught || 'General',
                attendedClasses: parseInt(attendedClasses, 10),
                totalClasses: parseInt(totalClasses, 10),
            }
        });

        return NextResponse.json({ message: 'Attendance recorded', attendance });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error updating attendance' }, { status: 500 });
    }
}
