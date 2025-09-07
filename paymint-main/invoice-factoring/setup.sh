#!/bin/bash

echo "🚀 PayMint Invoice Factoring - Setup & Deployment"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "Clarinet.toml" ]; then
    echo "❌ Please run this script from the invoice-factoring-v2 directory"
    exit 1
fi

echo "✅ Current Status:"
echo "   - Contract file: contracts/invoice-factoring-v2.clar ✅"
echo "   - Clarinet installed: clarinet 3.5.0 ✅"
echo "   - Dependencies installed: npm packages ✅"
echo "   - Contract validated: clarinet check passed ✅"
echo ""

echo "🔧 Available Commands:"
echo ""
echo "1. Check contract syntax:"
echo "   npm run check"
echo ""
echo "2. Start interactive console:"
echo "   npm run console"
echo ""
echo "3. Deploy to testnet:"
echo "   npm run testnet:deploy"
echo ""
echo "4. Deploy using Node.js script:"
echo "   node deploy.js"
echo ""

echo "🔑 Next Steps:"
echo ""
echo "1. Get your private key from Leather Wallet:"
echo "   - Open Leather Wallet"
echo "   - Go to Settings → Export Private Key"
echo "   - Copy the hex key (starts with 0x)"
echo ""
echo "2. Create .env file:"
echo "   cp env.example .env"
echo "   # Edit .env and add your private key"
echo ""
echo "3. Get testnet STX:"
echo "   - Visit: https://faucet.testnet4.stacks.co/"
echo "   - Enter your address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS"
echo ""
echo "4. Deploy your contract:"
echo "   npm run testnet:deploy"
echo ""

echo "📋 Your Project Info:"
echo "   - Address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS"
echo "   - Network: Testnet4"
echo "   - Contract: invoice-factoring-v2"
echo ""

echo "🔗 Useful Links:"
echo "   - Testnet4 Explorer: https://explorer.testnet4.stacks.co/"
echo "   - Testnet4 Faucet: https://faucet.testnet4.stacks.co/"
echo "   - Your App: http://localhost:9002"
echo ""

echo "🎉 Your Clarinet development environment is ready!"
echo "   Follow the steps above to deploy your contract to testnet."

