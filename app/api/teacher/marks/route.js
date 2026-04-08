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
        
        if (decoded.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { studentId, score, maxScore } = await req.json();

        if (!studentId || score === undefined || !maxScore) {
            return NextResponse.json({ error: 'Missing required grading fields' }, { status: 400 });
        }

        // Fetch teacher's subject safely
        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        const subject = teacher?.subjectTaught || 'Unknown Subject';

        // Create the mark
        const mark = await prisma.mark.create({
            data: {
                studentId,
                teacherId: teacher.id,
                subject,
                score: parseInt(score, 10),
                maxScore: parseInt(maxScore, 10)
            }
        });

        return NextResponse.json({ message: 'Mark recorded successfully!', mark });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong saving the grade' }, { status: 500 });
    }
}
