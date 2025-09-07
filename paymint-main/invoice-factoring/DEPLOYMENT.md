# 🚀 Deployment Guide for Invoice Factoring Contract

## ✅ **Current Status**
- ✅ **Contract Validated**: `clarinet check` passed
- ✅ **Dependencies Installed**: All Node.js packages ready
- ✅ **Project Structure**: Complete Clarinet setup
- ✅ **Console Working**: Contract functions available

## 🔧 **Development Commands**

### **Local Development**
```bash
# Check contract syntax
npm run check

# Start interactive console
npm run console

# Start local devnet
npm run devnet:start

# Deploy to local devnet
npm run devnet:deploy

# Stop local devnet
npm run devnet:stop
```

### **Testnet Deployment**
```bash
# Deploy to testnet
npm run testnet:deploy

# Or use Node.js script
node deploy.js
```

## 🔑 **Step 1: Get Your Private Key**

1. **Open Leather Wallet**
2. **Go to Settings** → **Export Private Key**
3. **Copy the hex key** (starts with `0x`)
4. **Create .env file**:
   ```bash
   cp env.example .env
   # Edit .env and add your private key
   ```

## 🪙 **Step 2: Get Testnet STX**

1. **Visit**: https://faucet.testnet4.stacks.co/
2. **Enter your address**: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
3. **Request STX tokens** (1000 STX)
4. **Wait for confirmation** (5-10 minutes)

## 🚀 **Step 3: Deploy to Testnet**

### **Option A: Using Clarinet (Recommended)**
```bash
# Make sure you have STX and private key set up
npm run testnet:deploy
```

### **Option B: Using Node.js Script**
```bash
# Set up .env file with your private key
node deploy.js
```

### **Option C: Manual Deployment**
```bash
npx @stacks/cli deploy_contract \
  contracts/invoice-factoring-v2.clar \
  invoice-factoring-v2 \
  1000 \
  0 \
  'YOUR_PRIVATE_KEY_HERE'
```

## 📋 **Step 4: Update Your Frontend**

After successful deployment, update your frontend:

1. **Get the contract address** from deployment output
2. **Update `src/hooks/use-smart-contract.ts`**:
   ```typescript
   const CONTRACT_ADDRESS = 'YOUR_ADDRESS.invoice-factoring-v2';
   ```

## 🧪 **Step 5: Test Your Contract**

### **Using Clarinet Console**
```bash
npm run console
```

Then test functions:
```clarity
;; Create an invoice
(create-invoice u1000 u100)

;; Fund an invoice
(fund-invoice u1 u1000)

;; Check invoice details
(get-invoice-details u1)
```

### **Using Your Frontend**
1. **Go to**: http://localhost:9002
2. **Navigate to**: Marketplace → Blockchain Actions
3. **Test the functions** through the UI

## 🔗 **Useful Links**

- **Testnet4 Explorer**: https://explorer.testnet4.stacks.co/
- **Testnet4 Faucet**: https://faucet.testnet4.stacks.co/
- **Your Address**: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
- **Clarinet Docs**: https://docs.hiro.so/clarinet/

## 📊 **Contract Functions**

### **Public Functions**
- `(create-invoice (amount uint) (due-date uint))` - Create new invoice
- `(fund-invoice (invoice-id uint) (amount uint))` - Fund an invoice
- `(settle-invoice (invoice-id uint))` - Settle an invoice
- `(claim-overdue-invoice (invoice-id uint))` - Claim overdue invoice

### **Read-Only Functions**
- `(get-invoice-counter)` - Get total invoice count
- `(get-invoice-details (invoice-id uint))` - Get invoice details
- `(get-invoice-status-string (invoice-id uint))` - Get status as string
- `(is-business-invoice (invoice-id uint) (business principal))` - Check ownership
- `(is-invoice-overdue (invoice-id uint))` - Check if overdue

## 🎯 **Quick Start**

1. **Get your private key** from Leather Wallet
2. **Get STX tokens** from faucet
3. **Deploy contract**: `npm run testnet:deploy`
4. **Update frontend** with new contract address
5. **Test functions** via console or frontend

## 🛡️ **Security Notes**

- **Never commit .env file** - Add it to .gitignore
- **Use different keys** for testnet vs mainnet
- **Keep private keys secure** - consider hardware wallets for mainnet
- **Test thoroughly** on testnet before mainnet deployment

## 🎉 **Success Indicators**

- ✅ Contract deploys without errors
- ✅ Transaction appears on explorer
- ✅ Frontend shows "Contract Deployed"
- ✅ Functions work in console and frontend
- ✅ STX transfers execute successfully

Your invoice factoring contract is ready to revolutionize blockchain finance! 🚀

