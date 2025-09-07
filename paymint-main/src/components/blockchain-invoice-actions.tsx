import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSmartContract, INVOICE_STATUS } from '@/hooks/use-smart-contract';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Info } from 'lucide-react';

export const BlockchainInvoiceActions: React.FC = () => {
  const [invoiceId, setInvoiceId] = useState<number>(1);
  const [amount, setAmount] = useState<number>(1000);
  const [dueDateDays, setDueDateDays] = useState<number>(30);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [invoiceCounter, setInvoiceCounter] = useState<number>(0);
  const [isContractDeployed, setIsContractDeployed] = useState<boolean | null>(null);

  const { createInvoice, fundInvoice, settleInvoice, getInvoiceDetails, getInvoiceCounter, getStatusName, isLoading, isContractDeployed: checkContractDeployed } = useSmartContract();
  const { address, isConnected } = useWallet();
  const { toast } = useToast();

  // Check if contract is deployed on mount
  useEffect(() => {
    checkContractStatus();
  }, []);

  // Load invoice counter on mount
  useEffect(() => {
    if (isContractDeployed) {
      loadInvoiceCounter();
    }
  }, [isContractDeployed]);

  // Load current invoice details when invoice ID changes
  useEffect(() => {
    if (invoiceId > 0 && isContractDeployed) {
      loadInvoiceDetails();
    }
  }, [invoiceId, isContractDeployed]);

  const checkContractStatus = async () => {
    try {
      const deployed = await checkContractDeployed();
      setIsContractDeployed(deployed);
    } catch (error) {
      console.log('Error checking contract status:', error);
      setIsContractDeployed(false);
    }
  };

  const loadInvoiceCounter = async () => {
    try {
      const counter = await getInvoiceCounter();
      setInvoiceCounter(counter);
      if (counter > 0) {
        setInvoiceId(counter);
      }
    } catch (error) {
      console.log('Error loading invoice counter:', error);
    }
  };

  const loadInvoiceDetails = async () => {
    try {
      const invoice = await getInvoiceDetails(invoiceId);
      setCurrentInvoice(invoice);
    } catch (error) {
      console.log('Error loading invoice details:', error);
      setCurrentInvoice(null);
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

    if (!isContractDeployed) {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the smart contract first using the deployment script.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createInvoice(amount, dueDateDays, address);
      toast({
        title: "Invoice Created",
        description: `Invoice created successfully! Transaction: ${result.txid}`,
      });
      
      // Reload invoice counter and details
      await loadInvoiceCounter();
      await loadInvoiceDetails();
    } catch (error) {
      toast({
        title: "Create Invoice Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFundInvoice = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!isContractDeployed) {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the smart contract first using the deployment script.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await fundInvoice(invoiceId, amount, address);
      toast({
        title: "Invoice Funded",
        description: `Invoice #${invoiceId} funded successfully! Transaction: ${result.txid}`,
      });
      
      // Reload invoice details
      await loadInvoiceDetails();
    } catch (error) {
      toast({
        title: "Fund Invoice Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSettleInvoice = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!isContractDeployed) {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the smart contract first using the deployment script.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await settleInvoice(invoiceId, address);
      toast({
        title: "Invoice Settled",
        description: `Invoice #${invoiceId} settled successfully! Transaction: ${result.txid}`,
      });
      
      // Reload invoice details
      await loadInvoiceDetails();
    } catch (error) {
      toast({
        title: "Settle Invoice Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Show deployment status
  if (isContractDeployed === false) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Smart Contract Not Deployed
          </CardTitle>
          <CardDescription>
            The invoice factoring smart contract needs to be deployed before you can use blockchain features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              To deploy the contract, run the deployment script in your terminal:
              <code className="block mt-2 p-2 bg-muted rounded text-sm">
                ./scripts/deploy-contract.sh
              </code>
            </AlertDescription>
          </Alert>
          <Button 
            onClick={checkContractStatus} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Check Contract Status"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state while checking contract
  if (isContractDeployed === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Blockchain Invoice Actions</CardTitle>
          <CardDescription>Checking smart contract status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-10 bg-muted animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine what actions are available
  const canCreateInvoice = isConnected && currentInvoice === null;
  const canFundInvoice = isConnected && currentInvoice && currentInvoice.status === INVOICE_STATUS.CREATED;
  const canSettleInvoice = isConnected && currentInvoice && currentInvoice.status === INVOICE_STATUS.FUNDED;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Blockchain Invoice Actions</CardTitle>
        <CardDescription>
          Interact with the invoice factoring smart contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Status */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Contract Deployed
          </Badge>
          <span className="text-sm text-muted-foreground">
            Total Invoices: {invoiceCounter}
          </span>
        </div>

        {/* Create Invoice Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Create Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount (STX)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date (Days)</Label>
              <Input
                id="dueDate"
                type="number"
                value={dueDateDays}
                onChange={(e) => setDueDateDays(Number(e.target.value))}
                placeholder="30"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateInvoice} 
                disabled={!canCreateInvoice || isLoading}
                className="w-full"
              >
                {isLoading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </div>

        {/* Fund Invoice Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fund Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fundInvoiceId">Invoice ID</Label>
              <Input
                id="fundInvoiceId"
                type="number"
                value={invoiceId}
                onChange={(e) => setInvoiceId(Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleFundInvoice} 
                disabled={!canFundInvoice || isLoading}
                className="w-full"
              >
                {isLoading ? "Funding..." : "Fund Invoice"}
              </Button>
            </div>
          </div>
        </div>

        {/* Settle Invoice Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Settle Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settleInvoiceId">Invoice ID</Label>
              <Input
                id="settleInvoiceId"
                type="number"
                value={invoiceId}
                onChange={(e) => setInvoiceId(Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSettleInvoice} 
                disabled={!canSettleInvoice || isLoading}
                className="w-full"
              >
                {isLoading ? "Settling..." : "Settle Invoice"}
              </Button>
            </div>
          </div>
        </div>

        {/* Current Invoice Status */}
        {currentInvoice && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Invoice #{invoiceId}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <Badge variant={currentInvoice.status === INVOICE_STATUS.SETTLED ? "default" : "secondary"}>
                  {getStatusName(currentInvoice.status)}
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Amount</Label>
                <p className="font-medium">{currentInvoice.amount} STX</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Business</Label>
                <p className="font-mono text-xs truncate">{currentInvoice.businessAddress}</p>
              </div>
              {currentInvoice.lenderAddress && (
                <div>
                  <Label className="text-sm text-muted-foreground">Lender</Label>
                  <p className="font-mono text-xs truncate">{currentInvoice.lenderAddress}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
