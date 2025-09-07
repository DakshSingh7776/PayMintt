
"use client"

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Building, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const RoleCard = ({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <Card
    className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      selected ? "border-primary ring-2 ring-primary" : "border-border"
    )}
    onClick={onClick}
  >
    <CardContent className="p-6 text-center space-y-2">
      <div className="mx-auto h-12 w-12 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"business" | "lender" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Check for role parameter in URL on component mount
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'lender' || roleParam === 'business') {
      setRole(roleParam);
      setStep(2);
      // Update URL to remove the role parameter for cleaner URLs
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('role');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleRoleSelect = (selectedRole: "business" | "lender") => {
    setRole(selectedRole);
    setStep(2);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    toast({
      title: "Signup Successful",
      description: "Please log in with your new account.",
    });
    router.push('/login');
    console.log(`Signing up as ${role} with email ${email}`);
  };

  if (step === 1) {
    return (
        <Card className="w-full max-w-3xl">
            <CardContent className="p-8 md:p-12 text-center">
                <h1 className="text-3xl font-bold">Join PayMint</h1>
                <p className="text-muted-foreground mt-2">
                Choose your role to get started. Are you looking to get invoices paid or to invest?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <RoleCard
                        icon={<Building size={32} />}
                        title="I'm a Business"
                        description="I want to tokenize invoices to unlock capital."
                        selected={role === 'business'}
                        onClick={() => handleRoleSelect('business')}
                    />
                    <RoleCard
                        icon={<User size={32} />}
                        title="I'm a Lender"
                        description="I want to invest in invoices for returns."
                        selected={role === 'lender'}
                        onClick={() => handleRoleSelect('lender')}
                    />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Sign up as a {role === 'business' ? 'Business' : 'Lender'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={!agreedToTerms}>
            Create Account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-3xl">
        <CardContent className="p-8 md:p-12 text-center">
          <h1 className="text-3xl font-bold">Join PayMint</h1>
          <p className="text-muted-foreground mt-2">
            Loading...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="h-32 bg-muted animate-pulse rounded"></div>
            <div className="h-32 bg-muted animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    }>
      <SignupForm />
    </Suspense>
  );
}
