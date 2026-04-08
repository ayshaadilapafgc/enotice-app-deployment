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
        
        const marks = await prisma.mark.findMany({
            where: { studentId: decoded.id },
            include: { teacher: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Also fetch total attendance if we had it, but for now we aggregate marks
        return NextResponse.json({ marks, user: decoded });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong fetching live data' }, { status: 500 });
    }
}
