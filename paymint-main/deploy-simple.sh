#!/bin/bash

echo "🚀 Simple Contract Deployment to Testnet4"

# Check if contract exists
if [ ! -f "contracts/invoice-factoring.clar" ]; then
    echo "❌ Contract file not found"
    exit 1
fi

echo "✅ Contract file found: contracts/invoice-factoring.clar"

# Set the private key from mnemonic
echo "🔑 Setting up wallet from mnemonic..."
export STACKS_PRIVATE_KEY="loop stomach vast measure scene idea salmon spawn satisfy crater crane art erase fog sauce access tunnel deal basket utility material cloud shock impose"

echo "📋 Contract Details:"
echo "   - Contract: invoice-factoring"
echo "   - Network: Testnet4"
echo "   - File: contracts/invoice-factoring.clar"

echo ""
echo "🔧 Manual Deployment Steps:"
echo ""
echo "1. Install Stacks CLI manually:"
echo "   Visit: https://docs.stacks.co/build-apps/references/cli"
echo ""
echo "2. Or use Clarinet (already installed):"
echo "   clarinet deployments apply --config=clarinet.toml --network=testnet4"
echo ""
echo "3. Or deploy manually with:"
echo "   stacks deploy testnet4 contracts/invoice-factoring.clar"
echo ""
echo "📝 Your mnemonic is set as environment variable:"
echo "   STACKS_PRIVATE_KEY=\"loop stomach vast measure scene idea salmon spawn satisfy crater crane art erase fog sauce access tunnel deal basket utility material cloud shock impose\""
echo ""
echo "🎯 Next Steps:"
echo "1. Get Testnet4 STX from: https://faucet.testnet4.stacks.co/"
echo "2. Deploy using one of the methods above"
echo "3. Update contract address in src/hooks/use-smart-contract.ts"

