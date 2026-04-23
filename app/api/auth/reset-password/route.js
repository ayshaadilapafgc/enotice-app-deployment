import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { regNo, newPassword } = await req.json();

        if (!regNo || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify if there is an approved request
        const approvedRequest = await prisma.passwordResetRequest.findFirst({
            where: {
                regNo,
                status: 'APPROVED'
            }
        });

        if (!approvedRequest) {
            return NextResponse.json({ 
                error: 'No approved password reset request found for this ID. Please submit a request first.' 
            }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { regNo }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and mark request as completed in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { regNo },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetRequest.update({
                where: { id: approvedRequest.id },
                data: { status: 'COMPLETED' }
            })
        ]);

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

