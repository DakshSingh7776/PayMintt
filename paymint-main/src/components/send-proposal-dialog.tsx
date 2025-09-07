import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TrustedBuyer } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface SendProposalDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    buyer: TrustedBuyer | null
}

export function SendProposalDialog({ isOpen, onOpenChange, buyer }: SendProposalDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    if (!buyer) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            toast({
                title: "Proposal Sent!",
                description: `Your proposal has been successfully sent to ${buyer.name}.`,
            });
        }, 1500);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Send Proposal to {buyer.name}</DialogTitle>
                        <DialogDescription>
                            Propose an investment opportunity directly to this buyer. They will be notified and can accept or decline.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice-id">Invoice Number</Label>
                            <Input id="invoice-id" placeholder="e.g., INV-2024-011" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="proposal-message">Message (Optional)</Label>
                            <Textarea id="proposal-message" placeholder="Include a brief message about this opportunity..." />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isLoading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Proposal
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
