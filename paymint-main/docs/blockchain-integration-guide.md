# Blockchain Integration Guide

## Overview

This guide explains how to integrate the PayMint invoice factoring smart contract with the Next.js frontend using Leather Wallet.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Leather Wallet │    │ Stacks Blockchain│
│                 │    │                 │    │                 │
│ • React Hooks   │◄──►│ • Wallet Connect│◄──►│ • Smart Contract │
│ • UI Components │    │ • Transaction   │    │ • Invoice Data   │
│ • State Mgmt    │    │   Signing       │    │ • STX Transfers  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Smart Contract Functions

### Core Functions

#### 1. Create Invoice
```clarity
(create-invoice amount due-date)
```
- **Purpose**: Create a new invoice on the blockchain
- **Parameters**: 
  - `amount`: Invoice amount in microSTX (1 STX = 1,000,000 microSTX)
  - `due-date`: Due date as block height
- **Returns**: Invoice ID
- **Events**: `InvoiceCreated`

#### 2. Fund Invoice
```clarity
(fund-invoice invoice-id amount)
```
- **Purpose**: Fund an invoice with STX
- **Parameters**:
  - `invoice-id`: ID of the invoice to fund
  - `amount`: Amount to fund in microSTX
- **Returns**: Success status
- **Events**: `InvoiceFunded`

#### 3. Settle Invoice
```clarity
(settle-invoice invoice-id)
```
- **Purpose**: Settle an invoice (creator pays back funder)
- **Parameters**:
  - `invoice-id`: ID of the invoice to settle
- **Returns**: Success status
- **Events**: `InvoiceSettled`

### Read-Only Functions

#### 1. Get Invoice Details
```clarity
(get-invoice-details invoice-id)
```
- **Purpose**: Retrieve invoice information
- **Returns**: Invoice data structure

#### 2. Get Invoice Counter
```clarity
(get-invoice-counter)
```
- **Purpose**: Get total number of invoices
- **Returns**: Counter value

#### 3. Get Status Name
```clarity
(get-status-name status)
```
- **Purpose**: Convert status code to readable name
- **Returns**: Status name string

## Frontend Integration

### 1. Smart Contract Hook

The `useSmartContract` hook provides all contract interaction functions:

```typescript
import { useSmartContract } from '@/hooks/use-smart-contract';

const {
  isLoading,
  createInvoice,
  fundInvoice,
  settleInvoice,
  getInvoiceDetails,
  getInvoiceCounter,
  getStatusName,
  INVOICE_STATUS,
} = useSmartContract();
```

### 2. Contract Functions

#### Create Invoice
```typescript
const newInvoiceId = await createInvoice({
  amount: 10.5, // STX
  dueDate: new Date('2024-12-31').getTime(),
});
```

#### Fund Invoice
```typescript
const success = await fundInvoice({
  invoiceId: 0,
  amount: 10.5, // STX
});
```

#### Settle Invoice
```typescript
const success = await settleInvoice({
  invoiceId: 0,
});
```

### 3. UI Components

#### BlockchainInvoiceActions Component
```typescript
import { BlockchainInvoiceActions } from '@/components/blockchain-invoice-actions';

<BlockchainInvoiceActions
  invoiceId={0}
  amount={10.5}
  dueDate={new Date()}
  onSuccess={() => {
    // Handle success
  }}
/>
```

## Deployment Process

### 1. Prerequisites
```bash
# Install Clarinet
brew install clarinet  # macOS
# or
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar -xz
sudo mv clarinet /usr/local/bin/

# Install Stacks CLI
npm install -g @stacks/cli
```

### 2. Deploy Contract
```bash
# Run deployment script
./scripts/deploy-contract.sh

# Or manually
clarinet deployment generate --testnet
clarinet deployment apply --testnet
```

### 3. Update Environment
Create `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST3PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring
NEXT_PUBLIC_NETWORK=testnet4
```

## Integration Steps

### Step 1: Deploy Smart Contract
1. Run the deployment script
2. Note the contract address
3. Update environment variables

