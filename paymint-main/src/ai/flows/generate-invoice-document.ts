
'use server';
/**
 * @fileOverview An AI flow to generate a professional HTML invoice document.
 *
 * - generateInvoiceDocument - A function that handles the invoice document generation.
 * - GenerateInvoiceDocumentInput - The input type for the function.
 * - GenerateInvoiceDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LineItemSchema = z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
});

const GenerateInvoiceDocumentInputSchema = z.object({
  issuerName: z.string().describe('The name of the company or person issuing the invoice.'),
  issuerAddress: z.string().describe('The address of the issuer.'),
  debtorName: z.string().describe('The name of the company or person who owes the money.'),
  debtorAddress: z.string().describe('The address of the debtor.'),
  invoiceNumber: z.string().describe('The unique identifier for the invoice.'),
  issueDate: z.string().describe('The date the invoice was issued, in YYYY-MM-DD format.'),
  dueDate: z.string().describe('The date when the invoice is due, in YYYY-MM-DD format.'),
  lineItems: z.array(LineItemSchema).describe('An array of line items for the invoice.'),
  subtotal: z.number().describe('The subtotal of all line items.'),
  tax: z.number().describe('The tax amount.'),
  total: z.number().describe('The total amount of the invoice.'),
});

export type GenerateInvoiceDocumentInput = z.infer<typeof GenerateInvoiceDocumentInputSchema>;

const GenerateInvoiceDocumentOutputSchema = z.object({
  htmlContent: z.string().describe('The generated HTML content of the invoice document.'),
});

export type GenerateInvoiceDocumentOutput = z.infer<typeof GenerateInvoiceDocumentOutputSchema>;


export async function generateInvoiceDocument(input: GenerateInvoiceDocumentInput): Promise<GenerateInvoiceDocumentOutput> {
  return generateInvoiceDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceDocumentPrompt',
  input: { schema: GenerateInvoiceDocumentInputSchema },
  output: { schema: GenerateInvoiceDocumentOutputSchema },
  prompt: `You are an expert invoice designer. Your task is to generate a professional and clean HTML document for an invoice based on the provided data.

The HTML should be a single, self-contained file. Use inline CSS for styling. Do not include any Javascript.

The design should be modern and easy to read. Use a clear and professional font. The layout should be well-organized, with clear sections for the issuer, debtor, invoice details, line items, and totals.

Also, include a subtle 'PayMint' watermark diagonally across the page. This can be achieved with a ::before or ::after pseudo-element on the body or a fixed-position div with low opacity.

Here is the data for the invoice:
- Issuer Name: {{{issuerName}}}
- Issuer Address: {{{issuerAddress}}}
- Debtor Name: {{{debtorName}}}
- Debtor Address: {{{debtorAddress}}}
- Invoice Number: {{{invoiceNumber}}}
- Issue Date: {{{issueDate}}}
- Due Date: {{{dueDate}}}
- Line Items:
{{#each lineItems}}
  - Description: {{this.description}}, Quantity: {{this.quantity}}, Unit Price: {{this.unitPrice}}, Total: {{this.total}}
{{/each}}
- Subtotal: {{{subtotal}}}
- Tax: {{{tax}}}
- Total: {{{total}}}

Generate the HTML content now.
`,
});

const generateInvoiceDocumentFlow = ai.defineFlow(
  {
    name: 'generateInvoiceDocumentFlow',
    inputSchema: GenerateInvoiceDocumentInputSchema,
    outputSchema: GenerateInvoiceDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
