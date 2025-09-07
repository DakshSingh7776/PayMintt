import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Metadata } from "next";
import Link from "next/link";
import { Wallet, Mail, User, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: 'Contact Us - PayMint',
};

export default function ContactPage() {
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
      <main className="flex-1 container py-8 md:py-16">
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <Mail className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-3xl mt-4">Contact Us</CardTitle>
                <CardDescription>Have questions or feedback? Fill out the form below and we&apos;ll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="name" placeholder="John Doe" className="pl-10" required/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="you@example.com" className="pl-10" required/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <div className="relative">
                             <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Textarea id="message" placeholder="Your message..." className="pl-10 min-h-[120px]" required/>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                </form>
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
