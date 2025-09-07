
'use server';
/**
 * @fileOverview An AI flow to generate a financial performance report.
 *
 * - generateFinancialPerformanceReport - A function that handles the report generation.
 * - GenerateFinancialPerformanceReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateFinancialPerformanceReportOutputSchema = z.object({
  htmlContent: z.string().describe('The generated HTML content of the financial report.'),
});
export type GenerateFinancialPerformanceReportOutput = z.infer<typeof GenerateFinancialPerformanceReportOutputSchema>;

// Mock data to simulate fetching from a database
const mockFinancialData = {
  period: "July 2024",
  totalRevenue: 52300,
  totalYieldDistributed: 35700,
  netFeesCollected: 16600,
  totalExpenses: 8500,
  netProfit: 8100,
  kpis: [
    { metric: "Average Fee per Invoice", value: "4.1%", trend: "+0.2%" },
    { metric: "Average Lender APY", value: "9.8%", trend: "+0.5%" },
    { metric: "Platform ROI", value: "95.3%", trend: "+12%" },
    { metric: "Default Rate", value: "0.8%", trend: "-0.1%" },
  ],
  revenueBreakdown: [
    { source: "Invoice Factoring Fees", amount: 15800, percentage: 95.2 },
    { source: "Late Payment Penalties", amount: 800, percentage: 4.8 },
  ],
  expenseBreakdown: [
      { category: "Cloud Infrastructure", amount: 3500, percentage: 41.2 },
      { category: "Third-party APIs (KYC, etc.)", amount: 2000, percentage: 23.5 },
      { category: "Marketing & Sales", amount: 1500, percentage: 17.6 },
      { category: "Operational Staff", amount: 1500, percentage: 17.6 },
  ]
};

export async function generateFinancialPerformanceReport(): Promise<GenerateFinancialPerformanceReportOutput> {
  return generateFinancialPerformanceReportFlow(mockFinancialData);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialPerformanceReportPrompt',
  input: { schema: z.any() },
  output: { schema: GenerateFinancialPerformanceReportOutputSchema },
  prompt: `
You are an expert financial analyst for PayMint, a decentralized invoice factoring platform.
Your task is to generate a professional and clean HTML financial performance report.

The report should be a single, self-contained HTML file. Use inline CSS for styling. Do not include any Javascript.
The design should be modern, easy to read, and suitable for executive review. Use a professional font like Inter.
The layout should be well-organized with a clear title, summary, key performance indicators (KPIs), detailed tables, and a concluding narrative.

Here is the data for the report:
- Report Period: {{{period}}}
- Total Revenue: {{{totalRevenue}}}
- Total Yield Distributed to Lenders: {{{totalYieldDistributed}}}
- Net Fees Collected: {{{netFeesCollected}}}
- Total Expenses: {{{totalExpenses}}}
- Net Profit: {{{netProfit}}}

- Key Performance Indicators (KPIs):
{{#each kpis}}
  - Metric: {{this.metric}}, Value: {{this.value}}, Trend: {{this.trend}}
{{/each}}

- Revenue Breakdown:
{{#each revenueBreakdown}}
  - Source: {{this.source}}, Amount: {{this.amount}}, Percentage: {{this.percentage}}%
{{/each}}

- Expense Breakdown:
{{#each expenseBreakdown}}
  - Category: {{this.category}}, Amount: {{this.amount}}, Percentage: {{this.percentage}}%
{{/each}}

Based on the data above, generate a comprehensive HTML report. It should include:
1.  A clear header with "PayMint Financial Performance Report" and the reporting period.
2.  A summary section with the main financial figures (Revenue, Expenses, Profit).
3.  A section for Key Performance Indicators, presented clearly.
4.  Detailed tables for the Revenue Breakdown and Expense Breakdown. Use clean, modern table styling.
5.  A concluding "Analyst's Commentary" section. In this section, provide a brief narrative (2-3 paragraphs) summarizing the financial health of the platform, highlighting key drivers of performance (e.g., strong fee collection), and mentioning any areas for attention (e.g., rising infrastructure costs).
6.  Ensure all currency values are formatted with dollar signs and commas (e.g., $52,300).
7.  The overall tone should be professional, objective, and data-driven.
8. Use a color scheme with a primary color of #87CEEB (Sky Blue) for headers and accents.

Generate the HTML content now.
`,
});

const generateFinancialPerformanceReportFlow = ai.defineFlow(
  {
    name: 'generateFinancialPerformanceReportFlow',
    inputSchema: z.any(),
    outputSchema: GenerateFinancialPerformanceReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
