
'use server';
/**
 * @fileOverview An AI flow to generate a risk and compliance summary report.
 *
 * - generateRiskComplianceReport - A function that handles the report generation.
 * - GenerateRiskComplianceReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateRiskComplianceReportOutputSchema = z.object({
  htmlContent: z.string().describe('The generated HTML content of the risk and compliance report.'),
});
export type GenerateRiskComplianceReportOutput = z.infer<typeof GenerateRiskComplianceReportOutputSchema>;

// Mock data to simulate fetching from a database
const mockRiskData = {
  period: "July 2024",
  alertsGenerated: 12,
  alerts: {
    pending: 3,
    reviewed: 8,
    escalated: 1,
  },
  overdueInvoices: 4,
  averageRiskScore: 78,
  kycStatus: {
    verified: 110,
    pending: 12,
    rejected: 3,
  },
};

export async function generateRiskComplianceReport(): Promise<GenerateRiskComplianceReportOutput> {
  return generateRiskComplianceReportFlow(mockRiskData);
}

const prompt = ai.definePrompt({
  name: 'generateRiskComplianceReportPrompt',
  input: { schema: z.any() },
  output: { schema: GenerateRiskComplianceReportOutputSchema },
  prompt: `
You are an expert risk analyst for PayMint, a decentralized invoice factoring platform.
Your task is to generate a professional and clean HTML risk and compliance summary report.

The report should be a single, self-contained HTML file. Use inline CSS for styling. Do not include any Javascript.
The design should be modern, clear, and suitable for a compliance officer or auditor. Use a professional font like Inter.
The layout should be well-organized with a clear title, a summary of key risk metrics, detailed breakdowns, and a narrative summary.

Here is the data for the report:
- Report Period: {{{period}}}
- Total AML/Compliance Alerts Generated: {{{alertsGenerated}}}
- Alert Status Breakdown: {{{alerts.pending}}} Pending, {{{alerts.reviewed}}} Reviewed, {{{alerts.escalated}}} Escalated.
- Currently Overdue Invoices: {{{overdueInvoices}}}
- Average Invoice Risk Score: {{{averageRiskScore}}}/100
- KYC/KYB Status: {{{kycStatus.verified}}} Verified, {{{kycStatus.pending}}} Pending, {{{kycStatus.rejected}}} Rejected.

Based on the data above, generate a comprehensive HTML report. It should include:
1.  A clear header with "PayMint Risk & Compliance Summary" and the reporting period.
2.  A top-level summary of the most critical metrics: Total Alerts, Overdue Invoices, and Average Risk Score.
3.  A section for "AML & Suspicious Activity" showing the breakdown of alert statuses.
4.  A section for "Credit & Marketplace Risk" showing the number of overdue invoices and the average risk score.
5.  A section for "User Verification" showing the breakdown of KYC/KYB statuses.
6.  A concluding "Analyst Summary" section. In this section, provide a brief narrative (2-3 paragraphs) on the overall risk posture of the platform. Mention positive trends (e.g., high verification rate) and areas requiring attention (e.g., number of pending alerts).
7.  The overall tone should be professional, factual, and clear.
8.  Use a color scheme with a primary color of #87CEEB (Sky Blue) for headers and accents. Use red or orange for highlighting high-risk numbers where appropriate (e.g., number of escalated alerts).

Generate the HTML content now.
`,
});

const generateRiskComplianceReportFlow = ai.defineFlow(
  {
    name: 'generateRiskComplianceReportFlow',
    inputSchema: z.any(),
    outputSchema: GenerateRiskComplianceReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
