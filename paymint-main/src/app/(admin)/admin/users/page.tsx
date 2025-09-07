
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MOCK_USERS = [
    { id: 'usr_1', name: 'Innovate Inc.', email: 'contact@innovate.com', role: 'Business', status: 'Approved', kycStatus: 'Verified' },
    { id: 'usr_2', name: 'John Lender', email: 'john.lender@email.com', role: 'Lender', status: 'Approved', kycStatus: 'Verified' },
    { id: 'usr_3', name: 'Synergy Solutions', email: 'hello@synergy.co', role: 'Business', status: 'Pending', kycStatus: 'Submitted' },
    { id: 'usr_4', name: 'Investor Jane', email: 'jane.d@investors.net', role: 'Lender', status: 'Suspended', kycStatus: 'Rejected' },
    { id: 'usr_5', name: 'Admin User', email: 'admin@paymint.app', role: 'Admin', status: 'Approved', kycStatus: 'N/A' },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">User & Role Management</h1>
        <p className="text-muted-foreground">Manage platform users, roles, and verification status.</p>
      </div>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View, search, and manage all users on the platform.</CardDescription>
                </div>
                <Input placeholder="Search users..." className="max-w-sm" />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>KYC/KYB</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_USERS.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    user.status === 'Approved' ? 'default' :
                                    user.status === 'Pending' ? 'secondary' :
                                    'destructive'
                                }>{user.status}</Badge>
                            </TableCell>
                             <TableCell>
                                <Badge variant={
                                    user.kycStatus === 'Verified' ? 'default' :
                                    user.kycStatus === 'Submitted' ? 'secondary' :
                                    user.kycStatus === 'Rejected' ? 'destructive' :
                                    'outline'
                                }>{user.kycStatus}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Approve User</DropdownMenuItem>
                                        <DropdownMenuItem>Suspend User</DropdownMenuItem>
                                        <DropdownMenuItem>View Audit Logs</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
