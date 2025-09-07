
"use client"

import type { Invoice } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Loader2 } from "lucide-react"


interface InvoiceCardProps {
  invoice: Invoice;
  onFundClick: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onFundClick }: InvoiceCardProps) {
  const formatSTX = (value: number) => `${value.toFixed(2)} STX`
  const potentialYield = ((invoice.amount - invoice.askAmount) / invoice.askAmount) * 100

  const isFunded = invoice.status === 'funded';
  const isOverdue = invoice.status === 'overdue';

  return (
    <Card className={`flex flex-col transition-all hover:shadow-lg ${isFunded || isOverdue ? '' : 'hover:-translate-y-1'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{invoice.issuer.name}</CardTitle>
          <Badge variant={invoice.riskScore > 80 ? "default" : invoice.riskScore > 60 ? "secondary" : "destructive"}>
            Risk: {invoice.riskScore}/100
          </Badge>
        </div>
        <CardDescription>Debtor: {invoice.debtor.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-primary">{formatSTX(invoice.askAmount)}</span>
          <span className="text-sm text-muted-foreground">{formatSTX(invoice.amount)}</span>
        </div>
         <div className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
          <span>Potential Yield</span>
          <span className="font-semibold text-green-600">{potentialYield.toFixed(2)}%</span>
        </div>
        {isOverdue && invoice.penalty && (
          <div className="flex justify-between text-sm text-destructive border-t pt-2 border-destructive/20">
            <span className="font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>Late Penalty</span>
            <span className="font-bold">{formatSTX(invoice.penalty)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => onFundClick(invoice)}
          disabled={isFunded || isOverdue}
          variant={isOverdue ? 'destructive' : 'default'}
        >
          {isFunded && 'Funded'}
          {isOverdue && 'Payment Overdue'}
          {!isFunded && !isOverdue && 'Fund Invoice'}
        </Button>
      </CardFooter>
    </Card>
  )
}
