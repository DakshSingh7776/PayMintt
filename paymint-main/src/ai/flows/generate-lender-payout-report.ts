
'use server';
/**
 * @fileOverview An AI flow to generate a lender payout report.
 *
 * - generateLenderPayoutReport - A function that handles the report generation.
 * - GenerateLenderPayoutReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLenderPayoutReportOutputSchema = z.object({
  htmlContent: z.string().describe('The generated HTML content of the lender payout report.'),
});
export type GenerateLenderPayoutReportOutput = z.infer<typeof GenerateLenderPayoutReportOutputSchema>;

// Mock data to simulate fetching from a database
const mockPayoutData = {
  period: "July 2024",
  totalPayouts: 35700,
  totalLendersPaid: 45,
  averagePayout: 793.33,
  payouts: [
    { transactionId: 'set-0720-001', lenderName: 'John Lender', amount: 1800, date: '2024-07-20', relatedInvoice: 'INV-2024-006' },
    { transactionId: 'set-0718-002', lenderName: 'Investor Jane', amount: 950, date: '2024-07-18', relatedInvoice: 'INV-2023-128' },
    { transactionId: 'set-0715-003', lenderName: 'Capital Group', amount: 420, date: '2024-07-15', relatedInvoice: 'INV-2023-121' },
    { transactionId: 'set-0712-004', lenderName: 'Momentum Capital', amount: 3200, date: '2024-07-12', relatedInvoice: 'INV-2024-A01' },
    { transactionId: 'set-0710-005', lenderName: 'John Lender', amount: 2500, date: '2024-07-10', relatedInvoice: 'INV-2024-B12' },
  ]
};

export async function generateLenderPayoutReport(): Promise<GenerateLenderPayoutReportOutput> {
  return generateLenderPayoutReportFlow(mockPayoutData);
}

const prompt = ai.definePrompt({
  name: 'generateLenderPayoutReportPrompt',
  input: { schema: z.any() },
  output: { schema: GenerateLenderPayoutReportOutputSchema },
  prompt: `
You are an expert financial analyst for PayMint, a decentralized invoice factoring platform.
Your task is to generate a professional and clean HTML lender payout report.

The report should be a single, self-contained HTML file. Use inline CSS for styling. Do not include any Javascript.
The design should be modern, easy to read, and suitable for auditing and record-keeping. Use a professional font like Inter.
The layout should be well-organized with a clear title, a summary section, and a detailed transaction table.

Here is the data for the report:
- Report Period: {{{period}}}
- Total Payouts: {{{totalPayouts}}}
- Total Lenders Paid: {{{totalLendersPaid}}}
- Average Payout: {{{averagePayout}}}

- Detailed Payouts:
{{#each payouts}}
  - Transaction ID: {{this.transactionId}}, Lender: {{this.lenderName}}, Amount: {{this.amount}}, Date: {{this.date}}, Invoice: {{this.relatedInvoice}}
{{/each}}

Based on the data above, generate a comprehensive HTML report. It should include:
1.  A clear header with "PayMint Lender Payout Report" and the reporting period.
2.  A summary section with the key figures: Total Payouts, Total Lenders Paid, and Average Payout.
3.  A detailed table listing all individual payouts. The table should have the following columns: Transaction ID, Lender Name, Payout Amount, Payout Date, Related Invoice.
4.  Use clean, modern table styling with alternating row colors for readability.
5.  Ensure all currency values are formatted with dollar signs and commas (e.g., $1,800.00).
6.  The overall tone should be professional and precise, suitable for financial records.
7. Use a color scheme with a primary color of #87CEEB (Sky Blue) for headers and accents.

Generate the HTML content now.
`,
});

const generateLenderPayoutReportFlow = ai.defineFlow(
  {
    name: 'generateLenderPayoutReportFlow',
    inputSchema: z.any(),
    outputSchema: GenerateLenderPayoutReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
