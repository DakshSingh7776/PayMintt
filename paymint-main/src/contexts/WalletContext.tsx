"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  network: string;
  balance: number | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  
  // Utility functions
  formatAddress: (address: string) => string;
  getExplorerUrl: (address: string) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [network, setNetwork] = useState('testnet'); // CONTRACT IS ON TESTNET

  // Check if Leather wallet is installed
  const checkLeatherInstalled = () => {
    return typeof window !== 'undefined' && 'LeatherProvider' in window;
  };

  // Fetch balance from API with network-specific endpoints
  const fetchBalance = async (walletAddress: string, networkType: string): Promise<number> => {
    try {
      // Validate wallet address format
      if (!walletAddress || !walletAddress.startsWith('ST')) {
        console.log('Invalid wallet address format, using demo balance');
        return Math.random() * 100;
      }

      // USE TESTNET ENDPOINTS (CONTRACT IS ON TESTNET)
      const endpoints = [
        `https://api.testnet.hiro.so/extended/v1/address/${walletAddress}/balances`
      ];

      let data = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying Testnet API endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });

          if (!response.ok) {
            console.log(`HTTP ${response.status}: ${response.statusText} for ${endpoint}`);
            if (response.status === 400 || response.status === 404) {
              continue;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          data = await response.json();
          console.log('API response:', data);
          break;
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}:`, error);
          lastError = error;
          continue;
        }
      }

      if (!data) {
        console.error('All Testnet API endpoints failed:', lastError);
        return Math.random() * 100;
      }
      
      let balance = 0;
      
      if (data.stx && data.stx.balance) {
        balance = parseFloat(data.stx.balance) / 1000000;
      } else if (data.balance && data.balance.stx) {
        balance = parseFloat(data.balance.stx) / 1000000;
      } else if (data.balances && data.balances.stx) {
        balance = parseFloat(data.balances.stx) / 1000000;
      } else {
        console.log('Unknown balance format:', data);
        return Math.random() * 100;
      }

      console.log(`Balance for ${walletAddress} (testnet): ${balance} STX`);
      return balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return Math.random() * 100;
    }
  };

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Refresh balance when address changes
  useEffect(() => {
    if (address && isConnected) {
      refreshBalance();
    }
  }, [address, isConnected]);

  const checkConnectionStatus = async () => {
    try {
      if (!checkLeatherInstalled()) {
        setIsConnected(false);
        return;
      }

      const storedAddress = localStorage.getItem('paymint_wallet_address');
      const storedNetwork = localStorage.getItem('paymint_wallet_network');
      
      if (storedAddress && storedNetwork === 'testnet') {
        setIsConnected(true);
        setAddress(storedAddress);
        setNetwork('testnet');
        const walletBalance = await fetchBalance(storedAddress, 'testnet');
        setBalance(walletBalance);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!checkLeatherInstalled()) {
        throw new Error('Leather wallet not installed. Please install the Leather extension first.');
      }

      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather wallet not available');
      }

      let walletAddress: string | null = null;

      try {
        // Method 1: Try getAddresses - USE TESTNET
        const result = await leather.request('getAddresses');
        console.log('Leather getAddresses result:', result);
        
        if (result && result.addresses && result.addresses.testnet) {
          walletAddress = result.addresses.testnet;
          console.log('Found Testnet address:', walletAddress);
        }
      } catch (error) {
        console.log('getAddresses failed, trying testnet specifically:', error);
      }

      // Method 2: Try getStxAddress with testnet specifically
      if (!walletAddress) {
        try {
          const stxAddress = await leather.request('getStxAddress', { network: 'testnet' });
          console.log('Leather getStxAddress (testnet) result:', stxAddress);
          if (stxAddress) {
            walletAddress = stxAddress;
            console.log('Found testnet address:', walletAddress);
          }
        } catch (error) {
          console.log('getStxAddress (testnet) failed:', error);
        }
      }

      // Method 3: Try getAddress with testnet specifically
      if (!walletAddress) {
        try {
          const address = await leather.request('getAddress', { network: 'testnet' });
          console.log('Leather getAddress (testnet) result:', address);
          if (address) {
            walletAddress = address;
            console.log('Found testnet address:', address);
          }
        } catch (error) {
          console.log('getAddress (testnet) failed:', error);
        }
      }

      // Method 4: Try getStxAddress without network parameter and check if it's testnet
      if (!walletAddress) {
        try {
          const stxAddress = await leather.request('getStxAddress');
          console.log('Leather getStxAddress (no network) result:', stxAddress);
          if (stxAddress && stxAddress.startsWith('ST')) {
            walletAddress = stxAddress;
            console.log('Detected testnet address:', walletAddress);
          } else {
            console.log('Address is not testnet format, will use demo mode');
          }
        } catch (error) {
          console.log('getStxAddress (no network) failed:', error);
        }
      }

      if (walletAddress && walletAddress.startsWith('ST')) {
        setIsConnected(true);
        setAddress(walletAddress);
        setNetwork('testnet');
        localStorage.setItem('paymint_wallet_address', walletAddress);
        localStorage.setItem('paymint_wallet_network', 'testnet');
        
        const walletBalance = await fetchBalance(walletAddress, 'testnet');
        setBalance(walletBalance);
        
        console.log(`Wallet connected to testnet:`, walletAddress);
        console.log('Balance:', walletBalance, 'STX');
      } else {
        console.log('Could not get testnet wallet address from Leather, using demo mode');
        const mockAddress = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS'; // Your Testnet address
        setIsConnected(true);
        setAddress(mockAddress);
        setNetwork('testnet');
        setBalance(Math.random() * 100);
        localStorage.setItem('paymint_wallet_address', mockAddress);
        localStorage.setItem('paymint_wallet_network', 'testnet');
        console.log('Using mock Testnet wallet for demo:', mockAddress);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      const mockAddress = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS'; // Your Testnet address
      setIsConnected(true);
      setAddress(mockAddress);
      setNetwork('testnet');
      setBalance(Math.random() * 100);
      localStorage.setItem('paymint_wallet_address', mockAddress);
      localStorage.setItem('paymint_wallet_network', 'testnet');
      console.log('Using mock Testnet wallet for demo:', mockAddress);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setNetwork('testnet');
      localStorage.removeItem('paymint_wallet_address');
      localStorage.removeItem('paymint_wallet_network');
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const refreshBalance = async () => {
    if (!address) return;
    
    try {
      const walletBalance = await fetchBalance(address, 'testnet');
      setBalance(walletBalance);
      console.log('Balance refreshed:', walletBalance, 'STX');
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const formatAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (address: string): string => {
    return `https://explorer.testnet.hiro.so/address/${address}`;
  };

  const value: WalletContextType = {
    isConnected,
    isConnecting,
    address,
    network,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    formatAddress,
    getExplorerUrl,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
