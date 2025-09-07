

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issuer: {
    name: string;
    logoUrl?: string;
  };
  debtor: {
    name: string;
  };
  amount: number;
  askAmount: number;
  dueDate: string;
  riskScore: number; // A number between 0 and 100
  status: 'pending' | 'funded' | 'repaid' | 'overdue';
  penalty?: number;
};

export type MyInvestment = {
  id: string;
  invoiceNumber: string;
  issuer: {
    name: string;
  };
  debtor: {
    name: string;
  };
  investedAmount: number;
  yield: number;
  status: 'funded' | 'repaid' | 'overdue';
  dueDate: string;
};

export type DashboardStats = {
  totalValueLocked: number;
  totalInvoicesFactored: number;
  activeInvestments: number;
  averageYield: number;
};

export type PoolStats = {
  totalLiquidity: number;
  apy: number;
  totalProviders: number;
  utilizationRate: number;
};

export type Settlement = {
  id:string;
  invoiceNumber: string;
  amount: number;
  settlementDate: string;
  status: 'completed' | 'pending';
}

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export type TrustedBuyer = {
  id: string;
  name: string;
  avatar: string;
  totalInvested: number;
  rank: Rank;
};

export type InvestmentHistory = {
  invoiceId: string;
  amount: number;
  date: string;
  status: 'repaid' | 'overdue';
};

export type CryptoPrice = {
  inr: number;
  usd: number;
  eur: number;
};

export type LineItem = {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
};

export type InvestigationNote = {
    id: string;
    author: string;
    timestamp: string;
    content: string;
};

export type ActionHistoryLog = {
    id: string;
    actor: string;
    action: string;
    timestamp: string;
    details?: string;
};

export type Alert = {
    id: string;
    type: 'Suspicious Activity' | 'Sanctions List Match' | 'Unusual Transaction Pattern';
    details: string;
    timestamp: string;
    status: 'Pending Review' | 'Action Required' | 'Reviewed' | 'Escalated' | 'Closed';
    riskScore: number;
    userProfile: {
        id: string;
        name: string;
        email: string;
        kycStatus: 'Verified' | 'Pending' | 'Rejected';
    };
    relatedTransactions: {
        id: string;
        amount: number;
        date: string;
        type: 'Deposit' | 'Funding' | 'Withdrawal';
    }[];
    notes: InvestigationNote[];
    actionHistory: ActionHistoryLog[];
};
