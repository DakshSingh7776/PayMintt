
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";
import { InvestigationDialog } from "@/components/investigation-dialog";
import { Alert } from "@/lib/types";
import { MOCK_ALERTS } from "@/lib/mock-data";


export default function AdminCompliancePage() {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleInvestigateClick = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsDialogOpen(true);
    };
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', { timeZone: 'UTC' });
  return (
    <>
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance & Verification</h1>
        <p className="text-muted-foreground">Monitor KYB/KYC status, AML alerts, and audit trails.</p>
      </div>
      <Card>
        <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>AML Alerts & Suspicious Activity</CardTitle>
                    <CardDescription>Review and take action on potential compliance issues.</CardDescription>
                </div>
                 <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Access Full Audit Trail
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Alert ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_ALERTS.map(alert => (
                        <TableRow key={alert.id}>
                            <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                            <TableCell className="font-medium">{alert.type}</TableCell>
                            <TableCell className="max-w-sm truncate">{alert.details}</TableCell>
                            <TableCell>{formatDate(alert.timestamp)}</TableCell>
                            <TableCell>
                                <Badge variant={alert.status === 'Reviewed' ? 'outline' : 'destructive'}>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {alert.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => handleInvestigateClick(alert)}>Investigate</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
     {selectedAlert && (
        <InvestigationDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          alert={selectedAlert}
        />
      )}
    </>
  );
}
