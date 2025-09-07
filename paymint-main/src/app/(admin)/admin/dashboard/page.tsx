
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_INVOICES, MOCK_DASHBOARD_STATS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Server, Cpu, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(MOCK_DASHBOARD_STATS.totalValueLocked)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Invoices Factored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_DASHBOARD_STATS.totalInvoicesFactored}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_INVOICES.length}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
             {/* Replace with real user count */}
            <div className="text-2xl font-bold">125</div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>System Health & Background Jobs</CardTitle>
          <CardDescription>Live status of platform services and automated tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Server className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">API Status</p>
              <p className="text-sm text-muted-foreground">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Cpu className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">OCR Service</p>
              <p className="text-sm text-muted-foreground">Healthy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Settlement Job</p>
              <p className="text-sm text-muted-foreground">Last run: 2h ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Oversight</CardTitle>
          <CardDescription>Review and manage all invoices on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Debtor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.issuer.name}</TableCell>
                  <TableCell>{invoice.debtor.name}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={
                        invoice.status === 'pending' ? 'secondary' : 
                        invoice.status === 'funded' ? 'default' :
                        invoice.status === 'repaid' ? 'outline' : 'destructive'
                    }>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm">
                                <CheckCircle className="h-4 w-4 mr-1"/> Approve
                            </Button>
                             <Button variant="destructive" size="sm">
                                <XCircle className="h-4 w-4 mr-1"/> Reject
                            </Button>
                        </div>
                    )}
                     {invoice.status === 'overdue' && (
                        <Button variant="destructive" size="sm">
                            <AlertTriangle className="h-4 w-4 mr-1"/> Investigate
                        </Button>
                    )}
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
