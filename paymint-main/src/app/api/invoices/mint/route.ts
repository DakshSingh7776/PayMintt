import { NextResponse } from 'next/server';
import { MOCK_INVOICES } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';

// This is a mock endpoint to simulate minting an invoice NFT.
// In a real application, this would:
// 1. Validate the input data.
// 2. Interact with a smart contract on a blockchain (e.g., Stacks) to mint the NFT.
// 3. Store the new invoice in a database with the 'pending' status.
// 4. Return the newly created invoice object.

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.issuerName || !body.debtorName || !body.amount || !body.dueDate || !body.invoiceNumber) {
      return new NextResponse('Missing required invoice fields', { status: 400 });
    }

    console.log('Simulating NFT minting for invoice:', body.invoiceNumber);

    // Create a new invoice object
    const newInvoice: Invoice = {
      id: `mock-${Date.now()}`, // Generate a unique ID
      invoiceNumber: body.invoiceNumber,
      issuer: { name: body.issuerName },
      debtor: { name: body.debtorName },
      amount: Number(body.amount),
      // Set a mock ask amount, e.g., 95% of the invoice amount
      askAmount: Number(body.amount) * 0.95, 
      dueDate: body.dueDate,
      // Assign a random risk score for simulation purposes
      riskScore: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
      status: 'pending',
    };
    
    // Simulate smart contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add the new invoice to our mock data array (in a real app, this would be a DB write)
    MOCK_INVOICES.unshift(newInvoice);
    
    console.log(`Invoice ${newInvoice.invoiceNumber} successfully minted and added to marketplace.`);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error minting invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
