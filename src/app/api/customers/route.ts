import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define the schema for the customer data using Zod
const customerSchema = z.object({
  nama: z.string().min(1, 'Nama is required'),
  alamat: z.string().optional(),
  kontak: z.string().optional(),
  jenis_instansi: z.enum(['Perorangan', 'Perusahaan']),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = customerSchema.parse(json);

    const customer = await prisma.customer.create({
      data: data,
    });

    return NextResponse.json({
      status: 'success',
      customer,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid request data',
        errors: error.flatten().fieldErrors,
      }, { status: 400 });
    }
    console.error('Failed to create customer:', error);
    return NextResponse.json({
        status: 'error',
        message: 'Failed to create customer',
    }, { status: 500 });
  }
}
