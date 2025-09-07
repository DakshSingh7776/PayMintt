# PayMint Demo Guide

## 🎯 **Complete Demo Script: "Invoice Factoring on Stacks Blockchain"**

### **📋 Pre-Demo Setup**

1. **Start the App**:
   ```bash
   npm run dev
   ```
   - App runs on: **http://localhost:9002**

2. **Prepare Demo Data**:
   - Make sure you have some test STX in your Testnet4 wallet
   - Have your Leather wallet ready (or use demo mode)

---

## **🎬 Demo Flow (15-20 minutes)**

### **Step 1: Introduction (2 minutes)**
```
"Welcome to PayMint - a revolutionary invoice factoring platform built on the Stacks blockchain. 
Today I'll show you how businesses can tokenize their invoices and investors can fund them 
using smart contracts, all while maintaining transparency and security."
```

### **Step 2: Landing Page & Value Proposition (1 minute)**
1. **Open**: http://localhost:9002
2. **Highlight**:
   - "Modern, professional UI built with Next.js 15"
   - "Blockchain-powered invoice factoring"
   - "Real-time dashboard with AI insights"

### **Step 3: Role-Based Signup Demo (3 minutes)**
**🎯 NEW FEATURE: Automatic Role Detection**

1. **Show Direct Role Links**:
   - **For Businesses**: Click "For Businesses → Upload Invoice"
   - **For Investors**: Click "For Investors → Start Investing"
   
2. **Demonstrate URL Parameters**:
   - **Business Signup**: `http://localhost:9002/signup?role=business`
   - **Lender Signup**: `http://localhost:9002/signup?role=lender`
   
3. **Show Automatic Redirection**:
   - "Notice how the URL automatically detects the role and skips the selection step"
   - "This provides a seamless onboarding experience for different user types"

4. **Fill Out Signup Form**:
   - Show different fields for Business vs Lender
   - Business: Company name, GSTIN number
   - Lender: Personal name, investment preferences

### **Step 4: Authentication Demo (1 minute)**
1. **Click "Login"**
2. **Login with**:
   - Email: `business@example.com`
   - Password: `business123`
   - Role: Business
3. **Show**: "Secure authentication with role-based access"

### **Step 5: Wallet Integration Demo (2 minutes)**
1. **Go to Dashboard**
2. **Click "Connect Wallet"**
3. **Highlight**:
   - "Seamless Leather wallet integration"
   - "Real Testnet4 address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS"
   - "Live balance fetching from Stacks API"
   - "Network detection and explorer links"

### **Step 6: Dashboard Overview (2 minutes)**
1. **Show Dashboard Features**:
   - "Real-time financial metrics"
   - "AI-powered insights and recommendations"
   - "Wallet status with Testnet4 integration"
   - "Quick actions for invoice management"

### **Step 7: Invoice Upload & AI Processing (3 minutes)**
1. **Navigate to "Upload" page**
2. **Upload a sample invoice** (PDF/Image)
3. **Highlight AI Features**:
   - "OCR-powered data extraction using Google AI"
   - "Automatic invoice parsing and validation"
   - "Smart contract integration ready"

### **Step 8: Marketplace Demo (3 minutes)**
1. **Go to "Marketplace"**
2. **Show Features**:
   - "Browse available invoices for funding"
   - "Real-time pricing and risk assessment"
   - "Blockchain-powered transparency"

### **Step 9: Smart Contract Payment System Demo (4 minutes)**
1. **Navigate to "Smart Payments" in the sidebar**
2. **Demonstrate Smart Contract Functions**:

   **A. Create Invoice**:
   - Go to "Smart Payments" page
   - Click "Create Invoice"
   - Set amount: 50 STX
   - Set due date: 30 days
   - "This creates a smart contract on Stacks Testnet4"

   **B. Fund Invoice**:
   - Go to "Marketplace" tab
   - Click "Fund Invoice" on available invoices
   - Set funding amount: 25 STX
   - "Investors can partially or fully fund invoices"

   **C. Settle Invoice**:
   - Go to "My Invoices" tab
   - Click "Settle Invoice" on funded invoices
   - "Automatic payment distribution via smart contract"

### **Step 10: Technical Architecture (2 minutes)**
1. **Show Code Structure**:
   ```bash
   # Open terminal and show:
   ls src/
   # Highlight:
   - contexts/WalletContext.tsx (Blockchain integration)
   - hooks/use-smart-contract.ts (Smart contract calls)
   - contracts/invoice-factoring.clar (Clarity smart contract)
   ```

