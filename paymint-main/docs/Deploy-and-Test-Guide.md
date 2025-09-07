# 🚀 Deploy & Test Your Invoice Factoring Contract

## 📋 Prerequisites

1. **Stacks CLI installed**
2. **Leather Wallet with Testnet4 STX**
3. **Your Testnet4 address**: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`

## 🎯 Step 1: Deploy Contract

### **Method 1: Using Stacks CLI**

```bash
# Install Stacks CLI if not installed
curl -sL https://stacks.sh | bash

# Set your private key (replace with your actual private key)
export STACKS_PRIVATE_KEY="your-private-key-here"

# Deploy to Testnet4
stacks deploy testnet4 contracts/invoice-factoring.clar
```

### **Method 2: Using Clarinet (Alternative)**

```bash
# Generate deployment plan
clarinet deployments generate --testnet

# Apply deployment
clarinet deployments apply --testnet
```

## 🎯 Step 2: Get Contract Address

After deployment, you'll get a contract address like:
```
Contract deployed at: ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring
```

## 🎯 Step 3: Test with Leather Wallet

### **Setup Testnet4 in Leather:**

1. Open Leather Wallet
2. Go to Settings → Networks
3. Add Testnet4 network
4. Switch to Testnet4
5. Get some test STX from faucet

### **Test Transaction Flow:**

#### **Scene 1: Business Creates Invoice**

```clarity
;; Contract Call: Create Invoice
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  create-invoice 
  u1000000000  ;; 1000 STX (1,000,000,000 microSTX)
  u100         ;; Due in 100 blocks
)
```

**Expected Result:** `(ok u1)` - Invoice #1 created

#### **Scene 2: Lender Funds Invoice**

```clarity
;; Contract Call: Fund Invoice
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  fund-invoice 
  u1           ;; Invoice ID
  u1000000000  ;; 1000 STX
)
```

**Expected Result:** `(ok true)` - Invoice funded, STX transferred

#### **Scene 3: Business Settles Invoice**

```clarity
;; Contract Call: Settle Invoice
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  settle-invoice 
  u1           ;; Invoice ID
)
```

**Expected Result:** `(ok true)` - Invoice settled, STX repaid

## 🎯 Step 4: Frontend Integration

### **Update Your Smart Contract Hook:**

```typescript
// src/hooks/use-smart-contract.ts
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring';

export const useSmartContract = () => {
  const createInvoice = async (amount: number, dueDate: number) => {
    const leather = (window as any).LeatherProvider;
    return await leather.request('contractCall', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'invoice-factoring',
      functionName: 'create-invoice',
      functionArgs: [amount.toString(), dueDate.toString()],
      network: 'testnet4'
    });
  };

  const fundInvoice = async (invoiceId: number, amount: number) => {
    const leather = (window as any).LeatherProvider;
    return await leather.request('contractCall', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'invoice-factoring',
      functionName: 'fund-invoice',
      functionArgs: [invoiceId.toString(), amount.toString()],
      network: 'testnet4'
    });
  };

  const settleInvoice = async (invoiceId: number) => {
    const leather = (window as any).LeatherProvider;
    return await leather.request('contractCall', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'invoice-factoring',
      functionName: 'settle-invoice',
      functionArgs: [invoiceId.toString()],
      network: 'testnet4'
    });
  };

  return { createInvoice, fundInvoice, settleInvoice };
};
```

## 🎯 Step 5: Demo Script

### **Complete Demo Flow:**

```
"Let me demonstrate our Invoice Factoring Smart Contract with real transactions.

First, I'll create an invoice as a business:
- Amount: 1000 STX
- Due Date: 100 blocks from now
- Status: Created

Next, I'll fund this invoice as a lender:
- Transfer: 1000 STX from lender to business
- Status: Funded
- Transaction visible on blockchain

Finally, I'll settle the invoice as the business:
- Repayment: 1000 STX from business to lender
- Status: Settled
- Complete lifecycle achieved

Watch the STX balance changes in real-time!"
```

## 🎯 Step 6: Monitor Transactions

### **Check Transaction History:**

1. **Stacks Explorer**: https://explorer.testnet4.stacks.co/
2. **Your Address**: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
3. **Contract Address**: `ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring`

### **Expected Balance Changes:**

```
Business Wallet (STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS):
- Initial: 1000 STX
- After Funding: +1000 STX = 2000 STX
- After Settlement: -1000 STX = 1000 STX

Lender Wallet:
- Initial: 1000 STX
- After Funding: -1000 STX = 0 STX
- After Settlement: +1000 STX = 1000 STX
```

## 🎯 Step 7: Advanced Features

### **Query Functions:**

```clarity
;; Get invoice details
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  get-invoice-details u1)

;; Get invoice counter
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  get-invoice-counter)

;; Check if invoice is overdue
(contract-call? 'ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1.invoice-factoring 
  is-invoice-overdue u1)
```

## 🎯 Troubleshooting

### **Common Issues:**

1. **Insufficient STX**: Get test STX from faucet
2. **Network Issues**: Ensure Testnet4 is selected
3. **Contract Not Found**: Verify deployment address
4. **Transaction Failed**: Check error codes in contract

### **Error Codes:**
- `ERR_INVALID_AMOUNT (u1)`: Amount must be > 0
- `ERR_INVALID_DUE_DATE (u2)`: Due date must be in future
- `ERR_INVOICE_NOT_FOUND (u3)`: Invoice doesn't exist
- `ERR_INVALID_STATUS (u4)`: Wrong invoice status
- `ERR_AMOUNT_MISMATCH (u5)`: Funding amount doesn't match
- `ERR_TRANSFER_FAILED (u6)`: STX transfer failed
- `ERR_NOT_FUNDED (u7)`: Invoice not funded
- `ERR_UNAUTHORIZED (u8)`: Not authorized to perform action
- `ERR_REPAYMENT_FAILED (u9)`: Repayment transfer failed
- `ERR_NO_LENDER (u10)`: No lender found

---

**This guide will help you deploy and test your contract with real transactions!** 🚀

