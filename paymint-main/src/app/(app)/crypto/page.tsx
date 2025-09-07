
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CryptoPrice } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialPrices: { [key: string]: CryptoPrice } = {
  btc: { inr: 5500000, usd: 66000, eur: 61000 },
  stx: { inr: 180, usd: 2.15, eur: 2.00 },
  usdt: { inr: 83.5, usd: 1.00, eur: 0.92 },
};

const tokenInfo = {
    btc: { name: "Bitcoin", icon: "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" },
    stx: { name: "Stacks", icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/4847.png" },
    usdt: { name: "Tether", icon: "https://tether.to/images/logoCircle.svg" }
}

const generateBtcData = (basePrice: number) => {
    const data = [];
    for (let i = 23; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        const price = basePrice * (1 + (Math.random() - 0.5) * 0.05);
        data.push({
            time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            price: price,
        });
    }
    return data;
}

export default function CryptoPage() {
  const [prices, setPrices] = useState<{ [key: string]: CryptoPrice } | null>(null);
  const [btcChartData, setBtcChartData] = useState<Array<{ time: string; price: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    setPrices(initialPrices);
    setBtcChartData(generateBtcData(initialPrices.btc.usd));
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setPrices(prevPrices => {
        if (!prevPrices) return null;
        const newPrices = { ...prevPrices };
        let newBtcPrice = prevPrices.btc.usd;
        for (const token in newPrices) {
          for (const currency in newPrices[token]) {
            const currentPrice = newPrices[token][currency as keyof CryptoPrice];
            const change = currentPrice * (Math.random() - 0.5) * 0.01; // +/- 0.5%
            const updatedPrice = currentPrice + change;
            newPrices[token][currency as keyof CryptoPrice] = updatedPrice;
            if(token === 'btc' && currency === 'usd') {
              newBtcPrice = updatedPrice;
            }
          }
        }
        setBtcChartData(generateBtcData(newBtcPrice));
        return newPrices;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'inr' ? 2 : 5,
    }).format(value);
  }

  if (loading || !prices) {
    return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Crypto Prices</h1>
            <p className="text-muted-foreground">Real-time cryptocurrency price information.</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Crypto Prices</h1>
        <p className="text-muted-foreground">Real-time cryptocurrency price information.</p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Bitcoin (BTC) - 24h Performance</CardTitle>
            <CardDescription>Price fluctuation over the last 24 hours in USD.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={btcChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} interval={3}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [formatCurrency(value, 'USD'), "Price"]} 
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {Object.keys(prices).map(token => (
          <Card key={token}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
               <Image src={tokenInfo[token as keyof typeof tokenInfo].icon} alt={`${token} logo`} className="h-10 w-10" width={40} height={40} />
               <div>
                <CardTitle>{token.toUpperCase()}</CardTitle>
                <CardDescription>{tokenInfo[token as keyof typeof tokenInfo].name}</CardDescription>
               </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Indian Rupee (INR)</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(prices[token].inr, 'INR')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>US Dollar (USD)</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(prices[token].usd, 'USD')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Euro (EUR)</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(prices[token].eur, 'EUR')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
