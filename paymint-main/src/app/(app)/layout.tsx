
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Store,
  Upload,
  Droplets,
  Wallet,
  Settings,
  User,
  PanelLeft,
  LogOut,
  Moon,
  Sun,
  Briefcase,
  ShieldCheck,
  Bitcoin,
  FilePlus2,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { WalletProvider } from "@/contexts/WalletContext"
import { WalletConnectButton } from "@/components/WalletConnectButton"

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // In a real app, you would get the user's role from your auth session.
  // We'll simulate it with a URL query parameter for now.
  const role = searchParams.get('role') || 'business'; // Default to business if no role
  const email = searchParams.get('email') || (role === 'business' ? 'business@example.com' : 'lender@example.com');

  const handleLogout = () => {
    // In a real app, you'd clear the session/token
    router.push('/')
  }
  
  const baseNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['business', 'lender'] },
  ];

  const roleNavItems = {
    business: [
      { href: "/generate-invoice", label: "Generate Invoice", icon: FilePlus2, roles: ['business'] },
      { href: "/upload", label: "Upload Invoice", icon: Upload, roles: ['business'] },
      { href: "/payments", label: "Smart Payments", icon: CreditCard, roles: ['business'] },
      { href: "/trusted-buyers", label: "Trusted Buyers", icon: ShieldCheck, roles: ['business'] },
    ],
    lender: [
       { href: "/marketplace", label: "Marketplace", icon: Store, roles: ['lender'] },
       { href: "/my-investments", label: "My Investments", icon: Briefcase, roles: ['lender'] },
       { href: "/pool", label: "Liquidity Pool", icon: Droplets, roles: ['lender'] },
    ]
  }

  const commonNavItems = [
    { href: "/crypto", label: "Crypto", icon: Bitcoin, roles: ['business', 'lender'] },
  ];

  const navItems = [
    ...baseNavItems,
    ...(role === 'business' ? roleNavItems.business : roleNavItems.lender),
    ...commonNavItems
  ];
  
  const getHrefWithParams = (href: string) => {
    const params = new URLSearchParams();
    params.set('role', role);
    if (email) {
      params.set('email', email);
    }
    return `${href}?${params.toString()}`;
  };

  return (
    <ThemeProvider>
      <WalletProvider>
        <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <PanelLeft />
                </Button>
                <Wallet className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-semibold">PayMint</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={getHrefWithParams(item.href)}>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        className="w-full"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-4 ml-auto">
                <WalletConnectButton />
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="user avatar" alt="@user" />
                        <AvatarFallback>{role === 'business' ? 'B' : 'L'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{role === 'business' ? 'Business' : 'Lender'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getHrefWithParams("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getHrefWithParams("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
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
        </div>
        </SidebarProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    }>
      <AppLayoutContent>{children}</AppLayoutContent>
    </Suspense>
  );
};

export default AppLayout;
