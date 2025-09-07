

import type { Invoice, DashboardStats, PoolStats, Settlement, MyInvestment, TrustedBuyer, InvestmentHistory, Alert } from './types';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    issuer: { name: 'Innovate Inc.' },
    debtor: { name: 'TechCorp' },
    amount: 500,
    askAmount: 480,
    dueDate: '2024-08-15',
    riskScore: 85,
    status: 'pending',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    issuer: { name: 'Synergy Solutions' },
    debtor: { name: 'GlobalNet' },
    amount: 1200,
    askAmount: 1150,
    dueDate: '2024-09-01',
    riskScore: 78,
    status: 'pending',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    issuer: { name: 'Apex Logistics' },
    debtor: { name: 'QuickHaul' },
    amount: 750,
    askAmount: 720,
    dueDate: '2024-08-20',
    riskScore: 92,
    status: 'funded',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    issuer: { name: 'Creative Minds' },
    debtor: { name: 'DesignWorks' },
    amount: 300,
    askAmount: 290,
    dueDate: '2024-07-30',
    riskScore: 65,
    status: 'pending',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    issuer: { name: 'Quantum Computing Co' },
    debtor: { name: 'Future Systems' },
    amount: 2500,
    askAmount: 2400,
    dueDate: '2024-09-10',
    riskScore: 88,
    status: 'pending',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    issuer: { name: 'GreenEnergy Providers' },
    debtor: { name: 'EcoPower' },
    amount: 1800,
    askAmount: 1720,
    dueDate: '2024-08-25',
    riskScore: 81,
    status: 'repaid',
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    issuer: { name: 'HealthFirst Supplies' },
    debtor: { name: 'City Hospital' },
    amount: 950,
    askAmount: 910,
    dueDate: '2024-06-15',
    riskScore: 70,
    status: 'overdue',
    penalty: 9.5
  },
   {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    issuer: { name: 'Innovate Inc.' },
    debtor: { name: 'Future Systems' },
    amount: 1500,
    askAmount: 1425,
    dueDate: '2024-05-20', // Overdue
    riskScore: 90,
    status: 'overdue',
    penalty: 15,
  },
  {
    id: '9',
    invoiceNumber: 'INV-2024-009',
    issuer: { name: 'OldTown Bakery' },
    debtor: { name: 'Gourmet Market' },
    amount: 2500,
    askAmount: 2400,
    dueDate: '2024-06-10', // Overdue
    riskScore: 75,
    status: 'overdue',
    penalty: 25
  },
  {
    id: '10',
    invoiceNumber: 'INV-2024-010',
    issuer: { name: 'Synergy Solutions' },
    debtor: { name: 'Data Corp' },
    amount: 8000,
    askAmount: 7600,
    dueDate: '2024-05-01',
    riskScore: 60,
    status: 'overdue',
    penalty: 80
  },
   {
    id: '11',
    invoiceNumber: 'INV-2023-115',
    issuer: { name: 'Innovate Inc.' },
    debtor: { name: 'TechCorp' },
    amount: 45000,
    askAmount: 43000,
    dueDate: '2023-12-01',
    riskScore: 85,
    status: 'repaid',
  },
  {
    id: '12',
    invoiceNumber: 'INV-2023-118',
    issuer: { name: 'Innovate Inc.' },
    debtor: { name: 'Future Systems' },
    amount: 80000,
    askAmount: 76000,
    dueDate: '2023-11-20',
    riskScore: 90,
    status: 'repaid',
  },
  {
    id: '13',
    invoiceNumber: 'INV-2023-120',
    issuer: { name: 'Synergy Solutions' },
    debtor: { name: 'GlobalNet' },
    amount: 22000,
    askAmount: 21000,
    dueDate: '2023-10-15',
    riskScore: 78,
    status: 'repaid',
  },
  {
    id: '14',
    invoiceNumber: 'INV-2023-121',
    issuer: { name: 'Apex Logistics' },
    debtor: { name: 'QuickHaul' },
    amount: 56000,
    askAmount: 54000,
    dueDate: '2023-09-05',
    riskScore: 92,
    status: 'repaid',
  }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalValueLocked: 1250000,
  totalInvoicesFactored: 134,
  activeInvestments: 23,
  averageYield: 8.2,
};

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'S1', invoiceNumber: 'INV-2024-006', amount: 18000, settlementDate: '2024-07-20', status: 'completed' },
  { id: 'S2', invoiceNumber: 'INV-2023-128', amount: 9500, settlementDate: '2024-07-18', status: 'completed' },
  { id: 'S3', invoiceNumber: 'INV-2023-121', amount: 4200, settlementDate: '2024-07-15', status: 'completed' },
];

