import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration & Content Management</h1>
        <p className="text-muted-foreground">Manage system parameters, smart contracts, and platform content.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Marketplace Parameters</CardTitle>
                    <CardDescription>Adjust settings for the invoice marketplace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max-term">Max Invoice Term (Days)</Label>
                            <Input id="max-term" defaultValue="90" type="number"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="min-ask">Min Ask Amount ($)</Label>
                            <Input id="min-ask" defaultValue="500" type="number"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="risk-model">Risk Scoring Model Version</Label>
                        <Input id="risk-model" defaultValue="RSM-v2.1" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Smart Contract Addresses</CardTitle>
                    <CardDescription>Update addresses for key platform smart contracts. Use with caution.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nft-contract">Invoice NFT Contract</Label>
                        <Input id="nft-contract" defaultValue="0x1234...abcd" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pool-contract">Factoring Pool Contract</Label>
                        <Input id="pool-contract" defaultValue="0x5678...efgh" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="settlement-contract">Settlement Contract</Label>
                        <Input id="settlement-contract" defaultValue="0x9ABC...ijkl" />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Platform Announcements</CardTitle>
                    <CardDescription>Post an announcement banner on the main platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="announcement">Announcement Text</Label>
                        <Textarea id="announcement" placeholder="Enter announcement content..."/>
                    </div>
                    <Button>Publish Announcement</Button>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="flex justify-end">
        <Button>Save All Settings</Button>
      </div>
    </div>
  );
}
