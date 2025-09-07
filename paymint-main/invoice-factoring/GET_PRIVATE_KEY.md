# 🔑 How to Get Your Private Key from Leather Wallet

## Step 1: Open Leather Wallet
1. Open your Leather Wallet browser extension
2. Make sure you're connected to **Testnet4** network

## Step 2: Access Settings
1. Click on the gear icon (⚙️) in the top right corner
2. Select "Settings" from the dropdown menu

## Step 3: Export Private Key
1. In Settings, scroll down to find "Export Private Key"
2. Click on "Export Private Key"
3. Enter your wallet password when prompted
4. **Copy the private key** (it should start with `0x` and be 64 characters long)

## Step 4: Create .env File
1. In the `invoice-factoring` directory, create a file named `.env`
2. Add your private key like this:
```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
NETWORK=testnet4
CONTRACT_NAME=invoice-factoring-v2
```

## Step 5: Get Testnet4 STX
1. Go to: https://faucet.testnet4.stacks.co
2. Enter your wallet address: `STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS`
3. Request test STX tokens

## Step 6: Deploy Contract
Once you have the .env file with your private key, run:
```bash
node deploy.js
```

## ⚠️ Security Warning
- **NEVER share your private key with anyone**
- **NEVER commit the .env file to git**
- **Keep your private key secure**

## Alternative Method (If Export Doesn't Work)
If you can't export the private key from Leather, you can:
1. Use the mnemonic phrase to generate the private key
2. Or use the Stacks CLI with your mnemonic phrase

## Need Help?
If you're having trouble getting your private key, let me know and I can help you with alternative methods.

