# Leather Wallet Integration Setup

## Overview

PayMint now includes full Leather Wallet (Stacks) integration for connecting to the Stacks blockchain. This allows users to:

- Connect their Leather wallet to the platform
- View wallet balance and address
- Sign transactions for invoice funding
- Interact with smart contracts (future feature)

## Features Implemented

### ✅ Wallet Connection
- Connect/disconnect Leather wallet
- Display wallet address and balance
- Network detection (Testnet/Mainnet)
- Connection status persistence

### ✅ UI Components
- `WalletConnectButton` - Main wallet connection button in navbar
- `WalletStatus` - Detailed wallet information card in dashboard
- Toast notifications for connection events

### ✅ Context Management
- `WalletContext` - Global wallet state management
- Automatic connection status checking
- Balance and address caching

## Setup Instructions

### 1. Install Dependencies

The required packages have been installed:
```bash
npm install @stacks/wallet-sdk @stacks/transactions @stacks/connect
```

### 2. Environment Configuration

Add these environment variables to your `.env.local`:

```env
# Stacks Network Configuration
NEXT_PUBLIC_STACKS_NETWORK=testnet  # or mainnet for production
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_STACKS_EXPLORER_URL=https://explorer.stacks.co
```

### 3. Leather Wallet Installation

Users need to install the Leather wallet browser extension:

1. **Chrome/Edge**: [Leather Wallet Extension](https://chrome.google.com/webstore/detail/leather/hmeobnfnfcmdkdcmlblgagmfpfboieaf)
2. **Firefox**: [Leather Wallet Extension](https://addons.mozilla.org/en-US/firefox/addon/leather/)

### 4. Testnet Setup

For development, users should:

1. Install Leather wallet extension
2. Create a new wallet or import existing one
3. Switch to **Testnet** network in Leather settings
4. Get test STX from the [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet)

## Usage

### For Users

1. **Connect Wallet**: Click "Connect Wallet" button in the navbar
2. **Authorize**: Approve the connection in Leather wallet popup
3. **View Status**: Check wallet status in the dashboard
4. **Disconnect**: Use the dropdown menu to disconnect

### For Developers

#### Using the Wallet Context

```tsx
import { useWallet } from '@/contexts/WalletContext';

function MyComponent() {
  const { 
    isConnected, 
    address, 
    connectWallet, 
    getBalance,
    signMessage 
  } = useWallet();

  const handleSignMessage = async () => {
    if (isConnected) {
      const signature = await signMessage("Hello PayMint!");
      console.log('Signature:', signature);
    }
  };

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

#### Adding Wallet Components

```tsx
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { WalletStatus } from '@/components/WalletStatus';

// In your layout or page
<WalletConnectButton />
<WalletStatus />
```

## Network Configuration

### Development (Testnet)
- Network: Stacks Testnet
- Explorer: https://explorer.stacks.co
- API: https://api.testnet.hiro.so
- Faucet: https://explorer.stacks.co/sandbox/faucet

### Production (Mainnet)
- Network: Stacks Mainnet
- Explorer: https://explorer.stacks.co
- API: https://api.hiro.so

## Security Considerations

1. **Connection Persistence**: Wallet connection state is managed locally
2. **No Private Key Storage**: Private keys never leave the user's wallet
3. **Transaction Signing**: All transactions are signed locally in Leather
4. **Network Validation**: App validates network compatibility

## Troubleshooting

### Common Issues

1. **"Wallet not found"**
   - Ensure Leather extension is installed
   - Check if extension is enabled
   - Refresh the page

2. **"Connection failed"**
   - Check network settings in Leather
   - Ensure correct network (testnet/mainnet)
   - Try disconnecting and reconnecting

3. **"Balance not loading"**
   - Check internet connection
   - Verify wallet has STX balance
   - Try refreshing the balance

### Debug Mode

Enable debug logging by adding to your component:

```tsx
const { isConnected, address } = useWallet();
console.log('Wallet state:', { isConnected, address });
```

## Future Enhancements

### Planned Features
- [ ] Smart contract interactions for invoice NFT minting
- [ ] Transaction history display
- [ ] Multi-signature wallet support
- [ ] Wallet backup and recovery
- [ ] Integration with other Stacks wallets

### Smart Contract Integration
```tsx
// Example future usage for NFT minting
const mintInvoiceNFT = async (invoiceData) => {
  if (!isConnected) return;
  
  const transaction = await createInvoiceNFTTransaction(invoiceData);
  const signedTx = await signTransaction(transaction);
  const txId = await broadcastTransaction(signedTx);
  
  return txId;
};
```

## Support

For issues with:
- **Leather Wallet**: [Leather Support](https://leather.io/support)
- **Stacks Network**: [Stacks Documentation](https://docs.stacks.co/)
- **PayMint Integration**: Check this documentation or create an issue

## Testing

### Test Scenarios
1. ✅ Connect wallet
2. ✅ Disconnect wallet
3. ✅ View balance
4. ✅ Copy address
5. ✅ Network switching
6. ✅ Connection persistence
7. ✅ Error handling

### Test Accounts
Use the Stacks testnet faucet to get test STX for development and testing.

