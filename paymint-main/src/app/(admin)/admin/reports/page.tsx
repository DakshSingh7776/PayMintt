
"use client";

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart2, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { generateMonthlyUsageReport } from '@/ai/flows/generate-monthly-usage-report';
import { generateFinancialPerformanceReport } from '@/ai/flows/generate-financial-performance-report';
import { generateRiskComplianceReport } from '@/ai/flows/generate-risk-compliance-report';
import { generateLenderPayoutReport } from '@/ai/flows/generate-lender-payout-report';

type ReportType = 'monthly' | 'financial' | 'risk' | 'lender';

const REPORT_CONFIG = {
    monthly: {
        name: "Monthly Usage Report",
        description: "Overview of platform activity and user engagement.",
        generator: generateMonthlyUsageReport,
        filename: "monthly_usage_report.pdf",
    },
    financial: {
        name: "Financial Performance Report",
        description: "Detailed breakdown of revenue, yield, and fees.",
        generator: generateFinancialPerformanceReport,
        filename: "financial_performance_report.pdf",
    },
    risk: {
        name: "Risk & Compliance Summary",
        description: "Summary of risk scores, overdue invoices, and compliance alerts.",
        generator: generateRiskComplianceReport,
        filename: "risk_compliance_summary.pdf",
    },
    lender: {
        name: "Lender Payout Report",
        description: "Export of all yield payouts to liquidity providers.",
        generator: generateLenderPayoutReport,
        filename: "lender_payout_report.pdf",
    },
};

const chartData = [
  { name: 'Jan', value: 400000 },
  { name: 'Feb', value: 300000 },
  { name: 'Mar', value: 500000 },
  { name: 'Apr', value: 450000 },
  { name: 'May', value: 600000 },
  { name: 'Jun', value: 550000 },
  { name: 'Jul', value: 720000 },
];

export default function AdminReportsPage() {
  const [loadingReport, setLoadingReport] = useState<ReportType | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const handleDownloadReport = async (reportType: ReportType) => {
    setLoadingReport(reportType);
    toast({ title: 'Generating Report...', description: 'The AI is creating your report. This might take a moment.' });
    
    try {
        const config = REPORT_CONFIG[reportType];
        const { htmlContent } = await config.generator();
        
        // Create a hidden element to render the HTML for PDF conversion
        const reportContainer = document.createElement('div');
        reportContainer.style.position = 'absolute';
        reportContainer.style.left = '-9999px';
        reportContainer.style.width = '1024px'; 
        reportContainer.innerHTML = htmlContent;
        document.body.appendChild(reportContainer);

        const canvas = await html2canvas(reportContainer, {
            scale: 2, 
            useCORS: true,
            logging: false,
        });

        document.body.removeChild(reportContainer);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(config.filename);

        toast({ title: 'Report Downloaded', description: `${config.name} has been successfully generated.` });

    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
        setLoadingReport(null);
    }
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporting & Analytics</h1>
        <p className="text-muted-foreground">Generate reports and visualize key platform metrics.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Factoring Volume</CardTitle>
            <CardDescription>Total value of invoices factored per month.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [formatCurrency(value), "Volume"]} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>Download detailed reports for analysis and stakeholder communication.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            {(Object.keys(REPORT_CONFIG) as ReportType[]).map(key => {
                const report = REPORT_CONFIG[key];
                const isLoading = loadingReport === key;
                return (
                    <div key={key} className="flex items-center justify-between rounded-md border p-4">
                        <div>
                            <p className="font-semibold">{report.name}</p>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadReport(key)} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                            {isLoading ? 'Generating...' : 'Download'}
                        </Button>
                    </div>
                );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
