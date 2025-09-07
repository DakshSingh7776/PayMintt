#!/bin/bash

# Deploy Invoice Factoring Contract to Stacks Testnet4
# Make sure you have Stacks CLI installed and your private key ready

echo "🚀 Deploying Invoice Factoring Contract to Stacks Testnet4..."

# Check if Stacks CLI is installed
if ! command -v stacks &> /dev/null; then
    echo "❌ Stacks CLI not found. Installing..."
    curl -sL https://stacks.sh | bash
    export PATH="$HOME/.local/bin:$PATH"
    
    # Verify installation
    if ! command -v stacks &> /dev/null; then
        echo "❌ Failed to install Stacks CLI. Please install manually:"
        echo "   Visit: https://docs.stacks.co/build-apps/references/cli"
        exit 1
    fi
fi

# Check if contract file exists
if [ ! -f "contracts/invoice-factoring.clar" ]; then
    echo "❌ Contract file not found at contracts/invoice-factoring.clar"
    echo "   Creating contract file..."
    
    # Create contracts directory if it doesn't exist
    mkdir -p contracts
    
    # Create the contract file
    cat > contracts/invoice-factoring.clar << 'EOF'
;; Invoice Factoring Smart Contract
;; Allows businesses to create invoices and lenders to fund them

;; Invoice status constants
(define-constant STATUS_CREATED u0)
(define-constant STATUS_FUNDED u1)
(define-constant STATUS_SETTLED u2)

;; Error constants
(define-constant ERR_INVALID_AMOUNT u1)
(define-constant ERR_INVALID_DUE_DATE u2)
(define-constant ERR_INVOICE_NOT_FOUND u3)
(define-constant ERR_INVALID_STATUS u4)
(define-constant ERR_AMOUNT_MISMATCH u5)
(define-constant ERR_TRANSFER_FAILED u6)
(define-constant ERR_NOT_FUNDED u7)
(define-constant ERR_UNAUTHORIZED u8)
(define-constant ERR_REPAYMENT_FAILED u9)
(define-constant ERR_NO_LENDER u10)

;; Invoice ID counter
(define-data-var invoice-counter uint u0)

;; Invoice storage map
(define-map invoices
  {invoice-id: uint}
  {
    amount: uint,
    due-date: uint,
    status: uint,
    business-address: principal,
    lender-address: (optional principal),
    funded-amount: uint
  }
)

;; ---------------------------
;; Create a new invoice
;; ---------------------------
(define-public (create-invoice (amount uint) (due-date uint))
  (begin
    ;; Validation
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT)) ;; Amount must be > 0
    (asserts! (> due-date burn-block-height) (err ERR_INVALID_DUE_DATE)) ;; Due date must be in future

    ;; Next invoice ID
    (let ((invoice-id (+ (var-get invoice-counter) u1)))
      
      ;; Store invoice
      (map-set invoices
        {invoice-id: invoice-id}
        {
          amount: amount,
          due-date: due-date,
          status: STATUS_CREATED,
          business-address: tx-sender,
          lender-address: none,
          funded-amount: u0
        }
      )

      ;; Increment counter
      (var-set invoice-counter invoice-id)

      ;; Return success
      (ok invoice-id)
    )
  )
)

;; ---------------------------
;; Fund an invoice (lender sends STX)
;; ---------------------------
(define-public (fund-invoice (invoice-id uint) (amount uint))
  (let ((invoice-data (unwrap! (map-get? invoices {invoice-id: invoice-id}) (err ERR_INVOICE_NOT_FOUND))))
    (let (
          (invoice-amount (get amount invoice-data))
          (business-address (get business-address invoice-data))
         )

      ;; Check invoice status
      (asserts! (is-eq (get status invoice-data) STATUS_CREATED) (err ERR_INVALID_STATUS))

      ;; Check funding amount matches invoice
      (asserts! (is-eq amount invoice-amount) (err ERR_AMOUNT_MISMATCH))

      ;; Transfer STX from lender to business
      (match (stx-transfer? amount tx-sender business-address)
        ok-result
          (begin
            ;; Update invoice
            (map-set invoices
              {invoice-id: invoice-id}
              {
                amount: invoice-amount,
                due-date: (get due-date invoice-data),
                status: STATUS_FUNDED,
                business-address: business-address,
                lender-address: (some tx-sender),
                funded-amount: amount
              }
            )
            (ok true)
          )
        err-result
          ;; If transfer fails
          (err ERR_TRANSFER_FAILED)
      )
    )
  )
)

