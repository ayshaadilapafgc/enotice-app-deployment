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

        const { title, url } = await req.json();

        const teacher = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        const paper = await prisma.questionPaper.create({
            data: {
                title,
                url,
                subject: teacher.subjectTaught || 'General',
                teacherId: teacher.id
            }
        });

        return NextResponse.json({ message: 'Paper uploaded', paper });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal error upload' }, { status: 500 });
    }
}

export async function GET(req) {
     try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        if (decoded.role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const papers = await prisma.questionPaper.findMany({
            where: { teacherId: decoded.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ papers });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
