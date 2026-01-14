import { NextResponse } from 'next/server';
import { hasAdminAccount } from '@/lib/auth';

export async function GET() {
  try {
    const hasAdmin = await hasAdminAccount();

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