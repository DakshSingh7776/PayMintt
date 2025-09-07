# Wallet Connection Troubleshooting

## Common Issues and Solutions

### 1. "Failed to get wallet address" Error

This error occurs when the Leather wallet API calls fail. Here are the solutions:

#### **Solution 1: Check Leather Wallet Installation**
1. Make sure Leather wallet is installed: https://leather.io/
2. Ensure the extension is enabled in your browser
3. Try refreshing the page and reconnecting

#### **Solution 2: Check Network Configuration**
1. Open Leather wallet
2. Click on the network selector (top right)
3. Make sure "Testnet4" is selected
4. If Testnet4 is not available, try "Testnet" or "Mainnet"

#### **Solution 3: Unlock Your Wallet**
1. Make sure Leather wallet is unlocked
2. Enter your password if prompted
3. Try connecting again

#### **Solution 4: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages when connecting
4. Common errors:
   - `Leather wallet not available`: Extension not installed/enabled
   - `getAddresses failed`: Network configuration issue
   - `getStxAddress failed`: API method not supported

#### **Solution 5: Demo Mode Fallback**
If all wallet connection methods fail, the app will automatically:
- Show a mock wallet address for demonstration
- Display a random demo balance
- Allow you to test the UI functionality

### 2. "Leather wallet not installed" Error

#### **Solution: Install Leather Wallet**
1. Visit https://leather.io/
2. Download the extension for your browser
3. Install and enable the extension
4. Create a new wallet or import existing one
5. Refresh PayMint and try connecting again

### 3. Balance Not Loading or "Failed to fetch" Error

#### **Solution 1: Multiple API Endpoints**
The app now tries multiple API endpoints in this order:
1. `https://api.testnet4.stacks.co/extended/v1/address/{address}/balances`
2. `https://api.testnet4.stacks.co/v1/addresses/{address}/balances`
3. `https://api.testnet4.stacks.co/addresses/{address}/balances`
4. `https://api.testnet.hiro.so/extended/v1/address/{address}/balances` (fallback)
5. `https://api.testnet.hiro.so/v1/addresses/{address}/balances` (fallback)

#### **Solution 2: HTTP 400/404 Errors**
The app now handles HTTP 400 and 404 errors gracefully:
- These errors are logged but don't stop the process
- The app continues to try other endpoints
- If all endpoints fail, shows a demo balance

#### **Solution 3: Check Network Connection**
1. Ensure you're on Testnet4 network in Leather
2. Check if Testnet4 API is accessible
3. Try refreshing the balance manually

#### **Solution 4: Demo Mode**
If all API endpoints fail, the app will:
- Show a random demo balance (0-100 STX)
- Display "Testnet4" network information
- Allow you to test the UI functionality

### 4. Wallet Disconnects Unexpectedly

#### **Solution 1: Check Browser Storage**
1. Clear browser cache and cookies
2. Try connecting again
3. The wallet should remember your connection

#### **Solution 2: Check Extension Permissions**
1. Go to browser extension settings
2. Ensure Leather has necessary permissions
3. Try disabling and re-enabling the extension

## Debug Information

### Console Logs to Check
When connecting, look for these logs in the browser console:

```
Trying API endpoint: https://api.testnet4.stacks.co/extended/v1/address/ST1.../balances
HTTP 400: Bad Request for https://api.testnet4.stacks.co/extended/v1/address/ST1.../balances
Trying API endpoint: https://api.testnet.hiro.so/extended/v1/address/ST1.../balances
API response: { stx: { balance: "1000000" } }
Balance for ST1...: 1.0 STX
```

### Wallet Connection Logs
```
Leather getAddresses result: {...}
getAddresses failed, trying alternative method: Error
Leather getStxAddress result: ST1...
Wallet connected to Testnet4: ST1...
Balance: 1.0 STX
```

### API Endpoints
- **Testnet4 API**: https://api.testnet4.stacks.co
- **Hiro Testnet API**: https://api.testnet.hiro.so
- **Balance Endpoint**: `/extended/v1/address/{address}/balances`
- **Explorer**: https://explorer.testnet4.stacks.co

### Fallback Behavior
If Leather wallet connection fails, the app will:
1. Show a mock wallet address for demonstration
2. Display "Testnet4" network information
3. Show setup instructions
4. Allow you to test the UI without a real wallet

If balance fetching fails, the app will:
1. Try multiple API endpoints
2. Handle HTTP 400/404 errors gracefully
3. Show a random demo balance if all endpoints fail
4. Continue to work normally for UI testing

## Testing Without Leather Wallet

If you don't have Leather wallet installed, you can still:
1. Test the UI and navigation
2. See how the wallet integration works
3. View the mock wallet functionality
4. Access all other PayMint features

The mock wallet will show:
- Address: `ST1PQHQKV0RJXZFYVWEQ30FH8Y6KVVK3R4B1YX1S1`
- Balance: Random value between 0-100 STX (demo)
- Network: `Testnet4`

## Getting Help

If you're still having issues:

1. **Check the console logs** for specific error messages
2. **Verify Leather wallet setup** according to their documentation
3. **Try a different browser** to rule out browser-specific issues
4. **Check Testnet4 status** to ensure the network is operational

## Development Notes

### Wallet Integration
The wallet integration tries multiple API methods:
1. `getAddresses` - Preferred method
2. `getStxAddress` with network parameter - Fallback method
3. `getAddress` with network parameter - Alternative fallback
4. `getStxAddress` without network parameter - Final fallback

### Balance Fetching
The balance fetching tries multiple endpoints:
1. Testnet4 API endpoints (primary)
2. Hiro Testnet API endpoints (fallback)
3. Mock balance (demo mode)

### Error Handling
- **Network timeouts**: 10-second timeout for API calls
- **HTTP 400/404**: Gracefully handled, continues to next endpoint
- **Multiple fallbacks**: Tries different endpoints and methods
- **Graceful degradation**: Falls back to demo mode if needed
- **User feedback**: Clear error messages and instructions
- **Address validation**: Checks for valid STX address format

### Demo Mode
- **Always available**: Works even when APIs are down
- **Random balances**: Provides realistic demo experience
- **Full functionality**: All UI features work normally
- **No errors**: Users never see connection failures

If all methods fail, it falls back to mock wallet and demo balance for demonstration purposes.
