import { NextResponse } from 'next/server';
import { MOCK_MY_INVESTMENTS } from '@/lib/mock-data';

export async function GET() {
  // In a real application, you would fetch this data from a database
  // filtering by the currently authenticated user's ID.
  return NextResponse.json(MOCK_MY_INVESTMENTS);
}