### **Step 11: Advanced Features (2 minutes)**
1. **Navigate through**:
   - **Crypto Page**: "Real-time cryptocurrency data"
   - **My Investments**: "Portfolio tracking"
   - **Pool**: "Liquidity pool management"
   - **Trusted Buyers**: "KYC/KYB integration"

### **Step 12: Admin Panel (1 minute)**
1. **Switch to Admin View**:
   - URL: `http://localhost:9002/admin`
   - Login: `admin@example.com` / `admin123`
2. **Show**:
   - "Compliance monitoring"
   - "Transaction analytics"
   - "User management"

---

## **🎪 Interactive Demo Scenarios**

### **Scenario 1: Business Owner Journey**
```
"As a business owner, I need immediate cash flow..."
```
1. **Landing Page**: Click "For Businesses → Upload Invoice"
2. **Signup**: `http://localhost:9002/signup?role=business`
3. **Upload Invoice**: Show AI processing
4. **Get Funded**: Demonstrate marketplace funding

### **Scenario 2: Investor Journey**
```
"As an investor, I want to fund invoices for returns..."
```
1. **Landing Page**: Click "For Investors → Start Investing"
2. **Signup**: `http://localhost:9002/signup?role=lender`
3. **Browse Marketplace**: Show available invoices
4. **Fund Invoice**: Use Smart Payments system

### **Scenario 3: Compliance Officer**
```
"As a compliance officer, I need transparency..."
```
1. **Admin Panel**: `http://localhost:9002/admin`
2. **Show Monitoring**: Transaction tracking
3. **KYC/KYB**: User verification process

---

## **🔗 Quick Demo Links**

### **Main App Links**:
- **Landing Page**: http://localhost:9002
- **Business Signup**: http://localhost:9002/signup?role=business
- **Lender Signup**: http://localhost:9002/signup?role=lender
- **Login**: http://localhost:9002/login
- **Admin Panel**: http://localhost:9002/admin

### **External Links**:
- **Testnet4 Explorer**: https://explorer.testnet4.stacks.co
- **Testnet4 Faucet**: https://faucet.testnet4.stacks.co
- **Leather Wallet**: https://leather.io/

### **Test Credentials**:
- **Business**: `business@example.com` / `business123`
- **Lender**: `lender@example.com` / `lender123`
- **Admin**: `admin@example.com` / `admin123`

---

## **📊 Key Demo Points to Emphasize**

### **🚀 Technical Innovation**
- **Role-Based Signup**: Automatic role detection via URL parameters
- **Blockchain Integration**: Real Stacks Testnet4 integration
- **Smart Contracts**: Clarity language for invoice factoring
- **AI/ML**: Google AI for invoice processing
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS

### **💼 Business Value**
- **Liquidity**: Businesses get immediate cash flow
- **Transparency**: All transactions on blockchain
- **Security**: Smart contract escrow
- **Accessibility**: Web-based platform
- **User Experience**: Seamless role-based onboarding

### **🔧 Developer Experience**
- **Clean Code**: Well-structured React components
- **Type Safety**: Full TypeScript implementation
- **Documentation**: Comprehensive guides and setup
- **Scalability**: Modular architecture

---

## **🎯 Demo Tips**

### **Before the Demo**:
1. **Test Everything**: Ensure all features work
2. **Prepare Script**: Have talking points ready
3. **Check Wallet**: Make sure Leather wallet is connected
4. **Clear Cache**: Hard refresh the browser

### **During the Demo**:
1. **Start Simple**: Begin with familiar concepts
2. **Show Real Data**: Use actual Testnet4 addresses
3. **Explain Benefits**: Focus on business value
4. **Handle Questions**: Be prepared for technical questions

### **Demo Flow**:
```
Landing → Role Signup → Login → Dashboard → Wallet → Upload → Marketplace → Blockchain → Admin
```

---

## **🎪 Demo Conclusion**

```
"PayMint demonstrates the future of invoice factoring - combining traditional 
business needs with blockchain technology. The platform provides immediate 
liquidity for businesses while offering transparent investment opportunities 
for investors, all secured by smart contracts on the Stacks blockchain.

Key innovations include:
- Role-based signup with automatic detection
- Real-time blockchain integration
- AI-powered invoice processing
- Smart contract automation
- Comprehensive compliance monitoring"
```

---

## **📱 Demo Checklist**

- [ ] App running on http://localhost:9002
- [ ] Test role-based signup URLs
- [ ] Verify wallet connection
- [ ] Test blockchain actions
- [ ] Show admin panel
- [ ] Demonstrate AI features
- [ ] Explain technical architecture
- [ ] Handle Q&A session

**This demo should take about 15-20 minutes and covers all the key features of your PayMint application!** 🚀
