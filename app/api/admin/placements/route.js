import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function GET() {
    try {
        const placements = await prisma.placementDrive.findMany({
            orderBy: { date: 'asc' }
        });
        return NextResponse.json({ placements });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        let decoded;
        try { decoded = decodeJwt(token); } catch(e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { company, description, eligibility, date, link } = await req.json();

        const drive = await prisma.placementDrive.create({
            data: {
                company,
                description,
                eligibility,
                date: new Date(date),
                link,
                adminId: decoded.id
            }
        });

        return NextResponse.json({ message: 'Drive uploaded', drive });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload drive' }, { status: 500 });
    }
}

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

        await prisma.placementDrive.delete({ where: { id } });
        return NextResponse.json({ message: 'Drive deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
