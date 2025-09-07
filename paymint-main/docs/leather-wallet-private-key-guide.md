# 🔑 How to Get Private Key from Leather Wallet

## 📱 **Step-by-Step Instructions**

### **Step 1: Open Leather Wallet**
1. **Open your browser**
2. **Go to**: https://leather.io/ or open the Leather extension
3. **Make sure you're on Testnet4** (check the network selector)

### **Step 2: Access Settings**
1. **Click the menu icon** (☰) or **gear icon** (⚙️) in the top right
2. **Look for "Settings"** or **"Advanced"**
3. **Click on Settings**

### **Step 3: Find Export Option**
1. **Scroll down** in settings
2. **Look for one of these options**:
   - "Export Private Key"
   - "Show Private Key"
   - "Backup Private Key"
   - "Export Key"
   - "Reveal Private Key"

### **Step 4: Export Your Key**
1. **Click on the export option**
2. **Enter your password** if prompted
3. **Copy the private key** (it will look like this):
   ```
   0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

### **Step 5: Verify the Format**
- ✅ **Should start with**: `0x`
- ✅ **Should be 64 characters** (not counting the `0x`)
- ✅ **Should contain only**: letters a-f and numbers 0-9

## 🔍 **Alternative Locations to Check**

### **If you can't find "Export Private Key":**

#### **Option A: Security Section**
1. Go to **Settings** → **Security**
2. Look for **"Export Keys"** or **"Backup"**

#### **Option B: Advanced Settings**
1. Go to **Settings** → **Advanced**
2. Look for **"Developer Options"** or **"Export"**

#### **Option C: Account Settings**
1. Click on **your account/address**
2. Look for **"Export"** or **"Backup"** options

#### **Option D: Wallet Menu**
1. Click on **"Wallet"** in the main menu
2. Look for **"Export"** or **"Backup"** options

## 🆘 **If You Still Can't Find It**

### **Method 2: Use Seed Phrase**
If you have your **12 or 24 word seed phrase**:

1. **Look for "Derive Private Key"** option
2. **Enter your seed phrase**
3. **Get the corresponding private key**

### **Method 3: Create New Wallet**
If you can't export from current wallet:

1. **Create a new wallet** in Leather
2. **Save the seed phrase** immediately
3. **Export the private key** from the new wallet
4. **Use it for deployment**

## ⚠️ **Security Warnings**

- 🔒 **NEVER share your private key with anyone**
- 🔒 **Only use for testnet deployment**
- 🔒 **Keep it secure and private**
- 🔒 **Don't save it in plain text files**

## 🎯 **What Your Private Key Should Look Like**

```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## 📞 **Need Help?**

If you still can't find the export option:
1. **Check Leather Wallet documentation**
2. **Look for "Help" or "Support"** in the wallet
3. **Try different sections** of the settings

## 🚀 **Once You Have Your Private Key**

You can deploy your contract with:

```bash
npx @stacks/cli deploy_contract \
  contracts/invoice-factoring.clar \
  invoice-factoring \
  1000 \
  0 \
  'YOUR_PRIVATE_KEY_HERE'
```

Replace `YOUR_PRIVATE_KEY_HERE` with your actual private key!

