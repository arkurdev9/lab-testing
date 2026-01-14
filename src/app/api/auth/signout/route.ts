import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Hapus cookie current_user
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.delete('current_user');

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}