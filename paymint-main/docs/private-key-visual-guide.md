# 🔍 Visual Guide: Finding Private Key in Leather Wallet

## 🖥️ **Common Interface Locations**

### **Location 1: Top Menu Bar**
```
┌─────────────────────────────────────┐
│ Leather Wallet              [⚙️] [☰] │
└─────────────────────────────────────┘
                    ↑
                Click here
```

### **Location 2: Settings Menu**
```
┌─────────────────────────────────────┐
│ Settings                            │
├─────────────────────────────────────┤
│ General                             │
│ Security                            │
│ Advanced                            │
│ [Export Private Key] ← Click here   │
│ Help                                │
└─────────────────────────────────────┘
```

### **Location 3: Security Section**
```
┌─────────────────────────────────────┐
│ Security                            │
├─────────────────────────────────────┤
│ Change Password                     │
│ [Export Private Key] ← Click here   │
│ Backup Wallet                       │
│ Delete Wallet                       │
└─────────────────────────────────────┘
```

### **Location 4: Account Menu**
```
┌─────────────────────────────────────┐
│ Account: STM0TT7J...                │
├─────────────────────────────────────┤
│ View on Explorer                    │
│ [Export Private Key] ← Click here   │
│ Copy Address                        │
└─────────────────────────────────────┘
```

## 🔑 **What You'll See After Clicking**

```
┌─────────────────────────────────────┐
│ Export Private Key                  │
├─────────────────────────────────────┤
│ Enter your password:                │
│ [________________]                  │
│                                     │
│ Your Private Key:                   │
│ 0x1234567890abcdef1234567890abcdef  │
│ 1234567890abcdef1234567890abcdef    │
│                                     │
│ [Copy] [Close]                      │
└─────────────────────────────────────┘
```

## ⚠️ **Important Notes**

- **Password Required**: You'll need to enter your wallet password
- **Copy Carefully**: Make sure to copy the entire key including `0x`
- **Keep Secure**: Don't share this key with anyone
- **Testnet Only**: Only use for testnet deployment

## 🎯 **Quick Checklist**

- [ ] Opened Leather Wallet
- [ ] Switched to Testnet4 network
- [ ] Found Settings menu
- [ ] Located Export Private Key option
- [ ] Entered password
- [ ] Copied the full private key
- [ ] Verified it starts with `0x` and is 64 characters

## 🚀 **Next Steps**

Once you have your private key:
1. Get STX tokens from faucet
2. Deploy your contract
3. Update your app with the new contract address

