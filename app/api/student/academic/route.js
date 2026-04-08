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
        
        if (decoded.role !== 'STUDENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const studentId = decoded.id;

        // 1. Fetch Marks
        const marks = await prisma.mark.findMany({
            where: { studentId },
            include: { teacher: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Fetch Attendance
        const attendance = await prisma.attendanceSummary.findMany({
            where: { studentId },
            include: { teacher: { select: { fullName: true } } }
        });

        // 3. Fetch Materials (All materials posted by all teachers the student has... wait, or all materials globally, or match subjects).
        // For simplicity: any material loaded by a teacher who has graded/given attendance to this student.
        // Actually, we can fetch all materials globally, or match the distinct subjects the student has grades in.
        // Easiest is to send all question papers, categorized by subject.
        const materials = await prisma.questionPaper.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ marks, attendance, materials });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch academic data' }, { status: 500 });
    }
}
