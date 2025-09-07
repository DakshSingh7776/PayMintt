
'use server';
/**
 * @fileOverview An AI flow to generate a monthly usage report.
 *
 * - generateMonthlyUsageReport - A function that handles the report generation.
 * - GenerateMonthlyUsageReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateMonthlyUsageReportOutputSchema = z.object({
  htmlContent: z.string().describe('The generated HTML content of the usage report.'),
});
export type GenerateMonthlyUsageReportOutput = z.infer<typeof GenerateMonthlyUsageReportOutputSchema>;


// Mock data to simulate fetching from a database
const mockUsageData = {
  period: "July 2024",
  totalActiveUsers: 125,
  newRegistrations: 25,
  totalTransactions: 450,
  totalVolume: 720000,
  peakDay: "2024-07-15",
  peakTransactions: 45,
  userBreakdown: {
    businesses: 75,
    lenders: 50,
  }
};


export async function generateMonthlyUsageReport(): Promise<GenerateMonthlyUsageReportOutput> {
  return generateMonthlyUsageReportFlow(mockUsageData);
}

const prompt = ai.definePrompt({
  name: 'generateMonthlyUsageReportPrompt',
  input: { schema: z.any() },
  output: { schema: GenerateMonthlyUsageReportOutputSchema },
  prompt: `
You are an expert data analyst for PayMint, a decentralized invoice factoring platform.
Your task is to generate a professional and clean HTML monthly usage report.

The report should be a single, self-contained HTML file. Use inline CSS for styling. Do not include any Javascript.
The design should be modern, easy to read, and suitable for management review. Use a professional font like Inter.
The layout should be well-organized with a clear title, summary statistics, key insights, and recommendations.

Here is the data for the report:
- Report Period: {{{period}}}
- Total Active Users: {{{totalActiveUsers}}}
- New Registrations: {{{newRegistrations}}}
- Total Transactions: {{{totalTransactions}}}
- Total Factoring Volume: {{{totalVolume}}}
- Busiest Day: {{{peakDay}}} (with {{{peakTransactions}}} transactions)
- User Breakdown: {{{userBreakdown.businesses}}} Businesses, {{{userBreakdown.lenders}}} Lenders

Based on the data above, generate a comprehensive HTML report. It should include:
1.  A clear header with "PayMint Monthly Usage Report" and the reporting period.
2.  A summary section with the main usage metrics.
3.  A "Key Insights" section. In this section, provide a bulleted list of 3-4 key observations from the data. For example, "New user registration shows steady growth, indicating successful marketing campaigns." or "Transaction volume peaked mid-month, coinciding with the launch of the new UI."
4.  A "Recommendations" section. Based on the insights, provide a bulleted list of 2-3 actionable recommendations. For example, "Double down on marketing channels that led to the spike in new registrations." or "Prepare server capacity for expected mid-month peaks in the future."
5.  A simple section showing the breakdown of users by role (Businesses vs. Lenders).
6.  Ensure the tone is analytical and insightful.
7.  Use a color scheme with a primary color of #87CEEB (Sky Blue) for headers and accents.

Generate the HTML content now.
`,
});

const generateMonthlyUsageReportFlow = ai.defineFlow(
  {
    name: 'generateMonthlyUsageReportFlow',
    inputSchema: z.any(),
    outputSchema: GenerateMonthlyUsageReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
