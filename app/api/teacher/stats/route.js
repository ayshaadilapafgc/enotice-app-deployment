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

        const studentCount = await prisma.user.count({
            where: { role: 'STUDENT', isVerified: true }
        });

        const marksCount = await prisma.mark.count({
            where: { teacherId: decoded.id }
        });

        const materialsCount = await prisma.questionPaper.count({
            where: { teacherId: decoded.id }
        });

        return NextResponse.json({ 
            stats: {
                students: studentCount,
                marksUploaded: marksCount,
                materialsUploaded: materialsCount
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
