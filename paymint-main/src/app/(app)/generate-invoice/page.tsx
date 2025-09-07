
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LineItem } from '@/lib/types';
import { X, Plus, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateInvoiceDocument } from '@/ai/flows/generate-invoice-document';

export default function GenerateInvoicePage() {
  const [issuerName, setIssuerName] = useState('Innovate Inc.');
  const [issuerAddress, setIssuerAddress] = useState('123 Innovation Drive, Tech City, 12345');
  const [debtorName, setDebtorName] = useState('');
  const [debtorAddress, setDebtorAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [tax, setTax] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedInvoiceHtml, setGeneratedInvoiceHtml] = useState<string | null>(null);
  const [mintedInvoiceUrl, setMintedInvoiceUrl] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleLineItemChange = (index: number, field: keyof Omit<LineItem, 'total'>, value: string | number) => {
    const updatedLineItems = [...lineItems];
    const item = updatedLineItems[index];

    if (field === 'description') {
        item.description = value as string;
    } else {
        item[field] = Number(value);
    }
    
    item.total = item.quantity * item.unitPrice;
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };
  
  const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal + tax;

  const handleGenerateAndMint = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedInvoiceHtml(null);
    setMintedInvoiceUrl(null);
    
    try {
        // Step 1: Generate the invoice document
        toast({ title: 'Generating Invoice...', description: 'The AI is creating your invoice document.' });
        const invoiceDataForGeneration = {
            issuerName,
            issuerAddress,
            debtorName,
            debtorAddress,
            invoiceNumber,
            issueDate,
            dueDate,
            lineItems,
            subtotal,
            tax,
            total,
        };
        const { htmlContent } = await generateInvoiceDocument(invoiceDataForGeneration);
        setGeneratedInvoiceHtml(htmlContent);

        // Step 2: Mint the invoice NFT
        toast({ title: 'Minting Invoice NFT...', description: 'Your invoice is being tokenized on the blockchain.' });
        const invoiceDataForMinting = {
            issuerName,
            debtorName,
            invoiceNumber,
            amount: total,
            dueDate,
        };

        const response = await fetch('/api/invoices/mint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceDataForMinting),
        });

        if (!response.ok) {
            throw new Error('Minting failed. Please try again.');
        }

        const newInvoice = await response.json();
        
        // Generate a data URI for the invoice HTML to act as a "URL"
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setMintedInvoiceUrl(url);

        toast({
            title: "Success!",
            description: `Invoice ${newInvoice.invoiceNumber} minted and listed on the marketplace.`,
        });

    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
       toast({
        variant: "destructive",
        title: "Process Failed",
        description: errorMessage,
      });
    } finally {
        setIsLoading(false);
    }
  }

  if (mintedInvoiceUrl) {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold">Invoice Generated & Listed!</h2>
                <p className="mt-2 text-muted-foreground">Your invoice has been successfully created and is now available on the marketplace.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button onClick={() => router.push('/marketplace')}>
                        Go to Marketplace
                    </Button>
                    <a href={mintedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Invoice
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">Fill in the details to create a new invoice and list it for funding.</p>
      </div>
      <form onSubmit={handleGenerateAndMint}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>All fields are required unless otherwise noted.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">From (Issuer)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <Label htmlFor="issuer-name">Name</Label>
                             <Input id="issuer-name" value={issuerName} onChange={(e) => setIssuerName(e.target.value)} required />
                             <Label htmlFor="issuer-address">Address</Label>
                             <Textarea id="issuer-address" value={issuerAddress} onChange={(e) => setIssuerAddress(e.target.value)} required/>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">To (Debtor)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <Label htmlFor="debtor-name">Name</Label>
                             <Input id="debtor-name" value={debtorName} onChange={(e) => setDebtorName(e.target.value)} placeholder="e.g., GlobalNet" required />
                             <Label htmlFor="debtor-address">Address</Label>
                             <Textarea id="debtor-address" value={debtorAddress} onChange={(e) => setDebtorAddress(e.target.value)} placeholder="e.g., 456 Business Ave, Metro City" required/>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input id="invoice-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input id="issue-date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                 </div>
            </div>
            
            <div>
              <Label>Line Items</Label>
              <div className="mt-2 space-y-4">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
                        <div className="space-y-1 col-span-2">
                            <Label htmlFor={`desc-${index}`} className="text-xs">Description</Label>
                            <Input id={`desc-${index}`} value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} placeholder="Service or product" />
                        </div>
                        <div className="space-y-1">
                             <Label htmlFor={`qty-${index}`} className="text-xs">Quantity</Label>
                            <Input id={`qty-${index}`} type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                             <Label htmlFor={`price-${index}`} className="text-xs">Unit Price</Label>
                            <Input id={`price-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)} />
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(index)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
              </div>
            </div>

            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <Label htmlFor="tax" className="text-muted-foreground">Tax ($)</Label>
                        <Input id="tax" type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="w-24 h-8" />
                    </div>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

          </CardContent>
          <div className="flex justify-end p-6 pt-0">
             <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Generate & List Invoice'}
             </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
