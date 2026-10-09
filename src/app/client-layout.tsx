"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletConnect, useWallet } from "@/components/WalletConnect"
import { Toaster } from "@/components/Toaster"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/compliance", label: "Compliance" },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { wallet, loading, connect, disconnect } = useWallet()

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>

      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-primary"
            aria-label="PropFi - Tokenized Real Estate Protocol"
          >
            PropFi
          </Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <ul className="flex items-center gap-6" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <WalletConnect
              wallet={wallet}
              loading={loading}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      <nav className="md:hidden border-b" aria-label="Mobile navigation">
        <div className="container mx-auto px-4 h-12 flex items-center justify-center gap-6">
          <ul className="flex items-center gap-6" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main id="main-content" className="flex-1 container mx-auto px-4 py-8" role="main">
        {children}
      </main>

      <footer className="border-t py-4" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          PropFi &mdash; Tokenized Real Estate Protocol
        </div>
      </footer>
      <Toaster />
    </div>
  )
}