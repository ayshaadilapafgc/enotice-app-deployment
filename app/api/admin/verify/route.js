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
        
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { userId, action } = await req.json(); // action = 'VERIFY' | 'REJECT' | 'REVOKE'

        if (action === 'VERIFY') {
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: true }
            });
            return NextResponse.json({ message: 'User verified successfully' });
        } else if (action === 'REJECT' || action === 'REVOKE') {
            await prisma.user.delete({
                where: { id: userId }
            });
            return NextResponse.json({ message: 'User deleted securely.' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong in auth system' }, { status: 500 });
    }
}
