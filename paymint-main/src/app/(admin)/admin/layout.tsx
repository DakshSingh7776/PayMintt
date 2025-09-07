
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  FileText,
  LogOut,
  Wallet,
  LayoutDashboard,
  Settings,
  Shield,
  Activity,
  BarChart,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import { ThemeProvider } from "@/components/theme-provider"

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


function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you'd clear the admin session/token
    router.push('/')
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Wallet className="h-6 w-6" />
            <span className="">PayMint Admin</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4 mr-2 inline-block" />
            Dashboard
          </Link>
           <Link
            href="/admin/users"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Users className="h-4 w-4 mr-2 inline-block" />
            Users
          </Link>
          <Link
            href="/admin/transactions"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Activity className="h-4 w-4 mr-2 inline-block" />
            Transactions
          </Link>
           <Link
            href="/admin/compliance"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Shield className="h-4 w-4 mr-2 inline-block" />
            Compliance
          </Link>
          <Link
            href="/admin/reports"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <BarChart className="h-4 w-4 mr-2 inline-block" />
            Reports
          </Link>
           <Link
            href="/admin/settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-4 w-4 mr-2 inline-block" />
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="font-medium">Admin User</span>
            <Avatar>
              <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="admin avatar" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
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
  )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  )
}
