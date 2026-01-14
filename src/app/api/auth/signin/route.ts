import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hash password untuk dibandingkan
    const hashedPassword = createHash('sha256').update(password).digest('hex');

    // Cari pengguna di database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password_hash: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Jika pengguna ditemukan, kembalikan data pengguna
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}