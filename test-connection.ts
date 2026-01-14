import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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