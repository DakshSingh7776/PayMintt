
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Wallet } from "lucide-react";


export const metadata: Metadata = {
  title: 'Privacy Policy - PayMint',
};

export default function PrivacyPage() {
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
                <CardTitle className="text-3xl">PayMint Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <p>Last Updated: 28 AUGUST 2025</p>
                <p>At PayMint (“we,” “us,” or “our”), protecting the privacy and security of our users—including businesses, freelancers, and lenders—is our highest priority. This Privacy Policy details how we collect, use, store, and safeguard your personal and financial information when you use the PayMint platform.</p>
                
                <h2>1. Information We Collect</h2>
                <p>We gather various types of information to provide and enhance our services:</p>
                <ul>
                    <li>
                        <strong>Account Information (Web2):</strong>
                        <p>Name, email address, and password through Supabase authentication services.</p>
                    </li>
                    <li>
                        <strong>Business Verification Data (KYC/KYB):</strong>
                        <p>Documents such as GSTIN, PAN, government-issued IDs, company registration details, and other compliance materials.</p>
                    </li>
                    <li>
                        <strong>Financial Information:</strong>
                        <p>Invoice details, transaction histories, wallet addresses, and records related to funding and settlements.</p>
                    </li>
                    <li>
                        <strong>Blockchain Data (Web3):</strong>
                        <p>Public wallet addresses, invoice NFTs, smart contract transactions, and associated metadata recorded immutably on the Stacks blockchain.</p>
                    </li>
                    <li>
                        <strong>Technical Information:</strong>
                        <p>Device metadata, IP addresses, browser type, and usage logs to maintain platform security and user experience.</p>
                    </li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We utilize the collected data for purposes including but not limited to:</p>
                 <ul>
                    <li>Facilitating invoice creation, tokenization, funding, and settlement operations.</li>
                    <li>Conducting KYC/KYB compliance and AML monitoring.</li>
                    <li>Safeguarding on-chain and off-chain transaction security.</li>
                    <li>Operating peer-to-peer fiat bridge services for users without cryptocurrency wallets.</li>
                    <li>Charging applicable service fees of 3–5% and deadlines penalties of 0.1% to 0.5% weekly on outstanding balances not withdrawn timely.</li>
                    <li>Informing users of platform changes, updates, and regulatory requirements.</li>
                </ul>

                <h2>3. Data Sharing and Disclosure</h2>
                <p>We respect your privacy and do not sell personal data. We may share your data only in these cases:</p>
                <ul>
                    <li>Compliance with regulatory or legal requirements, including AML/CFT laws.</li>
                    <li>With trusted and verified third-party providers serving functions like authentication, KYC, and blockchain operations.</li>
                    <li>Disclosure of public blockchain transaction data where inherently transparent.</li>
                    <li>Under valid court orders or government mandates.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>We employ industry-leading security measures, including:</p>
                <ul>
                    <li>Encryption of personal and financial data in transit and at rest.</li>
                    <li>Leveraging blockchain immutability and Bitcoin-backed security through Stacks.</li>
                    <li>Restricting data access to authorized personnel and conducting regular security audits.</li>
                </ul>

                <h2>5. User Rights</h2>
                <p>Users of PayMint have the right to:</p>
                <ul>
                    <li>Access their personal data and obtain copies where applicable.</li>
                    <li>Request corrections or updates to inaccurate or outdated information.</li>
                    <li>Request deletion of data, subject to legal and operational constraints.</li>
                    <li>Withdraw from the platform after satisfying all outstanding obligations.</li>
                </ul>

                <h2>6. Data Retention</h2>
                <p>We retain information in compliance with law and operational needs:</p>
                <ul>
                    <li>KYC/KYB information as legally mandated for verification and reporting.</li>
                    <li>Financial and transaction records for audit and regulatory purposes.</li>
                    <li>Blockchain-stored data permanently recorded and immutable by nature.</li>
                </ul>

                <h2>7. Updates to This Privacy Policy</h2>
                <p>
                    This policy may be updated periodically. Users will be notified of major changes via the platform or registered email.
                </p>
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
