
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const MOCK_TRANSACTIONS = [
    { id: 'txn_1', type: 'Funding', invoice: 'INV-2024-003', amount: 7200, user: 'john.lender@email.com', date: '2024-07-28T10:00:00Z', status: 'Completed' },
    { id: 'txn_2', type: 'Settlement', invoice: 'INV-2024-006', amount: 18000, user: 'Pool', date: '2024-07-20T09:00:00Z', status: 'Completed' },
    { id: 'txn_3', type: 'Deposit', invoice: '-', amount: 50000, user: 'jane.d@investors.net', date: '2024-07-19T14:00:00Z', status: 'Completed' },
    { id: 'txn_4', type: 'Settlement', invoice: 'INV-2023-128', amount: 9500, user: 'Pool', date: '2024-07-18T09:00:00Z', status: 'Completed' },
    { id: 'txn_5', type: 'Funding', invoice: 'INV-2024-001', amount: 4800, user: 'jane.d@investors.net', date: '2024-07-17T11:00:00Z', status: 'Failed' },
]

export default function AdminTransactionsPage() {
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', { timeZone: 'UTC' });

    const handleExportCsv = () => {
        const headers = ["Transaction ID", "Type", "Amount", "User/Entity", "Date", "Status", "Related Invoice"];
        const csvRows = [
            headers.join(','),
            ...MOCK_TRANSACTIONS.map(txn => [
                `"${txn.id}"`,
                `"${txn.type}"`,
                txn.amount,
                `"${txn.user}"`,
                `"${formatDate(txn.date)}"`,
                `"${txn.status}"`,
                `"${txn.invoice}"`,
            ].join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Factoring Pool & Transaction Monitoring</h1>
        <p className="text-muted-foreground">Oversee liquidity pools and view all platform transactions.</p>
      </div>
      <Card>
        <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Historical Transaction Log</CardTitle>
                    <CardDescription>A complete record of all financial activities on the platform.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportCsv}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>User/Entity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_TRANSACTIONS.map(txn => (
                        <TableRow key={txn.id}>
                            <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{txn.type}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                            <TableCell>{txn.user}</TableCell>
                            <TableCell>{formatDate(txn.date)}</TableCell>
                             <TableCell>
                                <Badge variant={txn.status === 'Completed' ? 'default' : 'destructive'}>
                                    {txn.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
