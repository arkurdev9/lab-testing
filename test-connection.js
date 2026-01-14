require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Membuat pool koneksi PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Membuat adapter
const adapter = new PrismaPg(pool);

// Membuat PrismaClient dengan adapter
const prisma = new PrismaClient({ adapter });

async function testConnection() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Perform a simple query
    const userCount = await prisma.user.count();
    console.log(`Number of users in the database: ${userCount}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();