import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSmartContract, INVOICE_STATUS } from '@/hooks/use-smart-contract';

// Contract configuration
const CONTRACT_ADDRESS = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS.invoice-factoring-v2';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  Info, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';

interface Invoice {
  id: number;
  amount: number;
  dueDate: number;
  status: number;
  businessAddress: string;
  lenderAddress?: string;
  fundedAmount: number;
}

export const InvoicePaymentSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [businessInvoices, setBusinessInvoices] = useState<Invoice[]>([]);
  const [lenderInvestments, setLenderInvestments] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { 
    createInvoice, 
    fundInvoice, 
    settleInvoice, 
    getBusinessInvoices, 
    getLenderInvestments,
    isInvoiceOverdue,
    claimOverdueInvoice,
    getStatusName,
    isLoading: contractLoading,
    isContractDeployed,
    lastError,
    checkContractDeployment
  } = useSmartContract();
  
  const { address, isConnected, balance, refreshBalance } = useWallet();
  const { toast } = useToast();

  // Check contract status on mount
  useEffect(() => {
    if (isConnected) {
      checkContractDeployment();
    }
  }, [isConnected, checkContractDeployment]);

  // Load invoices on mount and when address changes
  useEffect(() => {
    if (isConnected && address) {
      loadInvoices();
    }
  }, [isConnected, address, refreshKey]);

  const loadInvoices = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      
      // Load business invoices (invoices created by this address)
      const businessInvs = await getBusinessInvoices(address);
      setBusinessInvoices(businessInvs);

      // Load lender investments (invoices funded by this address)
      const lenderInvs = await getLenderInvestments(address);
      setLenderInvestments(lenderInvs);

    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: "Error Loading Invoices",
        description: "Failed to load your invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await createInvoice(paymentAmount, 30, address); // 30 days due date
      
      toast({
        title: "Invoice Created Successfully!",
        description: `Invoice for ${paymentAmount} STX created. Transaction: ${result.txid}`,
      });

      // Refresh invoices and wallet balance
      setRefreshKey(prev => prev + 1);
      setPaymentAmount(0);
      
      // Refresh wallet balance after transaction
      setTimeout(() => {
        refreshBalance();
      }, 3000);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Failed to Create Invoice",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundInvoice = async (invoice: Invoice) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      toast({
        title: "Invoice Not Available",
        description: "This invoice is not available for funding.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await fundInvoice(invoice.id, invoice.amount, address);
      
      toast({
        title: "Invoice Funded Successfully!",
        description: `Funded ${invoice.amount} STX. Transaction: ${result.txid}`,
      });

      // Refresh invoices and wallet balance
      setRefreshKey(prev => prev + 1);
      
      // Refresh wallet balance after transaction
      setTimeout(() => {
        refreshBalance();
      }, 3000);
    } catch (error) {
      console.error('Error funding invoice:', error);
      toast({
        title: "Failed to Fund Invoice",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettleInvoice = async (invoice: Invoice) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (invoice.status !== INVOICE_STATUS.FUNDED) {
      toast({
        title: "Invoice Not Ready",
        description: "This invoice is not ready for settlement.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await settleInvoice(invoice.id, address);
      
      toast({
        title: "Invoice Settled Successfully!",
        description: `Settled ${invoice.fundedAmount} STX. Transaction: ${result.txid}`,
      });

      // Refresh invoices and wallet balance
      setRefreshKey(prev => prev + 1);
      
      // Refresh wallet balance after transaction
      setTimeout(() => {
        refreshBalance();
      }, 3000);
    } catch (error) {
      console.error('Error settling invoice:', error);
      toast({
        title: "Failed to Settle Invoice",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimOverdue = async (invoice: Invoice) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await claimOverdueInvoice(invoice.id);
      
      toast({
        title: "Overdue Invoice Claimed!",
        description: `Claimed ${invoice.fundedAmount} STX. Transaction: ${result.txid}`,
      });

      // Refresh invoices and wallet balance
      setRefreshKey(prev => prev + 1);
      
      // Refresh wallet balance after transaction
      setTimeout(() => {
        refreshBalance();
      }, 3000);
    } catch (error) {
      console.error('Error claiming overdue invoice:', error);
      toast({
        title: "Failed to Claim Invoice",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      [INVOICE_STATUS.CREATED]: { label: 'Created', variant: 'secondary' as const, icon: FileText },
      [INVOICE_STATUS.FUNDED]: { label: 'Funded', variant: 'default' as const, icon: DollarSign },
      [INVOICE_STATUS.SETTLED]: { label: 'Settled', variant: 'default' as const, icon: CheckCircle },
    };

    const config = statusConfig[status] || { label: 'Unknown', variant: 'outline' as const, icon: XCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show loading state while checking contract status
      if (isContractDeployed === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Checking Contract Status...
          </CardTitle>
          <CardDescription>
            Verifying smart contract deployment status
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Show error if contract is not deployed
      if (isContractDeployed === false) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Smart Contract Not Deployed
          </CardTitle>
          <CardDescription>
            The invoice factoring smart contract needs to be deployed before you can use payment features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please deploy the contract using the Clarinet deployment script in the invoice-factoring directory.
            </AlertDescription>
          </Alert>
          {lastError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {lastError}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={checkContractStatus} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Contract Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Payment System</h2>
          <p className="text-muted-foreground">
            Create, fund, and settle invoices using your smart contract
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <p className="text-lg font-semibold">{balance?.toFixed(2) || '0.00'} STX</p>
          </div>
          <Button 
            onClick={loadInvoices} 
            disabled={isLoading || contractLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Contract Status Indicator */}
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800 font-medium">Smart Contract Connected</span>
        <Badge variant="secondary" className="ml-auto">
          {CONTRACT_ADDRESS.split('.')[1]}
        </Badge>
      </div>

      {/* Create Invoice Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Invoice
          </CardTitle>
          <CardDescription>
            Create a new invoice that lenders can fund
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="amount">Amount (STX)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="Enter amount in STX"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateInvoice}
                disabled={isLoading || contractLoading || paymentAmount <= 0}
              >
                {isLoading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-invoices">My Invoices</TabsTrigger>
          <TabsTrigger value="my-investments">My Investments</TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Available Invoices
              </CardTitle>
              <CardDescription>
                Invoices available for funding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {businessInvoices.filter(inv => inv.status === INVOICE_STATUS.CREATED).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices available for funding</p>
                  <p className="text-sm">Create an invoice to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {businessInvoices
                    .filter(inv => inv.status === INVOICE_STATUS.CREATED)
                    .map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">Invoice #{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Business: {formatAddress(invoice.businessAddress)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{invoice.amount} STX</p>
                            <p className="text-sm text-muted-foreground">Due in 30 days</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(invoice.status)}
                          <Button
                            onClick={() => handleFundInvoice(invoice)}
                            disabled={isLoading || contractLoading}
                            size="sm"
                          >
                            {isLoading ? "Funding..." : "Fund Invoice"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Invoices Tab */}
        <TabsContent value="my-invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Invoices
              </CardTitle>
              <CardDescription>
                Invoices you've created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {businessInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices created yet</p>
                  <p className="text-sm">Create your first invoice above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {businessInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">Invoice #{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.lenderAddress ? `Funded by: ${formatAddress(invoice.lenderAddress)}` : 'Not funded yet'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{invoice.amount} STX</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.fundedAmount > 0 ? `Funded: ${invoice.fundedAmount} STX` : 'Not funded'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invoice.status)}
                        {invoice.status === INVOICE_STATUS.FUNDED && (
                          <Button
                            onClick={() => handleSettleInvoice(invoice)}
                            disabled={isLoading || contractLoading}
                            size="sm"
                          >
                            {isLoading ? "Settling..." : "Settle Invoice"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Investments Tab */}
        <TabsContent value="my-investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Investments
              </CardTitle>
              <CardDescription>
                Invoices you've funded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lenderInvestments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No investments yet</p>
                  <p className="text-sm">Fund an invoice from the marketplace to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lenderInvestments.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">Invoice #{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Business: {formatAddress(invoice.businessAddress)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{invoice.fundedAmount} STX</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.status === INVOICE_STATUS.SETTLED ? 'Settled' : 'Pending settlement'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invoice.status)}
                        {invoice.status === INVOICE_STATUS.FUNDED && (
                          <Button
                            onClick={() => handleClaimOverdue(invoice)}
                            disabled={isLoading || contractLoading}
                            size="sm"
                            variant="outline"
                          >
                            {isLoading ? "Claiming..." : "Claim Overdue"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