export const MOCK_POOL_STATS: PoolStats = {
  totalLiquidity: 1250000,
  apy: 9.5,
  totalProviders: 88,
  utilizationRate: 75,
};


export const MOCK_MY_INVESTMENTS: MyInvestment[] = [
    {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        issuer: { name: 'Apex Logistics' },
        debtor: { name: 'QuickHaul' },
        investedAmount: 7200,
        yield: 4.17,
        status: 'funded',
        dueDate: '2024-08-20',
    },
    {
        id: '6',
        invoiceNumber: 'INV-2024-006',
        issuer: { name: 'GreenEnergy Providers' },
        debtor: { name: 'EcoPower' },
        investedAmount: 17200,
        yield: 4.65,
        status: 'repaid',
        dueDate: '2024-08-25',
    },
    {
        id: '7',
        invoiceNumber: 'INV-2024-007',
        issuer: { name: 'HealthFirst Supplies' },
        debtor: { name: 'City Hospital' },
        investedAmount: 9100,
        yield: 4.40,
        status: 'overdue',
        dueDate: '2024-06-15',
    },
    {
        id: 'inv_funded_1',
        invoiceNumber: 'INV-2024-F01',
        issuer: { name: 'Quantum Computing Co' },
        debtor: { name: 'Future Systems' },
        investedAmount: 19000,
        yield: 5.26,
        status: 'funded',
        dueDate: '2024-09-05',
    }
];

export const MOCK_TRUSTED_BUYERS: TrustedBuyer[] = [
  { id: 'usr_2', name: 'John Lender', avatar: 'https://picsum.photos/100/101', totalInvested: 125000, rank: 'Diamond' },
  { id: 'usr_4', name: 'Investor Jane', avatar: 'https://picsum.photos/100/102', totalInvested: 78000, rank: 'Platinum' },
  { id: 'buyer_3', name: 'Capital Group', avatar: 'https://picsum.photos/100/103', totalInvested: 45000, rank: 'Gold' },
  { id: 'buyer_4', name: 'Mike Invests', avatar: 'https://picsum.photos/100/104', totalInvested: 18500, rank: 'Silver' },
  { id: 'buyer_5', name: 'Sarah Funds', avatar: 'https://picsum.photos/100/105', totalInvested: 4500, rank: 'Bronze' },
  { id: 'buyer_6', name: 'Yield Partners', avatar: 'https://picsum.photos/100/106', totalInvested: 98000, rank: 'Platinum' },
  { id: 'buyer_7', name: 'Momentum Capital', avatar: 'https://picsum.photos/100/107', totalInvested: 250000, rank: 'Diamond' },
  { id: 'buyer_8', name: 'Anna Helsing', avatar: 'https://picsum.photos/100/108', totalInvested: 15000, rank: 'Silver' },
];

export const MOCK_INVESTMENT_HISTORY: { [key: string]: InvestmentHistory[] } = {
  'usr_2': [
    { invoiceId: 'INV-2023-115', amount: 45000, date: '2023-12-01', status: 'repaid' },
    { invoiceId: 'INV-2023-118', amount: 80000, date: '2023-11-20', status: 'repaid' },
  ],
  'usr_4': [
    { invoiceId: 'INV-2023-120', amount: 22000, date: '2023-10-15', status: 'repaid' },
    { invoiceId: 'INV-2023-121', amount: 56000, date: '2023-09-05', status: 'repaid' },
  ],
  'buyer_3': [
    { invoiceId: 'INV-2024-A01', amount: 20000, date: '2024-01-10', status: 'repaid' },
    { invoiceId: 'INV-2024-B12', amount: 15000, date: '2024-02-22', status: 'repaid' },
    { invoiceId: 'INV-2024-C34', amount: 10000, date: '2024-03-15', status: 'repaid' },
  ],
  'buyer_4': [
    { invoiceId: 'INV-2024-D56', amount: 10000, date: '2024-04-01', status: 'repaid' },
    { invoiceId: 'INV-2024-E78', amount: 8500, date: '2024-05-11', status: 'repaid' },
  ],
  'buyer_5': [
    { invoiceId: 'INV-2024-F90', amount: 4500, date: '2024-06-05', status: 'repaid' },
  ],
  'buyer_6': [
    { invoiceId: 'INV-2024-G11', amount: 50000, date: '2024-02-18', status: 'repaid' },
    { invoiceId: 'INV-2024-H22', amount: 48000, date: '2024-04-20', status: 'repaid' },
  ],
  'buyer_7': [
    { invoiceId: 'INV-2024-I33', amount: 100000, date: '2024-01-25', status: 'repaid' },
    { invoiceId: 'INV-2024-J44', amount: 80000, date: '2024-03-30', status: 'repaid' },
    { invoiceId: 'INV-2024-K55', amount: 70000, date: '2024-05-02', status: 'repaid' },
  ],
  'buyer_8': [
    { invoiceId: 'INV-2024-L66', amount: 5000, date: '2024-06-10', status: 'repaid' },
    { invoiceId: 'INV-2024-M77', amount: 10000, date: '2024-07-01', status: 'repaid' },
  ]
};

