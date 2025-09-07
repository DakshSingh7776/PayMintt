import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/contexts/WalletContext';
import { useSmartContract } from '@/hooks/use-smart-contract';
import { openSTXTransfer } from '@stacks/connect';

export const ContractConnectionTest = () => {
  const { address, balance, isConnected } = useWallet();
  const { contractDeployed, lastError, checkContractStatus } = useSmartContract();
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestResult('');

    try {
      // Test 1: Check if Leather Wallet is available
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        setTestResult('❌ Leather Wallet not available');
        return;
      }

      // Test 2: Check contract deployment
      await checkContractStatus();
      
      // Test 3: Try a simple STX transfer test (1 microSTX = 0.000001 STX)
      console.log('Testing STX transfer with official Stacks Connect...');
      
      const testResult = await openSTXTransfer({
        recipient: 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS',
        amount: '1', // 1 microSTX (very small amount for testing)
        network: 'testnet',
        memo: 'Test transfer from PayMint',
        appDetails: {
          name: 'PayMint Test',
          icon: 'https://example.com/icon.png',
        },
        onFinish: (data) => {
          console.log('Test transfer completed:', data);
          setTestResult('✅ STX Transfer Test: SUCCESS - Transaction completed');
        },
        onCancel: () => {
          console.log('Test transfer cancelled');
          setTestResult('⚠️ STX Transfer Test: CANCELLED - User cancelled transaction');
        },
      });

      console.log('Test transfer initiated:', testResult);
      setTestResult('🔄 STX Transfer Test: INITIATED - Check your wallet for approval');
      
    } catch (error) {
      console.error('Connection test error:', error);
      setTestResult(`❌ Connection Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Smart Contract Connection Test
          <Badge variant={contractDeployed ? 'default' : 'destructive'}>
            {contractDeployed ? 'Connected' : 'Not Connected'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test the connection between your frontend and the deployed smart contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Address:</strong> STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS
          </div>
          <div>
            <strong>Name:</strong> invoice-factoring-v2
          </div>
          <div>
            <strong>Network:</strong> Testnet
          </div>
          <div>
            <strong>Deployed via:</strong> Clarinet
          </div>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <span>Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={contractDeployed ? 'default' : 'destructive'}>
              {contractDeployed ? 'Deployed' : 'Not Deployed'}
            </Badge>
            <span>Contract</span>
          </div>
        </div>

        {/* Wallet Info */}
        {isConnected && (
          <div className="text-sm space-y-1">
            <div><strong>Address:</strong> {address}</div>
            <div><strong>Balance:</strong> {balance?.toFixed(2) || '0.00'} STX</div>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <Alert>
            <AlertDescription>{testResult}</AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {lastError && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Last Error:</strong> {lastError}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={runConnectionTest} 
            disabled={isTesting || !isConnected}
            className="flex-1"
          >
            {isTesting ? 'Testing...' : 'Run Connection Test'}
          </Button>
          <Button 
            onClick={checkContractStatus} 
            variant="outline"
            disabled={!isConnected}
          >
            Refresh Status
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Test includes:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Leather Wallet availability check</li>
            <li>Contract deployment verification</li>
            <li>STX transfer test (1 microSTX)</li>
            <li>Network connectivity test</li>
          </ul>
          <p className="mt-2">
            <strong>Note:</strong> The STX transfer test will send a tiny amount (0.000001 STX) 
            to your own address as a connectivity test. This is safe and uses minimal funds.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
