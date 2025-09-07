const { StacksTestnet } = require('@stacks/network');
const { broadcastTransaction, makeContractDeploy, AnchorMode } = require('@stacks/transactions');
const { readFileSync } = require('fs');
require('dotenv').config();

async function deployContract() {
  console.log('🚀 Deploying Invoice Factoring Contract to Testnet4...');
  
  // Check if private key is set
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not found in .env file');
    console.log('Please create a .env file with your private key:');
    console.log('PRIVATE_KEY=your_private_key_here');
    return;
  }

  try {
    const network = new StacksTestnet();
    
    // Read contract file
    const contractCode = readFileSync('./contracts/invoice-factoring-v2.clar', 'utf8');
    
    console.log('📄 Contract loaded successfully');
    console.log('🔗 Network: Testnet4');
    
    const txOptions = {
      contractName: 'invoice-factoring-v2',
      codeBody: contractCode,
      senderKey: process.env.PRIVATE_KEY,
      network,
      anchorMode: AnchorMode.Any,
    };

    console.log('📝 Creating deployment transaction...');
    const transaction = await makeContractDeploy(txOptions);
    
    console.log('📡 Broadcasting transaction...');
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    console.log('✅ Deployment successful!');
    console.log('📋 Transaction ID:', broadcastResponse.txid);
    console.log('🔍 Explorer URL:', `https://explorer.testnet4.stacks.co/txid/${broadcastResponse.txid}`);
    console.log('📋 Contract Address:', `${transaction.payload.contractName.contractId.split('.')[0]}.invoice-factoring-v2`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Update src/hooks/use-smart-contract.ts with the new contract address');
    console.log('2. Test your contract functions');
    console.log('3. Update your frontend to use the deployed contract');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have sufficient STX balance');
    console.log('2. Verify your private key is correct');
    console.log('3. Check that you\'re connected to Testnet4');
  }
}

deployContract().catch(console.error);

