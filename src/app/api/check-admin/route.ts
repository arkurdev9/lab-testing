import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'Admin' }
    });

    const hasAdmin = adminCount > 0;

    return NextResponse.json({
      hasAdmin,
    });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}