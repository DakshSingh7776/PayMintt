import { NextResponse } from 'next/server';
import { settleDueInvoices } from '@/lib/settlement';

// This endpoint is intended to be called by a cron job or scheduled task.
export async function POST() {
  try {
    const settledInvoices = await settleDueInvoices();
    return NextResponse.json({ 
      message: 'Settlement process completed successfully.',
      settledCount: settledInvoices.length,
      settledInvoices: settledInvoices.map(i => i.invoiceNumber),
    });
  } catch (error) {
    console.error('Error during automated settlement:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
