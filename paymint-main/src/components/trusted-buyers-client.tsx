
"use client"

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrustedBuyer, Rank } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Crown, Gem, Medal, Star, Trophy, History, Send, MoreHorizontal } from 'lucide-react'
import { InvestmentHistoryDialog } from '@/components/investment-history-dialog'
import { SendProposalDialog } from '@/components/send-proposal-dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

const rankConfig: { [key in Rank]: { icon: React.ElementType, color: string, description: string } } = {
  Bronze: { icon: Medal, color: "text-amber-700", description: "Up to $5,000 invested" },
  Silver: { icon: Star, color: "text-slate-400", description: "$5,001 to $20,000 invested" },
  Gold: { icon: Trophy, color: "text-amber-500", description: "$20,001 to $50,000 invested" },
  Platinum: { icon: Crown, color: "text-sky-400", description: "$50,001 to $100,000 invested" },
  Diamond: { icon: Gem, color: "text-indigo-400", description: "Over $100,000 invested" },
};

const RankBadge = ({ rank }: { rank: Rank }) => {
  const { icon: Icon, color } = rankConfig[rank];
  return (
    <div className={`flex items-center gap-2 font-medium ${color}`}>
      <Icon className="h-5 w-5" />
      <span>{rank}</span>
    </div>
  );
};

export function TrustedBuyersClient() {
  const [buyers, setBuyers] = useState<TrustedBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TrustedBuyer; direction: 'ascending' | 'descending' }>({ key: 'totalInvested', direction: 'descending' });
  const [rankFilter, setRankFilter] = useState<Rank | 'all'>('all');

  const [selectedBuyer, setSelectedBuyer] = useState<TrustedBuyer | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trusted-buyers');
        const data = await res.json();
        setBuyers(data);
      } catch (error) {
        console.error("Failed to fetch trusted buyers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const requestSort = (key: keyof TrustedBuyer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredBuyers = useMemo(() => {
    let sortableItems = [...buyers];
    if (rankFilter !== 'all') {
      sortableItems = sortableItems.filter(buyer => buyer.rank === rankFilter);
    }
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [buyers, sortConfig, rankFilter]);
  
  const handleHistoryClick = (buyer: TrustedBuyer) => {
    setSelectedBuyer(buyer);
    setIsHistoryOpen(true);
  };
  
  const handleProposalClick = (buyer: TrustedBuyer) => {
    setSelectedBuyer(buyer);
    setIsProposalOpen(true);
  };


  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trusted Buyers</h1>
        <p className="text-muted-foreground">A ranking of investors based on their total funding amount.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(rankConfig) as Rank[]).map((rank) => (
          <Card key={rank} className="text-center">
            <CardHeader className="p-4">
              <div className="mx-auto">
                {React.createElement(rankConfig[rank].icon, { className: `h-8 w-8 ${rankConfig[rank].color}` })}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardTitle className="text-xl">{rank}</CardTitle>
              <CardDescription className="text-xs">{rankConfig[rank].description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Buyer Rankings</CardTitle>
              <CardDescription>Filter and sort to find top investors.</CardDescription>
            </div>
            <div className="w-48">
              <Select onValueChange={(value: Rank | 'all') => setRankFilter(value)} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  {(Object.keys(rankConfig) as Rank[]).map(rank => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('rank')}>
                    Rank
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('totalInvested')}>
                    Total Invested
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredBuyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={buyer.avatar} alt={buyer.name} data-ai-hint="buyer avatar"/>
                        <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{buyer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RankBadge rank={buyer.rank} />
                  </TableCell>
                  <TableCell>{formatCurrency(buyer.totalInvested)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleHistoryClick(buyer)}>
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleProposalClick(buyer)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Proposal
                        </DropdownMenuItem>
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
    {selectedBuyer && (
        <>
            <InvestmentHistoryDialog 
                isOpen={isHistoryOpen} 
                onOpenChange={setIsHistoryOpen}
                buyer={selectedBuyer} 
            />
            <SendProposalDialog 
                isOpen={isProposalOpen}
                onOpenChange={setIsProposalOpen}
                buyer={selectedBuyer}
            />
        </>
    )}
    </>
  )
}
