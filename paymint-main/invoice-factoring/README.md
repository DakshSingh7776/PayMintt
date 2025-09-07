# 🚀 Invoice Factoring Smart Contract

A Clarity smart contract for invoice factoring on the Stacks blockchain, built with Clarinet.

## 📋 Features

- **Create Invoice**: Businesses can create invoices with amount and due date
- **Fund Invoice**: Lenders can fund invoices by sending STX
- **Settle Invoice**: Businesses can repay lenders when invoices are due
- **Overdue Claims**: Lenders can claim overdue invoices
- **Status Tracking**: Real-time invoice status updates

## 🛠️ Development Setup

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet/introduction) (v3.5.0+)
- [Node.js](https://nodejs.org/) (v16+)
- [Leather Wallet](https://leather.io/) (for private key)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd invoice-factoring-v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your private key
   ```

## 🔧 Development Commands

### Contract Development

```bash
# Check contract syntax
npm run check

# Format contract code
npm run format

# Start interactive console
npm run console

# Run tests (if available)
npm run test
```

### Local Development

```bash
# Start local devnet
npm run devnet:start

# Deploy to local devnet
npm run devnet:deploy

# Stop local devnet
npm run devnet:stop

# Start integration environment
npm run integrate
```

### Testnet Deployment

```bash
# Deploy to testnet
npm run testnet:deploy

# Or use Node.js script
node deploy.js
```

## 📁 Project Structure

```
invoice-factoring-v2/
├── contracts/
│   └── invoice-factoring-v2.clar    # Main contract
├── deployments/
│   ├── default.devnet-plan.yaml  # Devnet deployment plan
│   └── default.testnet-plan.yaml # Testnet deployment plan
├── tests/                        # Contract tests
├── devnet/                       # Local devnet data
├── testnet/                      # Testnet data
├── Clarinet.toml                 # Clarinet configuration
├── package.json                  # Node.js dependencies
├── deploy.js                     # Deployment script
└── README.md                     # This file
```

## 🔑 Getting Your Private Key

1. **Open Leather Wallet**
2. **Go to Settings** → **Export Private Key**
3. **Copy the hex key** (starts with `0x`)
4. **Add to .env file**:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

## 🪙 Getting Testnet STX

1. **Visit**: https://faucet.testnet4.stacks.co/
2. **Enter your address**: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
3. **Request STX tokens** (1000 STX)
4. **Wait for confirmation** (5-10 minutes)

## 🚀 Deployment

### Local Devnet
```bash
npm run devnet:start
npm run devnet:deploy
```

### Testnet
```bash
# Make sure you have STX and private key set up
npm run testnet:deploy
```

### Manual Deployment
```bash
node deploy.js
```

## 📊 Contract Functions

### Public Functions

- `(create-invoice (amount uint) (due-date uint))` - Create new invoice
- `(fund-invoice (invoice-id uint) (amount uint))` - Fund an invoice
- `(settle-invoice (invoice-id uint))` - Settle an invoice
- `(claim-overdue-invoice (invoice-id uint))` - Claim overdue invoice

### Read-Only Functions

- `(get-invoice-counter)` - Get total invoice count
- `(get-invoice-details (invoice-id uint))` - Get invoice details
- `(get-invoice-status-string (invoice-id uint))` - Get status as string
- `(is-business-invoice (invoice-id uint) (business principal))` - Check ownership
- `(is-invoice-overdue (invoice-id uint))` - Check if overdue

## 🔗 Useful Links

- **Testnet4 Explorer**: https://explorer.testnet4.stacks.co/
- **Testnet4 Faucet**: https://faucet.testnet4.stacks.co/
- **Clarinet Docs**: https://docs.hiro.so/clarinet/
- **Clarity Docs**: https://docs.stacks.co/write-smart-contracts/

## 🛡️ Security

- **Never commit .env file** - Add it to .gitignore
- **Use different keys** for testnet vs mainnet
- **Keep private keys secure** - consider hardware wallets for mainnet
- **Test thoroughly** on testnet before mainnet deployment

## 🎯 Next Steps

After deployment:
1. **Update contract address** in your frontend
2. **Test all functions** via console or frontend
3. **Integrate with your app** using the contract address
4. **Monitor transactions** on the explorer

## 📞 Support

For issues or questions:
- Check the [Clarinet documentation](https://docs.hiro.so/clarinet/)
- Review [Clarity language docs](https://docs.stacks.co/write-smart-contracts/)
- Open an issue in this repository

