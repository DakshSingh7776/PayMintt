# Smart Contract Deployment Guide

## Prerequisites

1. **Install Clarinet**
   ```bash
   # macOS
   brew install clarinet
   
   # Linux
   curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar -xz
   sudo mv clarinet /usr/local/bin/
   
   # Windows
   # Download from https://github.com/hirosystems/clarinet/releases
   ```

2. **Install Stacks CLI**
   ```bash
   npm install -g @stacks/cli
   ```

3. **Get Testnet STX**
   - Visit https://faucet.testnet.hiro.so
   - Enter your wallet address
   - Request test STX

## Deployment Steps

### 1. Initialize Clarinet Project
```bash
# Navigate to project root
cd /path/to/paymint2

# Initialize Clarinet (if not already done)
clarinet init

# Check configuration
clarinet check
```

### 2. Test the Contract
```bash
# Run tests
clarinet test

# Check contract syntax
clarinet check contracts/invoice-factoring.clar
```

### 3. Deploy to Testnet

#### Option A: Using Clarinet
```bash
# Deploy to testnet
clarinet deployment generate --testnet

# Review the deployment plan
cat deployments/default.testnet.yaml

# Execute deployment
clarinet deployment apply --testnet
```

#### Option B: Manual Deployment
```bash
# Get your wallet address
stx address

# Deploy contract
stx deploy contracts/invoice-factoring.clar \
  --testnet \
  --sender <your-wallet-address> \
  --fee 10000
```

### 4. Verify Deployment
```bash
# Check contract on explorer
# Visit: https://explorer.testnet.hiro.so/address/<contract-address>

# Test contract functions
clarinet console --testnet
```

## Contract Addresses

After deployment, you'll get contract addresses like:
- **Testnet**: `ST2PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring`
- **Mainnet**: `ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring`

## Contract Functions

### Public Functions
- `(create-invoice amount due-date)` - Create new invoice
- `(fund-invoice invoice-id amount)` - Fund an invoice
- `(settle-invoice invoice-id)` - Settle an invoice
- `(mark-defaulted invoice-id)` - Mark invoice as defaulted

### Read-Only Functions
- `(get-invoice-details invoice-id)` - Get invoice details
- `(get-invoice-counter)` - Get total invoice count
- `(get-status-name status)` - Get status name

## Testing the Contract

### 1. Create Invoice
```bash
clarinet console --testnet
> (contract-call? .invoice-factoring create-invoice u1000000 u1000)
```

### 2. Fund Invoice
```bash
> (contract-call? .invoice-factoring fund-invoice u0 u1000000)
```

### 3. Settle Invoice
```bash
> (contract-call? .invoice-factoring settle-invoice u0)
```

## Error Codes

| Code | Description |
|------|-------------|
| u100 | Amount too low (minimum 1 STX) |
| u101 | Amount too high (maximum 1000 STX) |
| u102 | Due date must be in the future |
| u200 | Invoice not found |
| u201 | Invoice not in CREATED status |
| u202 | Funding amount exceeds remaining amount |
| u203 | Funding amount must be positive |
| u204 | STX transfer failed |
| u300 | Invoice not found |
| u301 | Invoice not in FUNDED status |
| u302 | Only creator can settle |
| u303 | Due date not reached |
| u304 | No funder found |
| u305 | Settlement transfer failed |

## Integration with Frontend

The contract is designed to work with the PayMint frontend:

1. **Create Invoice**: Business creates invoice on blockchain
2. **Fund Invoice**: Investor funds invoice with STX
3. **Settle Invoice**: Business pays back investor
4. **Status Updates**: Frontend syncs with blockchain state

## Security Considerations

- **Access Control**: Only invoice creator can settle
- **Amount Validation**: Min/max amounts enforced
- **Status Checks**: Proper state transitions
- **Escrow**: STX held in contract until settlement
- **Default Protection**: Automatic refund on default

## Monitoring

- **Events**: All actions emit events for frontend tracking
- **Explorer**: Monitor transactions on Hiro Explorer
- **Logs**: Check Clarinet console for detailed logs

