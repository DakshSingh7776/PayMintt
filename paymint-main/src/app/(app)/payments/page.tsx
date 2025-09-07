"use client"

import { InvoicePaymentSystem } from '@/components/invoice-payment-system'
import { ContractConnectionTest } from '@/components/contract-connection-test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Contract Payments</h1>
        <p className="text-muted-foreground">
          Create, fund, and settle invoices using your deployed smart contract on the Stacks blockchain.
        </p>
      </div>
      
      <Tabs defaultValue="payment-system" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payment-system">Payment System</TabsTrigger>
          <TabsTrigger value="connection-test">Connection Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-system" className="space-y-6">
          <InvoicePaymentSystem />
        </TabsContent>
        
        <TabsContent value="connection-test" className="space-y-6">
          <ContractConnectionTest />
        </TabsContent>
      </Tabs>
    </div>
  )
}