export const MOCK_ALERTS: Alert[] = [
    { 
        id: 'aml_1', 
        type: 'Suspicious Activity', 
        details: 'Large deposit ($50,000) from a high-risk jurisdiction.', 
        timestamp: '2024-07-29T11:00:00Z', 
        status: 'Pending Review',
        riskScore: 95,
        userProfile: { id: 'usr_3', name: 'Synergy Solutions', email: 'hello@synergy.co', kycStatus: 'Verified' },
        relatedTransactions: [{ id: 'txn_3', amount: 50000, date: '2024-07-29T10:55:00Z', type: 'Deposit' }],
        notes: [],
        actionHistory: [{ id: 'act_1', actor: 'System', action: 'Alert Generated', timestamp: '2024-07-29T11:00:00Z' }]
    },
    { 
        id: 'aml_2', 
        type: 'Sanctions List Match', 
        details: 'User name "John Lender" matches an entry on the OFAC list.', 
        timestamp: '2024-07-28T15:30:00Z', 
        status: 'Action Required',
        riskScore: 100,
        userProfile: { id: 'usr_2', name: 'John Lender', email: 'john.lender@email.com', kycStatus: 'Verified' },
        relatedTransactions: [],
        notes: [{ id: 'note_1', author: 'Admin User', timestamp: '2024-07-28T16:00:00Z', content: 'Initial review confirms potential match. User activity paused pending further investigation.' }],
        actionHistory: [
            { id: 'act_2_1', actor: 'System', action: 'Alert Generated', timestamp: '2024-07-28T15:30:00Z' },
            { id: 'act_2_2', actor: 'Admin User', action: 'Account Flagged', timestamp: '2024-07-28T16:01:00Z', details: 'User account flagged for manual review.' },
        ]
    },
    { 
        id: 'aml_3', 
        type: 'Unusual Transaction Pattern', 
        details: 'Business "Synergy Solutions" has multiple small invoices funded by the same lender in a short period.', 
        timestamp: '2024-07-27T08:00:00Z', 
        status: 'Reviewed',
        riskScore: 70,
        userProfile: { id: 'usr_3', name: 'Synergy Solutions', email: 'hello@synergy.co', kycStatus: 'Verified' },
        relatedTransactions: [
            { id: 'txn_10', amount: 1200, date: '2024-07-27T07:30:00Z', type: 'Funding' },
            { id: 'txn_11', amount: 1500, date: '2024-07-27T07:45:00Z', type: 'Funding' },
            { id: 'txn_12', amount: 900, date: '2024-07-27T07:55:00Z', type: 'Funding' },
        ],
        notes: [{ id: 'note_2', author: 'Compliance Officer', timestamp: '2024-07-27T10:00:00Z', content: 'Transactions appear legitimate after review. Lender is a known partner. Closing alert.' }],
        actionHistory: [
             { id: 'act_3_1', actor: 'System', action: 'Alert Generated', timestamp: '2024-07-27T08:00:00Z' },
             { id: 'act_3_2', actor: 'Compliance Officer', action: 'Status changed to Reviewed', timestamp: '2024-07-27T10:00:00Z', details: 'Marked as false positive.' },
        ]
    },
]
