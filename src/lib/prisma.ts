import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Membuat pool koneksi PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Membuat adapter
const adapter = new PrismaPg(pool);

// Declare a global variable to hold the Prisma Client instance
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate the Prisma Client.
// In development, use the global variable to avoid creating new instances on every hot reload.
// In production, always create a new instance.
export const prisma = global.prisma || new PrismaClient({
  adapter,
  log: ['error'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;