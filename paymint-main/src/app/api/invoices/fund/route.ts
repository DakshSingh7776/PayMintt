import { NextResponse } from 'next/server';
import { MOCK_INVOICES } from '@/lib/mock-data';

// This is a mock endpoint to simulate funding an invoice.
// In a real application, this would:
// 1. Validate the request (e.g., user is authenticated, has enough funds).
// 2. Interact with a smart contract to lock funds from a liquidity pool.
// 3. Update the invoice's status to 'funded' in the database.
// 4. Return a success response.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ message: 'Invoice ID is required' }, { status: 400 });
    }
    
    const invoiceToFund = MOCK_INVOICES.find(inv => inv.id === invoiceId);

    if (!invoiceToFund) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    if (invoiceToFund.status !== 'pending') {
        return NextResponse.json({ message: `Invoice is already ${invoiceToFund.status}` }, { status: 400 });
    }

    console.log(`Simulating funding for invoice: ${invoiceToFund.invoiceNumber}`);

    // Simulate smart contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the invoice status in our mock data
    invoiceToFund.status = 'funded';

    console.log(`Invoice ${invoiceToFund.invoiceNumber} successfully funded.`);

    return NextResponse.json({ message: 'Invoice funded successfully', invoice: invoiceToFund });
  } catch (error) {
    console.error('Error funding invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
