/**
 * @fileOverview Core logic for handling invoice settlements.
 */
import { MOCK_INVOICES } from './mock-data';
import type { Invoice } from './types';
import { differenceInDays, differenceInWeeks } from 'date-fns';


const INITIAL_PENALTY_RATE = 0.001; // 0.1%
const WEEKLY_PENALTY_INCREASE = 0.001; // 0.1% increase per week
const MAX_PENALTY_RATE = 0.005; // 0.5%

/**
 * This function simulates the process of settling due invoices.
 * In a real application, this would involve:
 * 1. Fetching 'funded' or 'overdue' invoices from a database.
 * 2. Checking their due dates against the current date.
 * 3. For each due invoice, calling a smart contract to trigger the settlement.
 * 4. For overdue invoices, applying a progressive penalty.
 * 5. Updating the invoice status in the database to 'repaid' or 'overdue'.
 * 6. Emitting events or notifications.
 */
export async function settleDueInvoices(): Promise<Invoice[]> {
  console.log('Starting automated settlement process...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // In a real app, this would be a DB query for `status: 'funded'` or `status: 'overdue'`.
  const processableInvoices = MOCK_INVOICES.filter(invoice => {
    return invoice.status === 'funded' || invoice.status === 'overdue';
  });

  if (processableInvoices.length === 0) {
    console.log('No funded or overdue invoices to process today.');
    return [];
  }

  console.log(`Found ${processableInvoices.length} invoices to process.`);

  const settledOrPenalizedInvoices: Invoice[] = [];

  for (const invoice of processableInvoices) {
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) { // Invoice is overdue
       try {
        const invoiceInDb = MOCK_INVOICES.find(i => i.id === invoice.id);
        if (invoiceInDb) {
            invoiceInDb.status = 'overdue';

            const weeksOverdue = differenceInWeeks(today, dueDate);
            
            let penaltyRate = INITIAL_PENALTY_RATE + (weeksOverdue * WEEKLY_PENALTY_INCREASE);
            penaltyRate = Math.min(penaltyRate, MAX_PENALTY_RATE); // Cap the penalty rate

            invoiceInDb.penalty = invoice.amount * penaltyRate;
            
            console.log(`Invoice ${invoice.invoiceNumber} is overdue by ${differenceInDays(today, dueDate)} days (${weeksOverdue} weeks). Applying penalty rate of ${(penaltyRate * 100).toFixed(2)}%. Penalty: ${invoiceInDb.penalty.toFixed(2)}.`);
            
            settledOrPenalizedInvoices.push(invoiceInDb);
        }
       } catch (error) {
         console.error(`Failed to apply penalty to invoice ${invoice.invoiceNumber}:`, error);
       }
    }
  }
  
  console.log('Automated settlement process finished.');
  return settledOrPenalizedInvoices;
}