### Step 2: Test Contract Functions
```bash
clarinet console --testnet

# Create invoice
> (contract-call? .invoice-factoring create-invoice u1000000 u1000)

# Fund invoice
> (contract-call? .invoice-factoring fund-invoice u0 u1000000)

# Settle invoice
> (contract-call? .invoice-factoring settle-invoice u0)
```

### Step 3: Integrate with Frontend
1. Add `BlockchainInvoiceActions` component to invoice pages
2. Use `useSmartContract` hook for programmatic access
3. Handle success/error states
4. Update UI based on blockchain state

### Step 4: Update Database
When blockchain operations succeed, update Supabase:

```typescript
// After successful blockchain operation
const updateInvoiceStatus = async (invoiceId: number, status: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId);
};
```

## Error Handling

### Contract Errors
| Error Code | Description | Solution |
|------------|-------------|----------|
| u100 | Amount too low | Minimum 1 STX |
| u101 | Amount too high | Maximum 1000 STX |
| u102 | Due date in past | Set future date |
| u200 | Invoice not found | Check invoice ID |
| u201 | Wrong status | Check invoice state |
| u202 | Amount exceeds limit | Reduce funding amount |
| u300 | Only creator can settle | Verify permissions |

### Frontend Error Handling
```typescript
try {
  const result = await createInvoice(params);
  if (result !== null) {
    // Success
    toast({ title: "Success", description: "Invoice created!" });
  }
} catch (error) {
  // Handle error
  toast({ 
    title: "Error", 
    description: error.message,
    variant: "destructive" 
  });
}
```

## Testing

### Unit Tests
```bash
# Test smart contract
clarinet test

# Test frontend
npm run test
```

### Integration Tests
1. Deploy to testnet
2. Test wallet connection
3. Test all contract functions
4. Verify UI updates
5. Check database sync

### Manual Testing
1. Connect Leather wallet
2. Create invoice
3. Fund invoice
4. Settle invoice
5. Verify blockchain state
6. Check database updates

## Security Considerations

### Smart Contract Security
- ✅ Access control (only creator can settle)
- ✅ Amount validation (min/max limits)
- ✅ Status checks (proper state transitions)
- ✅ Escrow functionality (STX held in contract)
- ✅ Default protection (automatic refund)

### Frontend Security
- ✅ Wallet connection validation
- ✅ Input validation
- ✅ Error handling
- ✅ Transaction confirmation
- ✅ State synchronization

## Monitoring

### Blockchain Events
Monitor contract events for frontend updates:
- `InvoiceCreated`
- `InvoiceFunded`
- `InvoiceSettled`
- `InvoiceDefaulted`

### Transaction Tracking
- Use Hiro Explorer for transaction monitoring
- Implement webhook notifications
- Log all blockchain interactions
- Monitor for failed transactions

## Performance Optimization

### Caching
- Cache invoice details
- Implement optimistic updates
- Use React Query for data fetching
- Cache blockchain state

### Batch Operations
- Batch multiple operations
- Use transaction batching
- Implement retry logic
- Optimize API calls

## Troubleshooting

### Common Issues

#### 1. Wallet Connection Failed
```bash
# Check wallet installation
# Verify network configuration
# Clear browser cache
```

#### 2. Transaction Failed
```bash
# Check STX balance
# Verify transaction parameters
# Check network status
# Review error logs
```

#### 3. Contract Not Found
```bash
# Verify contract address
# Check network configuration
# Redeploy contract if needed
```

### Debug Commands
```bash
# Check contract status
clarinet check contracts/invoice-factoring.clar

# View contract on explorer
# https://explorer.testnet.hiro.so/address/<contract-address>

# Test contract functions
clarinet console --testnet
```

## Next Steps

1. **Production Deployment**
   - Deploy to mainnet
   - Implement monitoring
   - Add security audits

2. **Feature Enhancements**
   - Multiple funders per invoice
   - Partial settlements
   - Advanced escrow features
   - Automated default handling

3. **Integration Improvements**
   - Real-time updates
   - Webhook notifications
   - Advanced analytics
   - Mobile app support

