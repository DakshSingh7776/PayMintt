
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MyInvestment } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { OverdueInvoiceActionsDialog } from '@/components/overdue-invoice-actions-dialog'

export default function MyInvestmentsPage() {
  const [myInvestments, setMyInvestments] = useState<MyInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<MyInvestment | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const myInvestmentsRes = await fetch('/api/my-investments');
        const investmentsData = await myInvestmentsRes.json();
        setMyInvestments(investmentsData);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleActionClick = (investment: MyInvestment) => {
    setSelectedInvestment(investment);
    setIsActionsOpen(true);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  
  if (loading) {
    return (
       <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">My Investments</h1>
            <p className="text-muted-foreground">Track your funded invoices and returns.</p>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
       </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Investments</h1>
        <p className="text-muted-foreground">A complete list of invoices you have directly funded.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Amount Invested</TableHead>
                <TableHead>Expected Yield</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myInvestments.length > 0 ? (
                myInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.invoiceNumber}</TableCell>
                    <TableCell>{investment.issuer.name}</TableCell>
                    <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                    <TableCell className="text-green-600 font-medium">{investment.yield.toFixed(2)}%</TableCell>
                    <TableCell>{format(new Date(investment.dueDate), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>
                       <Badge variant={
                          investment.status === 'funded' ? 'default' : 
                          investment.status === 'repaid' ? 'outline' :
                          'destructive'
                      }>{investment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {investment.status === 'overdue' && (
                        <Button variant="ghost" size="icon" onClick={() => handleActionClick(investment)}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">You haven&apos;t made any investments yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
     {selectedInvestment && (
        <OverdueInvoiceActionsDialog
          isOpen={isActionsOpen}
          onOpenChange={setIsActionsOpen}
          investment={selectedInvestment}
        />
      )}
    </>
  )
}
