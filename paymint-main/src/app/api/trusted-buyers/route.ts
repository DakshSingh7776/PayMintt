import { NextResponse } from 'next/server';
import { MOCK_TRUSTED_BUYERS } from '@/lib/mock-data';

export async function GET() {
  // In a real application, you would calculate this data from your database,
  // likely from a transactions table, and cache it periodically.
  return NextResponse.json(MOCK_TRUSTED_BUYERS);
}
