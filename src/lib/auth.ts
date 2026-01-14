import { createHash } from 'crypto';
import { prisma } from './prisma';

// Fungsi untuk meng-hash password
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Fungsi untuk mengecek apakah sudah ada admin di database
export async function hasAdminAccount(): Promise<boolean> {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'Admin' }
    });

    return adminCount > 0;
  } catch (error) {
    console.error('Error checking admin account:', error);
    return false;
  }
}

// Fungsi untuk login menggunakan credentials lokal
export async function signInWithCredentials(email: string, password: string) {
  try {
    // Hash password untuk dibandingkan
    const hashedPassword = hashPassword(password);

    // Cari pengguna di database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password_hash: hashedPassword,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Kembalikan data pengguna
    return {
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Fungsi untuk membuat akun admin pertama kali
export async function createAdminAccount(nama_lengkap: string, email: string, password: string) {
  try {
    // Cek apakah sudah ada admin
    if (await hasAdminAccount()) {
      throw new Error('Admin account already exists');
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

    return {
      user: {
        id: newUser.id,
        nama_lengkap: newUser.nama_lengkap,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw error;
  }
}