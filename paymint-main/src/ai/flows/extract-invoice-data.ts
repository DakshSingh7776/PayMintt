'use server';
/**
 * @fileOverview An AI flow to extract structured data from an invoice document.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction process.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function.
 * - ExtractedInvoiceData - The return type for the extractInvoiceData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractInvoiceDataInputSchema = z.object({
  invoiceDocumentUri: z
    .string()
    .describe(
      "The invoice document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInvoiceDataInput = z.infer<typeof ExtractInvoiceDataInputSchema>;

const ExtractedInvoiceDataSchema = z.object({
  issuerName: z.string().describe('The name of the company or person issuing the invoice.'),
  debtorName: z.string().describe('The name of the company or person who owes the money.'),
  invoiceNumber: z.string().describe('The unique identifier for the invoice.'),
  amount: z.number().describe('The total amount of the invoice.'),
  dueDate: z.string().describe('The date when the invoice is due, in YYYY-MM-DD format.'),
});
export type ExtractedInvoiceData = z.infer<typeof ExtractedInvoiceDataSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractedInvoiceData> {
  return extractInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: { schema: ExtractInvoiceDataInputSchema },
  output: { schema: ExtractedInvoiceDataSchema },
  prompt: `You are an expert at extracting structured data from documents.
Extract the following information from the provided invoice document.

Document: {{media url=invoiceDocumentUri}}`,
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: ExtractedInvoiceDataSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
