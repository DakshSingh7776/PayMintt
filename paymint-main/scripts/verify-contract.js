const https = require('https');

// Contract details
const CONTRACT_ADDRESS = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS.invoice-factoring-v2';
const CONTRACT_NAME = 'invoice-factoring-v2';

// Testnet4 API endpoints
const API_ENDPOINTS = [
  'https://api.testnet.hiro.so',
  'https://testnet-api.stacks.co'
];

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function checkContractDeployment() {
  console.log('🔍 Checking Smart Contract Deployment...\n');
  console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`Contract Name: ${CONTRACT_NAME}`);
  console.log(`Network: Testnet4\n`);

  for (const endpoint of API_ENDPOINTS) {
    console.log(`📡 Testing endpoint: ${endpoint}`);
    
    try {
      // Test 1: Check if contract exists
      const contractUrl = `${endpoint}/v2/contracts/${CONTRACT_ADDRESS}`;
      console.log(`   Checking contract existence...`);
      
      const contractData = await makeRequest(contractUrl);
      
      if (contractData && contractData.tx_status === 'success') {
        console.log(`   ✅ Contract found and deployed successfully!`);
        console.log(`   📄 Contract source available`);
        
        // Test 2: Try to read contract data
        const readUrl = `${endpoint}/v2/contracts/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-invoice-counter`;
        console.log(`   Testing read function: get-invoice-counter`);
        
        try {
          const readData = await makeRequest(readUrl);
          console.log(`   ✅ Read function working! Counter: ${readData.result || '0'}`);
        } catch (readError) {
          console.log(`   ⚠️  Read function failed: ${readError.message}`);
        }
        
        // Test 3: Get contract source
        const sourceUrl = `${endpoint}/v2/contracts/${CONTRACT_ADDRESS}/source`;
        console.log(`   Fetching contract source...`);
        
        try {
          const sourceData = await makeRequest(sourceUrl);
          if (sourceData && sourceData.source) {
            console.log(`   ✅ Contract source retrieved successfully`);
            console.log(`   📝 Source length: ${sourceData.source.length} characters`);
          }
        } catch (sourceError) {
          console.log(`   ⚠️  Failed to get source: ${sourceError.message}`);
        }
        
        console.log(`\n🎉 Contract is properly deployed and accessible!`);
        return true;
        
      } else {
        console.log(`   ❌ Contract not found or deployment failed`);
        console.log(`   📊 Status: ${contractData?.tx_status || 'Unknown'}`);
      }
      
    } catch (error) {
      console.log(`   ❌ API request failed: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('❌ Contract deployment verification failed on all endpoints');
  return false;
}

async function checkAccountBalance() {
  console.log('💰 Checking Account Balance...\n');
  
  const accountAddress = 'STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS';
  
  for (const endpoint of API_ENDPOINTS) {
    console.log(`📡 Checking balance via: ${endpoint}`);
    
    try {
      const balanceUrl = `${endpoint}/extended/v1/address/${accountAddress}/balances`;
      const balanceData = await makeRequest(balanceUrl);
      
      if (balanceData && balanceData.stx) {
        const stxBalance = balanceData.stx.balance / 1000000; // Convert from microSTX
        console.log(`   ✅ STX Balance: ${stxBalance.toFixed(6)} STX`);
        
        if (stxBalance > 0) {
          console.log(`   💚 Account has sufficient balance for transactions`);
        } else {
          console.log(`   ⚠️  Account has no STX balance`);
        }
        
        return stxBalance;
      }
      
    } catch (error) {
      console.log(`   ❌ Failed to get balance: ${error.message}`);
    }
    
    console.log('');
  }
  
  return 0;
}

async function main() {
  console.log('🚀 Smart Contract Verification Tool\n');
  console.log('=' .repeat(50));
  
  // Check account balance first
  const balance = await checkAccountBalance();
  
  console.log('\n' + '=' .repeat(50));
  
  // Check contract deployment
  const deployed = await checkContractDeployment();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 SUMMARY:');
  console.log(`   Account Balance: ${balance.toFixed(6)} STX`);
  console.log(`   Contract Deployed: ${deployed ? '✅ Yes' : '❌ No'}`);
  
  if (deployed && balance > 0) {
    console.log('\n🎉 Everything is ready! Your contract is deployed and account has balance.');
    console.log('   You can now use the frontend to interact with your smart contract.');
  } else if (!deployed) {
    console.log('\n⚠️  Contract is not deployed. Please deploy the contract first:');
    console.log('   1. Navigate to the invoice-factoring directory');
    console.log('   2. Run: npm run testnet:deploy');
    console.log('   3. Or use: node deploy.js');
  } else if (balance === 0) {
    console.log('\n⚠️  Account has no STX balance. Please get some Testnet4 STX:');
    console.log('   1. Visit: https://faucet.testnet.stacks.co');
    console.log('   2. Enter your address: STM0TT7J971S64YRJWNM387B40G69NS9QM7F59WS');
    console.log('   3. Request Testnet4 STX tokens');
  }
  
  console.log('\n' + '=' .repeat(50));
}

// Run the verification
main().catch(console.error);

