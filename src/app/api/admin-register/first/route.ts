import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

// Fungsi untuk meng-hash password
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    // Periksa apakah sudah ada admin di database
    const adminExists = await prisma.user.count({
      where: { role: 'Admin' }
    });

    if (adminExists > 0) {
      return NextResponse.json(
        { message: 'Admin account already exists' },
        { status: 400 }
      );
    }

    const { nama_lengkap, email, password } = await request.json();

    if (!nama_lengkap || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = hashPassword(password);

    // Buat pengguna baru di tabel User
    const newUser = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password_hash,
        role: 'Admin',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: newUser.id,
        nama_lengkap: newUser.nama_lengkap,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Failed to create admin account:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}