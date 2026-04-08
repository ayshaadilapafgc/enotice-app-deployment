import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

// Fetch all notices
export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { fullName: true, role: true } } }
        });
        return NextResponse.json({ notices });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
    }
}

// Create a notice
export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { title, content } = await req.json();

        const notice = await prisma.notice.create({
            data: { title, content, authorId: decoded.id }
        });

        return NextResponse.json({ message: 'Notice published', notice });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
    }
}

// Delete a notice
export async function DELETE(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await prisma.notice.delete({ where: { id } });
        return NextResponse.json({ message: 'Notice deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
