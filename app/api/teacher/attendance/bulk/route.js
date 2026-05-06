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

        const { attendanceData } = await req.json(); // Array of { studentId, attendedClasses, totalClasses }

        if (!Array.isArray(attendanceData)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        const subject = teacher.subjectTaught || 'General';

        // Use transaction for bulk update
        const results = await prisma.$transaction(
            attendanceData.map((item) => 
                prisma.attendanceSummary.upsert({
                    where: {
                        studentId_teacherId: {
                            studentId: item.studentId,
                            teacherId: teacher.id
                        }
                    },
                    update: {
                        attendedClasses: parseInt(item.attendedClasses, 10),
                        totalClasses: parseInt(item.totalClasses, 10),
                    },
                    create: {
                        studentId: item.studentId,
                        teacherId: teacher.id,
                        subject: subject,
                        attendedClasses: parseInt(item.attendedClasses, 10),
                        totalClasses: parseInt(item.totalClasses, 10),
                    }
                })
            )
        );

        return NextResponse.json({ message: 'Bulk attendance recorded', count: results.length });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error updating bulk attendance' }, { status: 500 });
    }
}
