"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink, RefreshCw, Info } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

export const WalletStatus: React.FC = () => {
  const { isConnected, address, network, balance, formatAddress, getExplorerUrl, refreshBalance } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshBalance = async () => {
    setLoading(true);
    try {
      await refreshBalance();
      toast({
        title: "Balance Refreshed",
        description: "Wallet balance has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNetworkName = () => {
    // Return the actual detected network
    return network.charAt(0).toUpperCase() + network.slice(1);
  };

  const getNetworkInfo = () => {
    switch (network) {
      case 'testnet4':
        return {
          name: 'Testnet4',
          faucet: 'https://faucet.testnet4.stacks.co',
          explorer: 'https://explorer.testnet4.stacks.co'
        };
      case 'testnet':
        return {
          name: 'Testnet',
          faucet: 'https://faucet.testnet.hiro.so',
          explorer: 'https://explorer.testnet.hiro.so'
        };
      case 'mainnet':
        return {
          name: 'Mainnet',
          faucet: null,
          explorer: 'https://explorer.hiro.so'
        };
      default:
        return {
          name: 'Testnet4',
          faucet: 'https://faucet.testnet4.stacks.co',
          explorer: 'https://explorer.testnet4.stacks.co'
        };
    }
  };

  const networkInfo = getNetworkInfo();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Connect your Leather wallet to start using PayMint
            </p>
            <Badge variant="secondary">Not Connected</Badge>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Wallet Setup</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Make sure your Leather wallet is configured for the desired network.
                    {networkInfo.faucet && (
                      <> You can get test STX from the <a href={networkInfo.faucet} target="_blank" rel="noopener noreferrer" className="underline">{networkInfo.name} Faucet</a>.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant="default" className="bg-green-100 text-green-800">
            Connected
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network</span>
          <Badge variant="outline">{getNetworkName()}</Badge>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Address</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {formatAddress(address!)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(getExplorerUrl(address!), '_blank')}
              className="h-6 w-6 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Balance</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {balance !== null ? `${balance.toFixed(4)} STX` : 'Loading...'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshBalance}
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900">{networkInfo.name} Info</p>
              <p className="text-xs text-blue-700 mt-1">
                Connected to Stacks {networkInfo.name}.
                {networkInfo.faucet && (
                  <> Get test STX from the <a href={networkInfo.faucet} target="_blank" rel="noopener noreferrer" className="underline">faucet</a>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
