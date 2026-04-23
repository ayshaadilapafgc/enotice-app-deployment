import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
    try {
        const requests = await prisma.passwordResetRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Fetch Reset Requests Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedRequest = await prisma.passwordResetRequest.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Update Reset Request Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
