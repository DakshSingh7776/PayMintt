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
                    business-address: business-address,
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
;; Additional utility functions
;; ---------------------------

;; Check if a specific invoice belongs to a business
(define-read-only (is-business-invoice (invoice-id uint) (business principal))
  (match (map-get? invoices {invoice-id: invoice-id})
    invoice-data
      (is-eq (get business-address invoice-data) business)
    false
  )
)

;; Check if invoice is overdue
(define-read-only (is-invoice-overdue (invoice-id uint))
  (match (map-get? invoices {invoice-id: invoice-id})
    invoice-data
      (and 
        (is-eq (get status invoice-data) STATUS_FUNDED)
        (> burn-block-height (get due-date invoice-data))
      )
    false
  )
)

;; Get invoice status as string (for easier frontend integration)
(define-read-only (get-invoice-status-string (invoice-id uint))
  (match (map-get? invoices {invoice-id: invoice-id})
    invoice-data
      (let ((status (get status invoice-data)))
        (if (is-eq status STATUS_CREATED)
          "CREATED"
          (if (is-eq status STATUS_FUNDED)
            "FUNDED"
            (if (is-eq status STATUS_SETTLED)
              "SETTLED"
              "UNKNOWN"
            )
          )
        )
      )
    "NOT_FOUND"
  )
)

;; Emergency function to allow lender to claim overdue invoice
(define-public (claim-overdue-invoice (invoice-id uint))
  (let ((invoice-data (unwrap! (map-get? invoices {invoice-id: invoice-id}) (err ERR_INVOICE_NOT_FOUND))))
    (let (
          (lender-address (get lender-address invoice-data))
          (due-date (get due-date invoice-data))
         )

      ;; Must be funded and overdue
      (asserts! (is-eq (get status invoice-data) STATUS_FUNDED) (err ERR_NOT_FUNDED))
      (asserts! (> burn-block-height due-date) (err ERR_INVALID_STATUS))

      ;; Must be the lender
      (match lender-address
        lender
          (begin
            (asserts! (is-eq tx-sender lender) (err ERR_UNAUTHORIZED))
            ;; Mark as settled (claimed by lender)
            (map-set invoices
              {invoice-id: invoice-id}
              {
                amount: (get amount invoice-data),
                due-date: due-date,
                status: STATUS_SETTLED,
                business-address: (get business-address invoice-data),
                lender-address: (some lender),
                funded-amount: (get funded-amount invoice-data)
              }
            )
            (ok true)
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