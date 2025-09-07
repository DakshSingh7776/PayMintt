
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, FileText, History, MessageSquare, ShieldAlert, BadgeCheck, XCircle, Ban, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface InvestigationDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    alert: Alert | null
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', { timeZone: 'UTC' });

export function InvestigationDialog({ isOpen, onOpenChange, alert }: InvestigationDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [note, setNote] = useState("");
    const { toast } = useToast();

    if (!alert) return null;

    const handleAction = async (action: string, description: string) => {
        setIsLoading(true);
        // Simulate API call to perform the action
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
            title: "Action Successful",
            description,
        });
        setIsLoading(false);
        onOpenChange(false);
    }
    
    const handleAddNote = async () => {
         if(!note.trim()) return;
         setIsLoading(true);
         await new Promise(resolve => setTimeout(resolve, 1000));
         // In a real app, you would add the note to the alert object in your database
         alert.notes.unshift({
             id: `note_${Date.now()}`,
             author: 'Admin User',
             timestamp: new Date().toISOString(),
             content: note
         });
         setNote("");
         toast({ title: "Note Added", description: "Your note has been saved." });
         setIsLoading(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Investigate Alert: {alert.id}</DialogTitle>
                    <DialogDescription>
                        {alert.details}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden">
                    {/* Left Panel: Details */}
                    <div className="md:col-span-1 space-y-6 overflow-y-auto pr-2">
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Alert Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Risk Score</span>
                                     <Badge variant={alert.riskScore > 90 ? 'destructive' : 'secondary'}>{alert.riskScore}/100</Badge>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span>{alert.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Timestamp</span>
                                    <span>{formatDate(alert.timestamp)}</span>
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">User Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">User ID</span>
                                    <span>{alert.userProfile.id}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name</span>
                                    <span>{alert.userProfile.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span>{alert.userProfile.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">KYC/KYB</span>
                                    <Badge variant={alert.userProfile.kycStatus === 'Verified' ? 'default' : 'destructive'}>
                                        {alert.userProfile.kycStatus}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Enforcement Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" variant="destructive" onClick={() => handleAction('freeze_account', `Account for ${alert.userProfile.name} has been frozen.`)} disabled={isLoading}>
                                    <Ban className="mr-2 h-4 w-4" /> Freeze Account
                                </Button>
                                 <Button className="w-full" variant="outline" onClick={() => handleAction('flag_transactions', `Transactions for ${alert.userProfile.name} will be blocked.`)} disabled={isLoading}>
                                    <ShieldAlert className="mr-2 h-4 w-4" /> Block Transactions
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Tabs */}
                    <div className="md:col-span-2 flex flex-col overflow-y-auto">
                        <Tabs defaultValue="transactions" className="flex flex-col flex-grow">
                            <TabsList className="w-full">
                                <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
                                <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                                <TabsTrigger value="notes" className="flex-1">Notes & Comments</TabsTrigger>
                                <TabsTrigger value="history" className="flex-1">Action History</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transactions" className="flex-grow space-y-2 overflow-y-auto">
                                <h3 className="font-semibold pt-2">Related Transactions</h3>
                                {alert.relatedTransactions.map(tx => (
                                    <div key={tx.id} className="border p-3 rounded-md text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{tx.id}</span>
                                            <Badge variant="secondary">{tx.type}</Badge>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-muted-foreground">{formatDate(tx.date)}</span>
                                            <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                                        </div>
                                    </div>
                                ))}
                                {alert.relatedTransactions.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">No related transactions found.</p>}
                            </TabsContent>
                             <TabsContent value="documents" className="flex-grow space-y-2 overflow-y-auto">
                                <h3 className="font-semibold pt-2">Associated Documents</h3>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <FileText className="mr-2" /> kyc_id_proof.pdf
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <FileText className="mr-2" /> business_registration.pdf
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <FileText className="mr-2" /> gstin_certificate.pdf
                                </Button>
                            </TabsContent>
                             <TabsContent value="notes" className="flex-grow flex flex-col space-y-2 overflow-y-auto">
                                <h3 className="font-semibold pt-2">Investigation Notes</h3>
                                <div className="space-y-2 flex-grow overflow-y-auto">
                                    {alert.notes.map(n => (
                                        <div key={n.id} className="bg-muted p-3 rounded-md text-xs">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold">{n.author}</span>
                                                <span className="text-muted-foreground">{formatDate(n.timestamp)}</span>
                                            </div>
                                            <p>{n.content}</p>
                                        </div>
                                    ))}
                                    {alert.notes.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">No notes added yet.</p>}
                                </div>
                                <div className="flex-shrink-0 pt-2 space-y-2">
                                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a new note..."/>
                                    <Button onClick={handleAddNote} disabled={isLoading || !note.trim()}>
                                         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                                         Add Note
                                    </Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="history" className="flex-grow space-y-2 overflow-y-auto">
                                <h3 className="font-semibold pt-2">Action History</h3>
                                 {alert.actionHistory.map(log => (
                                     <div key={log.id} className="border-l-2 pl-3 py-2">
                                         <p className="font-semibold text-sm">{log.action}</p>
                                         <p className="text-xs text-muted-foreground">By {log.actor} at {formatDate(log.timestamp)}</p>
                                         {log.details && <p className="text-xs mt-1">{log.details}</p>}
                                     </div>
                                 ))}
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
                
                <DialogFooter className="flex-shrink-0 pt-4 border-t">
                    <Button variant="secondary" onClick={() => handleAction('download_report', `Report for ${alert.id} downloaded.`)} disabled={isLoading}>
                         <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                    <div className="flex-grow" />
                    <Button variant="outline" onClick={() => handleAction('dismiss', `Alert ${alert.id} has been dismissed as a false positive.`)} disabled={isLoading}>
                        <XCircle className="mr-2 h-4 w-4" /> Dismiss (False Positive)
                    </Button>
                    <Button variant="default" onClick={() => handleAction('approve', `Alert ${alert.id} has been reviewed and closed.`)} disabled={isLoading}>
                        <BadgeCheck className="mr-2 h-4 w-4" /> Mark as Reviewed & Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