;; ---------------------------
;; Settle invoice (business repays lender)
;; ---------------------------
(define-public (settle-invoice (invoice-id uint))
  (let ((invoice-data (unwrap! (map-get? invoices {invoice-id: invoice-id}) (err ERR_INVOICE_NOT_FOUND))))
    (let (
          (business-address (get business-address invoice-data))
          (lender-address (get lender-address invoice-data))
          (funded-amount (get funded-amount invoice-data))
         )

      ;; Must be funded before settlement
      (asserts! (is-eq (get status invoice-data) STATUS_FUNDED) (err ERR_NOT_FUNDED))

      ;; Only business can settle their own invoice
      (asserts! (is-eq tx-sender business-address) (err ERR_UNAUTHORIZED))

      ;; Must have lender
      (match lender-address
        lender
          (match (stx-transfer? funded-amount business-address lender)
            ok-result
              (begin
                ;; Mark as settled
                (map-set invoices
                  {invoice-id: invoice-id}
                  {
                    amount: (get amount invoice-data),
                    due-date: (get due-date invoice-data),
                    status: STATUS_SETTLED,
                    business-address: (get business-address invoice-data),
                    lender-address: (some lender),
                    funded-amount: funded-amount
                  }
                )
                (ok true)
              )
            err-result
              (err ERR_REPAYMENT_FAILED)
          )
        (err ERR_NO_LENDER)
      )
    )
  )
)

;; ---------------------------
;; Read-only helpers
;; ---------------------------

(define-read-only (get-invoice-counter)
  (var-get invoice-counter)
)

(define-read-only (get-invoice-details (invoice-id uint))
  (map-get? invoices {invoice-id: invoice-id})
)
EOF

    echo "✅ Contract file created at contracts/invoice-factoring.clar"
fi

# Set your private key (you'll need to replace this with your actual private key)
echo "📝 Please enter your private key (or set STACKS_PRIVATE_KEY environment variable):"
read -s PRIVATE_KEY

if [ -z "$PRIVATE_KEY" ]; then
    if [ -z "$STACKS_PRIVATE_KEY" ]; then
        echo "❌ No private key provided"
        echo "   You can set it as an environment variable:"
        echo "   export STACKS_PRIVATE_KEY='your-private-key-here'"
        exit 1
    else
        PRIVATE_KEY="$STACKS_PRIVATE_KEY"
    fi
fi

export STACKS_PRIVATE_KEY="$PRIVATE_KEY"

echo "📋 Contract Details:"
echo "   - Contract: invoice-factoring"
echo "   - Network: Testnet4"
echo "   - File: contracts/invoice-factoring.clar"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Deploy the contract using Clarinet (if available) or Stacks CLI
if command -v clarinet &> /dev/null; then
    echo "🔄 Deploying contract using Clarinet..."
    
    # Create clarinet.toml if it doesn't exist
    if [ ! -f "clarinet.toml" ]; then
        cat > clarinet.toml << 'EOF'
[project]
name = "paymint-invoice-factoring"
description = "Invoice factoring smart contract for PayMint"
authors = ["PayMint Team"]
license = "MIT"

[contracts.invoice-factoring]
path = "contracts/invoice-factoring.clar"
clarity_version = "2.4"

[networks.testnet4]
url = "https://api.testnet4.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your-mnemonic-here"
balance = 1000000000000
EOF
    fi
    
    # Deploy using Clarinet
    clarinet deployments apply --config=clarinet.toml --network=testnet4
    
    if [ $? -eq 0 ]; then
        echo "✅ Contract deployed successfully with Clarinet!"
    else
        echo "❌ Clarinet deployment failed, trying Stacks CLI..."
        # Fallback to Stacks CLI
        stacks deploy testnet4 contracts/invoice-factoring.clar
    fi
else
    echo "🔄 Deploying contract using Stacks CLI..."
    stacks deploy testnet4 contracts/invoice-factoring.clar
fi

if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update CONTRACT_ADDRESS in src/hooks/use-smart-contract.ts"
    echo "2. Test the contract with your Leather wallet"
    echo "3. Monitor transactions on https://explorer.testnet4.stacks.co/"
    echo ""
    echo "🎯 Demo Commands:"
    echo "   - Create Invoice: 1000 STX, due in 30 days"
    echo "   - Fund Invoice: Transfer 1000 STX to business"
    echo "   - Settle Invoice: Business repays 1000 STX to lender"
else
    echo "❌ Contract deployment failed"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Make sure you have sufficient STX balance for deployment"
    echo "2. Verify your private key is correct"
    echo "3. Check network connectivity"
    echo "4. Try installing Clarinet: curl -sL https://clarinet.sh | bash"
    exit 1
fi
