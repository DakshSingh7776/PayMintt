# Simple Contract Deployment Guide

## 🚀 Quick Deploy to Testnet4

### Option 1: Using the Script (Recommended)
```bash
# Make the script executable
chmod +x scripts/deploy-contract.sh

# Run the deployment script
./scripts/deploy-contract.sh
```

### Option 2: Manual Deployment

#### Step 1: Install Stacks CLI
```bash
curl -sL https://stacks.sh | bash
export PATH="$HOME/.local/bin:$PATH"
```

#### Step 2: Get Your Private Key
1. Open your Leather Wallet
2. Go to Settings → Export Private Key
3. Copy your private key (starts with `0x`)

#### Step 3: Deploy Contract
```bash
# Set your private key
export STACKS_PRIVATE_KEY="your-private-key-here"

# Deploy the contract
stacks deploy testnet4 contracts/invoice-factoring.clar
```

### Option 3: Using Clarinet (Advanced)

#### Step 1: Install Clarinet
```bash
curl -sL https://clarinet.sh | bash
```

#### Step 2: Create Clarinet Project
```bash
# Create clarinet.toml
cat > clarinet.toml << 'EOF'
[project]
name = "paymint-invoice-factoring"
description = "Invoice factoring smart contract for PayMint"
authors = ["PayMint Team"]
license = "MIT"

[contracts.invoice-factoring]
path = "contracts/invoice-factoring.clar"
clarity_version = "2.4"

[networks.testnet4]
url = "https://api.testnet4.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your-mnemonic-here"
balance = 1000000000000
EOF
```

#### Step 3: Deploy
```bash
clarinet deployments apply --config=clarinet.toml --network=testnet4
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Stacks CLI not found"**
   - Install Stacks CLI: `curl -sL https://stacks.sh | bash`
   - Add to PATH: `export PATH="$HOME/.local/bin:$PATH"`

2. **"No private key provided"**
   - Export your private key: `export STACKS_PRIVATE_KEY="your-key"`
   - Or enter it when prompted by the script

3. **"Insufficient balance"**
   - Get Testnet4 STX from faucet: https://faucet.testnet4.stacks.co/
   - Make sure you have at least 1000 STX for deployment

4. **"Contract file not found"**
   - The script will create the contract file automatically
   - Or manually create `contracts/invoice-factoring.clar`

### Get Testnet4 STX:
1. Visit: https://faucet.testnet4.stacks.co/
2. Enter your address: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
3. Request STX tokens

## 📋 After Deployment

### Update Contract Address
Once deployed, update the contract address in your code:

```typescript
// src/hooks/use-smart-contract.ts
const CONTRACT_ADDRESS = 'YOUR_ADDRESS.invoice-factoring';
```

### Test the Contract
1. Visit your app: http://localhost:9002
2. Go to Marketplace → Blockchain Actions
3. Try creating an invoice
4. Fund the invoice
5. Settle the invoice

## 🎯 Demo Workflow

1. **Business creates invoice**: 1000 STX, due in 30 days
2. **Lender funds invoice**: Transfers 1000 STX to business
3. **Business settles invoice**: Repays 1000 STX to lender

## 📞 Need Help?

- Check the deployment logs for specific errors
- Verify your private key is correct
- Make sure you have sufficient STX balance
- Try the manual deployment steps above

