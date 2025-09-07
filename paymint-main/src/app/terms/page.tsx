
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Wallet } from "lucide-react";


export const metadata: Metadata = {
  title: 'Terms and Conditions - PayMint',
};


export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-lg">PayMint</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <p>Welcome to PayMint, a decentralized invoice factoring platform designed to provide small businesses with instant liquidity by tokenizing invoices on the blockchain. By accessing or using PayMint, you (“User,” “Business,” or “Lender”) agree to the following terms:</p>
                
                <h2>1. Platform Overview</h2>
                <p>1.1 PayMint enables Small and Medium Enterprises (SMEs), freelancers, and businesses to digitize and upload invoices via a user-friendly interface.</p>
                <p>1.2 Invoices are tokenized as NFTs on the Stacks blockchain, secured by the Bitcoin network.</p>
                <p>1.3 Lenders fund invoices through Clarity smart contracts, earning interest upon repayment.</p>
                <p>1.4 PayMint supports users without crypto wallets via a peer-to-peer fiat bridge to foster inclusivity.</p>
                
                <h2>2. User Eligibility</h2>
                <p>2.1 Users must be at least 18 years old and legally capable of entering agreements.</p>
                <p>2.2 Businesses are required to complete KYC/KYB verification including GSTIN, PAN, and entity validation.</p>
                <p>2.3 Lenders must comply with applicable Anti-Money Laundering (AML) and Counter Financing of Terrorism (CFT) laws.</p>
                
                <h2>3. Invoice Funding &amp; Settlement</h2>
                <p>3.1 Businesses submit invoices through the platform for verification and tokenization.</p>
                <p>3.2 Upon approval, invoices are minted as NFTs and listed for funding.</p>
                <p>3.3 Lenders may choose to fund listed invoices receiving returns based on agreed terms.</p>
                <p>3.4 Smart contracts automate settlements, interest calculation, and repayment distribution.</p>
                
                <h2>4. Fees and Charges</h2>
                <p>4.1 PayMint charges a service fee between 3% and 5% on the invoice value for factoring services.</p>
                <p>4.2 Lenders earn interest ranging from 2% to 5% on funded invoices upon successful repayment.</p>
                <p>4.3 Additional fees may apply for fiat bridge services or off-chain transactions.</p>
                
                <h2>5. Lock-In and Withdrawal Policy</h2>
                <p>5.1 Invoice funding agreements enforce a 90-day lock-in period during which funds cannot be withdrawn.</p>
                <p>5.2 Early withdrawal prior to 90 days results in forfeiture of accrued interest and an additional 2% penalty on principal.</p>
                <p>5.3 After maturity, a 10-day penalty-free window is granted to withdraw funds. Post this, a weekly penalty of 0.1% to 0.3% applies on outstanding amounts.</p>
                
                <h2>6. Compliance and Risk</h2>
                <p>6.1 Users acknowledge that PayMint operates as a blockchain-based platform subject to inherent market, regulatory, and liquidity risks.</p>
                <p>6.2 Repayment of invoices is dependent on the debtor’s payment and is not guaranteed by PayMint.</p>
                <p>6.3 Users bear responsibility for adherence to their local regulations regarding cryptocurrencies and financial transactions.</p>
                
                <h2>7. Limitation of Liability</h2>
                <p>7.1 PayMint provides a technology service platform; it does not guarantee payment or returns on investments.</p>
                <p>7.2 Users assume all risks related to blockchain transactions, including smart contract vulnerabilities and market fluctuations.</p>
                <p>7.3 PayMint shall not be liable for losses arising from system exploits, defaults, or disruptions.</p>
                
                <h2>8. Termination</h2>
                <p>8.1 PayMint holds the right to suspend or terminate accounts involved in fraudulent, illegal, or non-compliant activities.</p>
                <p>8.2 Users may terminate accounts only after clearing all pending obligations and settled transactions.</p>
                
                <h2>9. Governing Law</h2>
                <p>These Terms are governed by the laws of [Insert Jurisdiction], alongside mandatory regulatory compliances.</p>
                
                <h2>10. Amendments</h2>
                <p>PayMint reserves the right to update or modify these Terms and Conditions at any time. Material changes will be communicated through the platform or registered email notifications.</p>
            </CardContent>
        </Card>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 PayMint Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms and Conditions
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  );
}
