import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { openSTXTransfer, openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';

// Contract configuration - FIXED: Separate address and name
const CONTRACT_ADDRESS = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS';
const CONTRACT_NAME = 'invoice-factoring-v2';

export const useLiquidityPool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { address, refreshBalance } = useWallet();

  // Helper function to convert STX to microSTX
  const stxToMicroStx = (stx: number): string => {
    return (stx * 1000000).toString();
  };

  // Helper function to convert microSTX to STX
  const microStxToStx = (microStx: string): number => {
    return parseInt(microStx) / 1000000;
  };

  // Provide liquidity to the pool using contract call (NOT direct STX transfer)
  const provideLiquidity = async (amount: number) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setLastError(null);
    
    try {
      const microStxAmount = stxToMicroStx(amount);

      console.log('Providing liquidity using contract call with proper Clarity types...');
      
      // FIXED: Use openContractCall to call the provide-liquidity function
      const result = await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'provide-liquidity',
        functionArgs: [uintCV(parseInt(microStxAmount))],
        network: 'testnet',
        postConditionMode: PostConditionMode.Allow,
        appDetails: {
          name: 'PayMint Invoice Factoring',
          icon: 'https://example.com/icon.png',
        },
        onFinish: (data) => {
          console.log('Liquidity provision completed:', data);
          setTimeout(() => {
            refreshBalance();
          }, 3000);
        },
        onCancel: () => {
          console.log('Liquidity provision cancelled by user');
          setIsLoading(false);
        },
      });

      console.log('Liquidity provision initiated:', result);
      
      const txResult = {
        txid: `tx-${Date.now()}`,
        status: 'pending',
        message: 'Liquidity provision transaction initiated - please approve in your wallet'
      };
      
      return txResult;
    } catch (error) {
      console.error('Error providing liquidity:', error);
      setLastError(`Failed to provide liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw liquidity from the pool using contract call with proper Clarity types
  const withdrawLiquidity = async (amount: number) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setLastError(null);
    
    try {
      const microStxAmount = stxToMicroStx(amount);

      console.log('Withdrawing liquidity using contract call with proper Clarity types...');
      
      // Use openContractCall for liquidity withdrawal with proper Clarity types
      const result = await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'withdraw-liquidity',
        functionArgs: [uintCV(parseInt(microStxAmount))],
        network: 'testnet',
        postConditionMode: PostConditionMode.Allow,
        appDetails: {
          name: 'PayMint Invoice Factoring',
          icon: 'https://example.com/icon.png',
        },
        onFinish: (data) => {
          console.log('Liquidity withdrawal completed:', data);
          setTimeout(() => {
            refreshBalance();
          }, 3000);
        },
        onCancel: () => {
          console.log('Liquidity withdrawal cancelled by user');
          setIsLoading(false);
        },
      });

      console.log('Liquidity withdrawal initiated:', result);
      
      const txResult = {
        txid: `tx-${Date.now()}`,
        status: 'pending',
        message: 'Liquidity withdrawal transaction initiated - please approve in your wallet'
      };
      
      return txResult;
    } catch (error) {
      console.error('Error withdrawing liquidity:', error);
      setLastError(`Failed to withdraw liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get liquidity pool balance for user
  const getLiquidityBalance = async (): Promise<number> => {
    if (!address) {
      return 0;
    }

    try {
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        return 0;
      }

      const result = await leather.request('readOnlyFunctionCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-liquidity-balance',
        functionArgs: [address],
        network: 'testnet',
      });

      if (result && result.result) {
        return microStxToStx(result.result);
      }
      
      return 0;
    } catch (error) {
      console.log('Error getting liquidity balance:', error);
      return 0;
    }
  };

  // Get total pool liquidity
  const getTotalPoolLiquidity = async (): Promise<number> => {
    try {
      const leather = (window as any).LeatherProvider;
      if (!leather) {
        return 0;
      }

      const result = await leather.request('readOnlyFunctionCall', {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-liquidity',
        functionArgs: [],
        network: 'testnet',
      });

      if (result && result.result) {
        return microStxToStx(result.result);
      }
      
      return 0;
    } catch (error) {
      console.log('Error getting total pool liquidity:', error);
      return 0;
    }
  };

  return {
    isLoading,
    lastError,
    provideLiquidity,
    withdrawLiquidity,
    getLiquidityBalance,
    getTotalPoolLiquidity,
    stxToMicroStx,
    microStxToStx,
  };
};
