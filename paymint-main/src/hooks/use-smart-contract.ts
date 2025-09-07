import { useState, useCallback } from 'react';
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';

// Contract configuration
const CONTRACT_ADDRESS = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS';
const CONTRACT_NAME = 'invoice-factoring-v2';

// Invoice status constants
export const INVOICE_STATUS = {
  CREATED: 0,
  FUNDED: 1,
  SETTLED: 2,
} as const;

export interface Invoice {
  amount: number;
  dueDate: number;
  status: number;
  businessAddress: string;
  lenderAddress?: string;
  fundedAmount: number;
}

// Utility function to convert STX to microSTX
const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * 1000000);
};

// Utility function to check wallet balance
const checkWalletBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`);
    const data = await response.json();
    return parseInt(data.stx.balance) / 1000000; // Convert microSTX to STX
  } catch (error) {
    console.error('Error checking balance:', error);
    return 0;
  }
};

export const useSmartContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const [isContractDeployed, setIsContractDeployed] = useState<boolean | null>(null);

  // Check if contract is deployed
  const checkContractDeployment = useCallback(async () => {
    try {
      const response = await fetch(`https://api.testnet.hiro.so/extended/v1/contract/${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
      if (response.ok) {
        setIsContractDeployed(true);
        return true;
      } else {
        setIsContractDeployed(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking contract deployment:', error);
      setIsContractDeployed(false);
      return false;
    }
  }, []);

  // Get invoice counter (read-only)
  const getInvoiceCounter = useCallback(async () => {
    try {
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      const result = await leather.request('readOnlyFunctionCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-invoice-counter',
        functionArgs: [],
        network: 'testnet',
      });

      return result?.result ? parseInt(result.result) : 0;
    } catch (error) {
      console.error('Error getting invoice counter:', error);
      return 0;
    }
  }, []);

  // Create invoice
  const createInvoice = useCallback(async (amount: number, dueInBlocks: number, address: string) => {
    setIsLoading(true);
    setLastError('');

    try {
      console.log('Creating invoice with amount:', amount, 'STX, due in:', dueInBlocks, 'blocks');
      
      // Check current balance
      const currentBalance = await checkWalletBalance(address);
      console.log('Current balance before transaction:', currentBalance, 'STX');

      // Direct Leather Wallet call - no approval needed
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      console.log('Calling create-invoice directly...');
      const result = await leather.request('contractCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-invoice',
        functionArgs: [stxToMicroStx(amount).toString(), dueInBlocks.toString()],
        network: 'testnet',
      });
      
      console.log('✅ Invoice created successfully!', result);
      
      // Refresh balance after transaction
      setTimeout(async () => {
        const newBalance = await checkWalletBalance(address);
        console.log('New balance after transaction:', newBalance, 'STX');
      }, 5000);
      
      return {
        txid: result.txId || `tx-${Date.now()}`,
        status: 'success',
        message: 'Invoice created successfully!'
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      setLastError(`Failed to create invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fund invoice
  const fundInvoice = useCallback(async (invoiceId: number, amount: number, address: string) => {
    setIsLoading(true);
    setLastError('');

    try {
      console.log('Funding invoice ID:', invoiceId, 'with amount:', amount, 'STX');
      
      // Check current balance
      const currentBalance = await checkWalletBalance(address);
      console.log('Current balance before funding:', currentBalance, 'STX');

      const microStxAmount = stxToMicroStx(amount);

      // Direct Leather Wallet call - no approval needed
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      console.log('Calling fund-invoice directly...');
      const result = await leather.request('contractCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'fund-invoice',
        functionArgs: [invoiceId.toString(), microStxAmount.toString()],
        network: 'testnet',
      });
      
      console.log('✅ Invoice funded successfully!', result);
      console.log('STX deducted:', amount, 'STX');
      
      // Refresh balance after transaction
      setTimeout(async () => {
        const newBalance = await checkWalletBalance(address);
        console.log('New balance after funding:', newBalance, 'STX');
      }, 5000);
      
      return {
        txid: result.txId || `tx-${Date.now()}`,
        status: 'success',
        message: 'Invoice funded successfully!'
      };
    } catch (error) {
      console.error('Error funding invoice:', error);
      setLastError(`Failed to fund invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Settle invoice
  const settleInvoice = useCallback(async (invoiceId: number, address: string) => {
    setIsLoading(true);
    setLastError('');

    try {
      console.log('Settling invoice ID:', invoiceId);
      
      // Check current balance
      const currentBalance = await checkWalletBalance(address);
      console.log('Current balance before settlement:', currentBalance, 'STX');

      // Direct Leather Wallet call - no approval needed
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      console.log('Calling settle-invoice directly...');
      const result = await leather.request('contractCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'settle-invoice',
        functionArgs: [invoiceId.toString()],
        network: 'testnet',
      });
      
      console.log('✅ Invoice settled successfully!', result);
      
      // Refresh balance after transaction
      setTimeout(async () => {
        const newBalance = await checkWalletBalance(address);
        console.log('New balance after settlement:', newBalance, 'STX');
      }, 5000);
      
      return {
        txid: result.txId || `tx-${Date.now()}`,
        status: 'success',
        message: 'Invoice settled successfully!'
      };
    } catch (error) {
      console.error('Error settling invoice:', error);
      setLastError(`Failed to settle invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Claim overdue invoice
  const claimOverdueInvoice = useCallback(async (invoiceId: number, address: string) => {
    setIsLoading(true);
    setLastError('');

    try {
      console.log('Claiming overdue invoice ID:', invoiceId);
      
      // Check current balance
      const currentBalance = await checkWalletBalance(address);
      console.log('Current balance before claim:', currentBalance, 'STX');

      // Direct Leather Wallet call - no approval needed
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      console.log('Calling claim-overdue-invoice directly...');
      const result = await leather.request('contractCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'claim-overdue-invoice',
        functionArgs: [invoiceId.toString()],
        network: 'testnet',
      });
      
      console.log('✅ Overdue invoice claimed successfully!', result);
      
      // Refresh balance after transaction
      setTimeout(async () => {
        const newBalance = await checkWalletBalance(address);
        console.log('New balance after claim:', newBalance, 'STX');
      }, 5000);
      
      return {
        txid: result.txId || `tx-${Date.now()}`,
        status: 'success',
        message: 'Overdue invoice claimed successfully!'
      };
    } catch (error) {
      console.error('Error claiming overdue invoice:', error);
      setLastError(`Failed to claim overdue invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get status name
  const getStatusName = useCallback((status: number): string => {
    switch (status) {
      case INVOICE_STATUS.CREATED:
        return 'Created';
      case INVOICE_STATUS.FUNDED:
        return 'Funded';
      case INVOICE_STATUS.SETTLED:
        return 'Settled';
      default:
        return 'Unknown';
    }
  }, []);

  // Helper function to convert microSTX to STX
  const microStxToStx = useCallback((microStx: string): number => {
    return parseInt(microStx) / 1000000;
  }, []);

  // Get business invoices (invoices created by a specific address)
  const getBusinessInvoices = useCallback(async (businessAddress: string): Promise<Invoice[]> => {
    try {
      // For now, return empty array - this would need to be implemented with contract calls
      // to get all invoices for a specific business address
      console.log('Getting business invoices for:', businessAddress);
      return [];
    } catch (error) {
      console.error('Error getting business invoices:', error);
      return [];
    }
  }, []);

  // Get lender investments (invoices funded by a specific address)
  const getLenderInvestments = useCallback(async (lenderAddress: string): Promise<Invoice[]> => {
    try {
      // For now, return empty array - this would need to be implemented with contract calls
      // to get all invoices funded by a specific lender address
      console.log('Getting lender investments for:', lenderAddress);
      return [];
    } catch (error) {
      console.error('Error getting lender investments:', error);
      return [];
    }
  }, []);

  // Check if invoice is overdue
  const isInvoiceOverdue = useCallback(async (invoiceId: number): Promise<boolean> => {
    try {
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        throw new Error('Leather Wallet not available');
      }

      const result = await leather.request('readOnlyFunctionCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'is-invoice-overdue',
        functionArgs: [uintCV(invoiceId)],
        network: 'testnet',
      });

      return result?.result === 'true';
    } catch (error) {
      console.error('Error checking if invoice is overdue:', error);
      return false;
    }
  }, []);

  return {
    isLoading,
    lastError,
    isContractDeployed,
    checkContractDeployment,
    getInvoiceCounter,
    createInvoice,
    fundInvoice,
    settleInvoice,
    claimOverdueInvoice,
    checkWalletBalance,
    getStatusName,
    microStxToStx,
    getBusinessInvoices,
    getLenderInvestments,
    isInvoiceOverdue,
  };
};
