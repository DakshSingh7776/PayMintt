
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MyInvestment } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, User, ShieldAlert } from "lucide-react"
import { differenceInDays, parseISO, format } from 'date-fns'

interface OverdueInvoiceActionsDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    investment: MyInvestment | null
}

export function OverdueInvoiceActionsDialog({ isOpen, onOpenChange, investment }: OverdueInvoiceActionsDialogProps) {
    const [isLoading, setIsLoading] = useState<null | 'issuer' | 'admin'>(null);
    const { toast } = useToast();

    if (!investment) return null;

    const daysOverdue = differenceInDays(new Date(), parseISO(investment.dueDate));

    const handleNotify = async (target: 'issuer' | 'admin') => {
        setIsLoading(target);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Notification Sent!",
            description: `The ${target} has been notified about invoice #${investment.invoiceNumber}.`,
        });

        setIsLoading(null);
        onOpenChange(false);
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Overdue Invoice Actions</DialogTitle>
                    <DialogDescription>
                       Take action on overdue invoice #{investment.invoiceNumber}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto text-destructive" />
                        <p className="mt-2 font-bold text-destructive">
                            This invoice is {daysOverdue} days overdue.
                        </p>
                        <p className="text-sm text-destructive/80">
                            Due Date: {format(parseISO(investment.dueDate), 'MMMM d, yyyy')}
                        </p>
                    </div>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Issuer</span>
                            <span>{investment.issuer.name}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Debtor</span>
                            <span>{investment.debtor.name}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button type="button" className="w-full" onClick={() => handleNotify('issuer')} disabled={!!isLoading}>
                         {isLoading === 'issuer' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                        Notify Issuer
                    </Button>
                     <Button type="button" variant="outline" className="w-full" onClick={() => handleNotify('admin')} disabled={!!isLoading}>
                         {isLoading === 'admin' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                        Notify Admin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
