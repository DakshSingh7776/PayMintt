import { NextResponse } from 'next/server';
import { MOCK_SETTLEMENTS } from '@/lib/mock-data';

export async function GET() {
  // In a real application, you would fetch this data from a database
  // or other service.
  return NextResponse.json(MOCK_SETTLEMENTS);
}
