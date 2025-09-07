import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrustedBuyer, InvestmentHistory } from "@/lib/types"
import { MOCK_INVESTMENT_HISTORY } from "@/lib/mock-data"
import { format } from 'date-fns'

interface InvestmentHistoryDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    buyer: TrustedBuyer | null
}

export function InvestmentHistoryDialog({ isOpen, onOpenChange, buyer }: InvestmentHistoryDialogProps) {
    if (!buyer) return null;
    
    const history = MOCK_INVESTMENT_HISTORY[buyer.id] || [];
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Investment History: {buyer.name}</DialogTitle>
                    <DialogDescription>A record of all invoices funded by this buyer.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <TableRow key={item.invoiceId}>
                                        <TableCell className="font-medium">{item.invoiceId}</TableCell>
                                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                                        <TableCell>{format(new Date(item.date), 'MM/dd/yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'repaid' ? 'outline' : 'destructive'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No investment history found for this buyer.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
