#!/bin/bash

echo "🚀 PayMint Invoice Factoring Contract - Testnet4 Deployment"
echo "=========================================================="
echo ""

# Check if contract exists
if [ ! -f "contracts/invoice-factoring.clar" ]; then
    echo "❌ Contract file not found at contracts/invoice-factoring.clar"
    exit 1
fi

echo "✅ Contract file found: contracts/invoice-factoring.clar"
echo ""

echo "🔑 Step 1: Get Your Private Key"
echo "   - Open Leather Wallet"
echo "   - Go to Settings → Export Private Key"
echo "   - Copy the hex key (starts with 0x)"
echo ""

echo "🪙 Step 2: Get Testnet4 STX"
echo "   - Visit: https://faucet.testnet4.stacks.co/"
echo "   - Enter your address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS"
echo "   - Request STX tokens"
echo ""

echo "📋 Step 3: Deploy Contract"
echo "   Once you have your private key and STX tokens, run:"
echo ""
echo "   npx @stacks/cli deploy_contract \\"
echo "     contracts/invoice-factoring.clar \\"
echo "     invoice-factoring \\"
echo "     1000 \\"
echo "     0 \\"
echo "     'YOUR_PRIVATE_KEY_HERE'"
echo ""

echo "🎯 Step 4: Update Contract Address"
echo "   After successful deployment, update:"
echo "   src/hooks/use-smart-contract.ts"
echo ""

echo "🔗 Useful Links:"
echo "   - Testnet4 Explorer: https://explorer.testnet4.stacks.co/"
echo "   - Testnet4 Faucet: https://faucet.testnet4.stacks.co/"
echo "   - Your Address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS"
echo ""

echo "💡 Tips:"
echo "   - Make sure you have at least 1000 STX"
echo "   - Private key should be 64 hex characters"
echo "   - Keep your private key secure"
echo ""

echo "🎉 Ready to deploy your revolutionary invoice factoring contract!"

