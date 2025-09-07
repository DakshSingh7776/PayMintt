
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { PoolStats } from '@/lib/types'
import { PiggyBank, Percent, Users, BarChart, Wallet, Bitcoin, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useWallet } from '@/contexts/WalletContext'
import { useToast } from '@/hooks/use-toast'
import { useLiquidityPool } from '@/hooks/use-liquidity-pool'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function PoolPage() {
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [investmentDuration, setInvestmentDuration] = useState(12);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const { address, isConnected, balance, connectWallet, refreshBalance } = useWallet();
  const { toast } = useToast();
  const { 
    provideLiquidity, 
    withdrawLiquidity, 
    getLiquidityBalance, 
    getTotalPoolLiquidity,
    isLoading: poolLoading,
    lastError: poolError
  } = useLiquidityPool();

  useEffect(() => {
    async function fetchData() {
      try {
        const poolStatsRes = await fetch('/api/pool-stats');
        const statsData = await poolStatsRes.json();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatSTX = (value: number) => `${value.toFixed(2)} STX`;
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const calculatedYield = stats ? (investmentAmount * (stats.apy / 100) * (investmentDuration / 12)) : 0;

  const handleDeposit = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to provide liquidity.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${formatSTX(balance)} available.`,
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      // Real blockchain transaction
      const result = await provideLiquidity(amount);
      
      toast({
        title: "Liquidity Provided!",
        description: `Successfully deposited ${formatSTX(amount)} to the liquidity pool. Transaction: ${result.txid}`,
      });
      
      setDepositAmount('');
      
      // Refresh wallet balance and pool stats
      setTimeout(() => {
        refreshBalance();
        // Refresh pool stats
        fetch('/api/pool-stats')
          .then(res => res.json())
          .then(statsData => setStats(statsData))
          .catch(console.error);
      }, 3000);
      
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to provide liquidity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw liquidity.",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      // Get user's liquidity balance
      const userLiquidity = await getLiquidityBalance();
      
      if (userLiquidity <= 0) {
        toast({
          title: "No Liquidity",
          description: "You have no liquidity to withdraw from the pool.",
          variant: "destructive",
        });
        return;
      }

      // Real blockchain transaction
      const result = await withdrawLiquidity(userLiquidity);
      
      toast({
        title: "Liquidity Withdrawn!",
        description: `Successfully withdrawn ${formatSTX(userLiquidity)} from the pool. Transaction: ${result.txid}`,
      });
      
      // Refresh wallet balance and pool stats
      setTimeout(() => {
        refreshBalance();
        // Refresh pool stats
        fetch('/api/pool-stats')
          .then(res => res.json())
          .then(statsData => setStats(statsData))
          .catch(console.error);
      }, 3000);
      
    } catch (error) {
      console.error('Withdraw error:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to withdraw liquidity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liquidity Pool</h1>
          <p className="text-muted-foreground">Provide liquidity to earn yield from factored invoices.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1"><CardHeader><CardTitle>Provide Liquidity</CardTitle></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle>Yield Calculator</CardTitle></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Liquidity Pool</h1>
        <p className="text-muted-foreground">Provide liquidity to earn yield from factored invoices.</p>
      </div>
      
      {/* Wallet Status */}
      {!isConnected && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to provide liquidity to the pool. 
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold ml-1"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-6">
          <Wallet className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground">{address}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {formatSTX(balance)} Available
          </Badge>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liquidity</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSTX(stats.totalLiquidity / 100)}</div>
            <p className="text-xs text-muted-foreground">STX Pool</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current APY</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apy.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidity Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProviders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Utilization</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Provide Liquidity</CardTitle>
            <CardDescription>Deposit STX to start earning yield from invoice factoring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (STX)</Label>
              <Input 
                id="deposit-amount" 
                placeholder="e.g., 100" 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={!isConnected}
              />
              {isConnected && (
                <p className="text-xs text-muted-foreground">
                  Available: {formatSTX(balance)}
                </p>
              )}
            </div>
            <Button 
              className="w-full" 
              onClick={handleDeposit}
              disabled={!isConnected || isDepositing}
            >
              {isDepositing ? 'Depositing...' : 'Deposit STX'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleWithdraw}
              disabled={!isConnected || isWithdrawing}
            >
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw Liquidity'}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Yield Calculator</CardTitle>
            <CardDescription>Estimate your potential earnings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Label htmlFor="investment-amount">Investment Amount: {formatSTX(investmentAmount)}</Label>
                    <Slider
                    id="investment-amount"
                    min={10}
                    max={1000}
                    step={10}
                    value={[investmentAmount]}
                    onValueChange={(value) => setInvestmentAmount(value[0])}
                    />
                </div>
                <div className="space-y-4">
                    <Label htmlFor="investment-duration">Investment Duration: {investmentDuration} months</Label>
                    <Slider
                    id="investment-duration"
                    min={1}
                    max={36}
                    step={1}
                    value={[investmentDuration]}
                    onValueChange={(value) => setInvestmentDuration(value[0])}
                    />
                </div>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Yield</p>
              <p className="text-4xl font-bold text-primary">{formatSTX(calculatedYield)}</p>
              <p className="text-sm text-muted-foreground">Based on current APY of {stats.apy}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
