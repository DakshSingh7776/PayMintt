
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Invoice } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useSmartContract } from "@/hooks/use-smart-contract"
import { useWallet } from "@/contexts/WalletContext"
import { Loader2, AlertTriangle, Info, Bitcoin, CreditCard } from "lucide-react"
import { differenceInDays, parseISO, format } from 'date-fns'
import { Badge } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface FundInvoiceDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    invoice: Invoice | null
    onInvoiceFunded: (invoiceId: string) => void
}

const InfoTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)


export function FundInvoiceDialog({ isOpen, onOpenChange, invoice, onInvoiceFunded }: FundInvoiceDialogProps) {
    const [isFunding, setIsFunding] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'traditional'>('crypto');
    const { toast } = useToast();
    const { fundInvoice, isLoading: contractLoading } = useSmartContract();
    const { isConnected, balance, refreshBalance, address } = useWallet();

    if (!invoice) return null;

    const daysLeft = differenceInDays(parseISO(invoice.dueDate), new Date());
    const formatSTX = (value: number) => `${value.toFixed(2)} STX`;
    const fee = invoice.amount - invoice.askAmount;
    const feePercentage = (fee / invoice.askAmount) * 100;
    const riskNote = invoice.riskScore < 70 ? "This invoice has a higher risk score. Consider the debtor's payment history." : "This invoice meets standard risk criteria.";

    const handleConfirmFund = async () => {
        if (!isConnected || !address) {
          toast({
            title: "Wallet Not Connected",
            description: "Please connect your wallet to fund invoices.",
            variant: "destructive",
          });
          return;
        }

        if (paymentMethod === 'crypto' && balance !== null && invoice.askAmount > balance) {
          toast({
            title: "Insufficient Balance",
            description: `You only have ${formatSTX(balance)} available.`,
            variant: "destructive",
          });
          return;
        }

        setIsFunding(true);
        try {
          if (paymentMethod === 'crypto') {
            // Real blockchain transaction
            const result = await fundInvoice(parseInt(invoice.id), invoice.askAmount, address);
            
            toast({
              title: "STX Payment Initiated!",
              description: `Funding invoice ${invoice.invoiceNumber} with ${formatSTX(invoice.askAmount)}. ${result.message}`,
            });

            // Refresh wallet balance after transaction
            setTimeout(() => {
              refreshBalance();
            }, 3000);
          } else {
            // Handle traditional payment (simulated)
            const res = await fetch(`/api/invoices/fund`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                invoiceId: invoice.id,
                paymentMethod: 'traditional',
                amount: invoice.askAmount
              }),
            });
      
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'Failed to fund invoice.');
            }
            
            toast({
              title: "Traditional Payment Success!",
              description: `Successfully funded invoice ${invoice.invoiceNumber}. Payment will be processed in 3-5 business days.`,
            });
          }
    
          onInvoiceFunded(invoice.id);
          onOpenChange(false);
    
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          toast({
            variant: "destructive",
            title: "Funding Failed",
            description: errorMessage,
          });
        } finally {
          setIsFunding(false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Invoice Funding</DialogTitle>
                    <DialogDescription>
                       Review the terms for funding invoice #{invoice.invoiceNumber}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Invoice Details */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Invoice Details</h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Issuer</span>
                            <span>{invoice.issuer.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Due Date</span>
                            <span>{format(parseISO(invoice.dueDate), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Days to Due</span>
                            <span>{daysLeft} days</span>
                        </div>
                    </div>
                    {/* Funding Summary */}
                    <div className="space-y-2">
                         <h4 className="font-semibold text-sm">Funding Summary</h4>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground flex items-center gap-1">Advance Amount <InfoTooltip text="The amount you will fund to the business."/></span>
                            <span className="font-semibold">{formatSTX(invoice.askAmount)}</span>
                        </div>
                         <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground flex items-center gap-1">Platform & Risk Fee <InfoTooltip text="The fee you earn for funding this invoice."/></span>
                             <span className="font-semibold">{formatSTX(fee)} ({feePercentage.toFixed(2)}%)</span>
                        </div>
                         <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground flex items-center gap-1">Total Repayment <InfoTooltip text="The total amount you will receive when the invoice is paid."/></span>
                             <span className="font-semibold text-primary">{formatSTX(invoice.amount)}</span>
                        </div>
                    </div>

                     {/* Risk & Scoring */}
                    <div className="space-y-2">
                         <h4 className="font-semibold text-sm">Risk & Scoring</h4>
                         <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground">Risk Score</span>
                             <Badge variant={invoice.riskScore > 80 ? "default" : invoice.riskScore > 60 ? "secondary" : "destructive"}>
                                {invoice.riskScore}/100
                            </Badge>
                         </div>
                         <div className="p-2 bg-muted/50 rounded-md text-xs text-muted-foreground flex items-start gap-2">
                            {invoice.riskScore < 70 && <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />}
                            <span>{riskNote}</span>
                         </div>
                    </div>
                </div>
                {/* Payment Method Selection */}
                <div className="space-y-4 py-4 border-t">
                    <h4 className="font-semibold text-sm">Payment Method</h4>
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'crypto' | 'traditional')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="crypto" className="flex items-center gap-2">
                                <Bitcoin className="h-4 w-4" />
                                Crypto (STX)
                            </TabsTrigger>
                            <TabsTrigger value="traditional" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Traditional
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="crypto" className="space-y-3">
                            <div className="p-3 bg-muted/50 rounded-md">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Funding Amount:</span>
                                    <span className="font-semibold">{formatSTX(invoice.askAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-muted-foreground">Network Fee:</span>
                                    <span className="text-xs text-muted-foreground">~0.001 STX</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    💡 Fund directly with your STX wallet for instant settlement
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="traditional" className="space-y-3">
                            <div className="p-3 bg-muted/50 rounded-md">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Funding Amount:</span>
                                    <span className="font-semibold">{formatSTX(invoice.askAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-muted-foreground">Processing Fee:</span>
                                    <span className="text-xs text-muted-foreground">2.5%</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    💳 Traditional payment methods (3-5 business days)
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                
                <DialogFooter className="sm:justify-between gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isFunding}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" className="w-full sm:w-auto" onClick={handleConfirmFund} disabled={isFunding || contractLoading}>
                         {(isFunding || contractLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {paymentMethod === 'crypto' ? 'Fund with STX' : 'Fund with Traditional Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
