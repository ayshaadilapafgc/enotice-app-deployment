import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        let decoded;
        try { 
            decoded = decodeJwt(token); 
        } catch(e) { 
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); 
        }

        const { fullName, phone, location, enrollmentYear, currentSemester } = await req.json();

        if (!fullName) {
            return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: { fullName, phone, location, enrollmentYear, currentSemester }
        });

        return NextResponse.json({ message: 'Profile updated successfully', user: { id: updatedUser.id, fullName: updatedUser.fullName, regNo: updatedUser.regNo, role: updatedUser.role, phone: updatedUser.phone, location: updatedUser.location, enrollmentYear: updatedUser.enrollmentYear, currentSemester: updatedUser.currentSemester } });
    } catch (error) {
        console.error('Failed to update profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
