
"use client"

import { useEffect, useState } from 'react'
import { Invoice } from '@/lib/types'
import { InvoiceCard } from "@/components/invoice-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ListFilter, Wallet } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import { FundInvoiceDialog } from '@/components/fund-invoice-dialog'
import { useWallet } from '@/contexts/WalletContext'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MarketplacePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const { isConnected, connectWallet } = useWallet();

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFundClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFundDialogOpen(true);
  };

  const handleInvoiceFunded = (fundedInvoiceId: string) => {
    setInvoices(currentInvoices =>
      currentInvoices.map(inv =>
        inv.id === fundedInvoiceId ? { ...inv, status: 'funded' } : inv
      )
    );
     // Close the dialog after funding
    setIsFundDialogOpen(false);
    setSelectedInvoice(null);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.issuer.name.toLowerCase().includes(searchTerm.toLowerCase()) && invoice.status === 'pending'
  );

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Browse and fund tokenized invoices with STX cryptocurrency.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input 
            placeholder="Search by issuer..." 
            className="w-full md:w-auto" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filters</Button>
        </div>
      </div>
      
      {/* Wallet Connection Alert */}
      {!isConnected && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to fund invoices with STX cryptocurrency.{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold" 
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Marketplace */}
      <div className="space-y-6">
        
        <div className="grid gap-6">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {filteredInvoices.length > 0 ? (
                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredInvoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} onFundClick={handleFundClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No pending invoices found.</p>
                  <p className="text-sm">Try clearing your search or check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    {selectedInvoice && (
      <FundInvoiceDialog
        isOpen={isFundDialogOpen}
        onOpenChange={setIsFundDialogOpen}
        invoice={selectedInvoice}
        onInvoiceFunded={handleInvoiceFunded}
      />
    )}
    </>
  )
}

const CardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-40 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)
