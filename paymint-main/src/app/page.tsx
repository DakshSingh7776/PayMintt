
"use client"

import { Button } from "@/components/ui/button";
import { Wallet, Moon, Sun, TrendingUp, Droplets, FileCheck2, Upload, ShieldCheck, ArrowRight, GitBranch, Target, Telescope, UserCheck, Library, Scale, Users } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectButton } from "@/components/WalletConnectButton";


function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md border">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({ icon, title, description, step }: { icon: React.ReactNode, title: string, description: string, step: number }) {
  return (
    <div className="relative flex flex-col items-center p-6 text-center">
        <div className="absolute top-8 right-full h-px w-1/2 bg-border hidden lg:block" />
        <div className="absolute top-8 left-full h-px w-1/2 bg-border hidden lg:block" />
        <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary text-primary-foreground">
           {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function ComparisonRow({ title, paymintText, traditionalText }: { title: string, paymintText: string, traditionalText: string }) {
    return (
        <div className="grid grid-cols-3 gap-4 items-center py-4 border-b">
            <div className="font-semibold text-lg">{title}</div>
            <div className="flex items-center gap-2 text-green-600"><UserCheck className="w-5 h-5" /> {paymintText}</div>
            <div className="flex items-center gap-2 text-destructive"><UserCheck className="w-5 h-5"/> {traditionalText}</div>
        </div>
    )
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14">
          <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-lg">PayMint</span>
          </Link>
          <nav className="flex items-center gap-4">
             <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
             </Button>
             <Button asChild>
                <Link href="/signup">Get Started</Link>
             </Button>
            <WalletConnectButton />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]" />
            </div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  The Future of Invoice Financing is Here
                </h1>
                <p className="text-lg font-medium md:text-xl">Get Paid Today, Not in 90 Days.</p>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  PayMint is a decentralized platform that transforms unpaid invoices into tradable assets, providing instant liquidity for businesses and new yield opportunities for investors.
                </p>
            </div>
             <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                <Button asChild size="lg" className="w-full md:w-auto">
                    <Link href="/signup?role=business" className="flex items-center gap-2">For Businesses <ArrowRight className="w-4 h-4" /> Upload Invoice</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                     <Link href="/signup?role=lender" className="flex items-center gap-2">For Investors <ArrowRight className="w-4 h-4" /> Start Investing</Link>
                </Button>
              </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Simple Path to Liquidity and Yield</h2>
                  </div>
                </div>
                 <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-4 pt-12">
                    <StepCard icon={<Upload className="w-8 h-8" />} title="Upload Invoice" description="Businesses upload unpaid invoices to be tokenized as unique digital assets (NFTs)." step={1} />
                    <StepCard icon={<FileCheck2 className="w-8 h-8" />} title="Verified & Listed" description="Invoices are verified and listed on our open marketplace for investors to browse." step={2} />
                    <StepCard icon={<TrendingUp className="w-8 h-8" />} title="Funded Instantly" description="Investors provide funding, giving businesses immediate access to their capital." step={3} />
                    <StepCard icon={<Droplets className="w-8 h-8" />} title="Investors Earn Yield" description="Investors earn competitive returns when the invoice is paid back by the debtor." step={4} />
                 </div>
            </div>
        </section>

        {/* Why PayMint? Section */}
        <section id="why-paymint" className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Why PayMint?</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Better Financial Future</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            We&apos;re revolutionizing invoice financing with the power of decentralized technology.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-4xl pt-12">
                    <Card>
                        <CardHeader>
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <CardTitle></CardTitle>
                                <CardTitle className="text-primary">PayMint</CardTitle>
                                <CardTitle className="text-muted-foreground">Traditional Factoring</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <ComparisonRow title="Liquidity Speed" paymintText="Instant liquidity" traditionalText="30-90 day wait" />
                             <ComparisonRow title="Investor Access" paymintText="Global investor pool" traditionalText="Limited lenders" />
                             <ComparisonRow title="Transparency" paymintText="Transparent blockchain records" traditionalText="Hidden fees" />
                             <ComparisonRow title="Investor Returns" paymintText="Passive yields for investors" traditionalText="Low bank interest" />
                        </CardContent>
                    </Card>
                </div>
             </div>
        </section>

        {/* Security Section */}
         <section id="security" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Security & Compliance</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Trust is Our Priority</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We use enterprise-grade security and compliance measures to protect your assets and data.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 pt-12">
              <FeatureCard icon={<UserCheck className="w-10 h-10" />} title="KYC/KYB Verification" description="Robust identity verification for all users to ensure a trusted ecosystem." />
              <FeatureCard icon={<Library className="w-10 h-10" />} title="GST Validation" description="Mandatory GST validation for Indian businesses to ensure invoice authenticity." />
              <FeatureCard icon={<Scale className="w-10 h-10" />} title="Smart Contract Escrow" description="Funds are held securely in audited smart contracts until repayment." />
              <FeatureCard icon={<ShieldCheck className="w-10 h-10" />} title="Blockchain Auditability" description="Every transaction is recorded on an immutable public ledger for full transparency." />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Businesses and Investors</h2>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                   <Card>
                       <CardContent className="p-6">
                         <blockquote className="text-lg font-semibold leading-snug">
                          “We got funded in 24 hours and didn’t have to chase banks. PayMint is a game-changer for our cash flow.”
                        </blockquote>
                        <div className="mt-4 text-sm text-muted-foreground">- Small Business Owner</div>
                       </CardContent>
                   </Card>
                   <Card>
                       <CardContent className="p-6">
                         <blockquote className="text-lg font-semibold leading-snug">
                          “PayMint gives me stable returns backed by real-world invoices. It's a core part of my DeFi portfolio now.”
                        </blockquote>
                        <div className="mt-4 text-sm text-muted-foreground">- DeFi Investor</div>
                       </CardContent>
                   </Card>
                </div>
             </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
             <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-5xl font-bold">$500,000+</p>
                        <p className="text-lg">Worth of invoices tokenized</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold">50+</p>
                        <p className="text-lg">Businesses onboarded</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold">8.2%</p>
                        <p className="text-lg">Average investor yield</p>
                    </div>
                </div>
             </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl pt-12">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is my money safe?</AccordionTrigger>
                            <AccordionContent>
                            Yes. Funds are held in audited smart contract escrows. For investors, funds are backed by real-world, legally enforceable invoices. For businesses, we use KYC/KYB to ensure all participants are vetted.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What happens if an invoice defaults?</AccordionTrigger>
                            <AccordionContent>
                            While we have a rigorous verification process, defaults are a possibility. In such cases, the platform provides tools for investors to pursue recovery, and the transparent nature of the blockchain provides a clear record of the debt. Future versions will include options for insuring invoices.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Do I need crypto knowledge to use PayMint?</AccordionTrigger>
                            <AccordionContent>
                            No. While we are built on blockchain, our user-friendly interface is designed for everyone. We provide simple options for both crypto-native users and those who prefer to use traditional bank transfers to interact with the platform.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-4">
                            <AccordionTrigger>How do businesses repay?</AccordionTrigger>
                            <AccordionContent>
                            When a business&apos;s client pays the invoice, the business transfers the funds back to the platform. The smart contract then automatically repays the investor along with their earned yield.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
             </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Roadmap</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Building the Future of Real-World Asset Financing</h2>
                  </div>
                </div>
                 <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
                    <FeatureCard icon={<Target className="w-10 h-10" />} title="AI Credit Scoring" description="Implementing advanced AI models to provide more accurate, real-time risk assessment for invoices." />
                    <FeatureCard icon={<Telescope className="w-10 h-10" />} title="Mobile App" description="Launching a fully-featured mobile application for on-the-go invoice management and investing." />
                    <FeatureCard icon={<GitBranch className="w-10 h-10" />} title="DeFi Integrations" description="Expanding our protocol to integrate with other leading DeFi platforms for increased liquidity and yield strategies." />
                 </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section id="cta-bottom" className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Turn invoices into instant cash.</h2>
                    <Button asChild size="lg">
                        <Link href="/signup">Start Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                </div>
             </div>
        </section>

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
