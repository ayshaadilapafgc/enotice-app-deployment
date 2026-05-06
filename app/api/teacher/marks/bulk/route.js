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

        const { marksData } = await req.json(); // Array of { studentId, score, maxScore }

        if (!Array.isArray(marksData)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        const subject = teacher.subjectTaught || 'General';

        // Bulk create marks
        const results = await prisma.mark.createMany({
            data: marksData.map((item) => ({
                studentId: item.studentId,
                teacherId: teacher.id,
                subject: subject,
                score: parseInt(item.score, 10),
                maxScore: parseInt(item.maxScore, 10)
            }))
        });

        return NextResponse.json({ message: 'Bulk marks recorded', count: results.count });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error updating bulk marks' }, { status: 500 });
    }
}
