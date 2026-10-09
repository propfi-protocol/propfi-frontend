"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/components/WalletConnect"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkeletonDashboardStats, SkeletonCard } from "@/components/ui/skeleton"

interface PortfolioSummary {
  totalProperties: number
  totalFractions: bigint
  pendingYield: bigint
  activeLoans: number
}

export default function DashboardPage() {
  const { wallet } = useWallet()
  const [summary] = useState<PortfolioSummary>({
    totalProperties: 0,
    totalFractions: BigInt(0),
    pendingYield: BigInt(0),
    activeLoans: 0,
  })
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1" aria-live="polite">
          {wallet.connected
            ? `Connected as ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
            : "Connect your wallet to view your portfolio"}
        </p>
      </header>

      <section aria-labelledby="portfolio-heading" className="space-y-4">
        <h2 id="portfolio-heading" className="sr-only">
          Portfolio Summary
        </h2>
        {loading ? (
          <SkeletonDashboardStats aria-label="Loading portfolio statistics" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list">
            <Card role="listitem">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`${summary.totalProperties} properties`}>
                  {summary.totalProperties}
                </div>
                <p className="text-xs text-muted-foreground">Owned & invested</p>
              </CardContent>
            </Card>
            <Card role="listitem">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fractions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`${summary.totalFractions.toString()} fractions`}>
                  {summary.totalFractions.toString()}
                </div>
                <p className="text-xs text-muted-foreground">Total fraction balance</p>
              </CardContent>
            </Card>
            <Card role="listitem">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`${summary.pendingYield.toString()} pending yield`}>
                  {summary.pendingYield.toString()}
                </div>
                <p className="text-xs text-muted-foreground">Unclaimed rent yield</p>
              </CardContent>
            </Card>
            <Card role="listitem">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`${summary.activeLoans} active loans`}>
                  {summary.activeLoans}
                </div>
                <p className="text-xs text-muted-foreground">Outstanding mortgages</p>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <section aria-labelledby="tabs-heading">
        <h2 id="tabs-heading" className="sr-only">
          Portfolio Details
        </h2>
        <Tabs defaultValue="investments" className="space-y-4">
          <TabsList aria-label="Portfolio detail tabs">
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="yield">Yield History</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Investments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonCard aria-label="Loading investments" />
                ) : wallet.connected ? (
                  <p className="text-sm text-muted-foreground">
                    No investments yet. Browse properties to get started.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to view your investments.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yield History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonCard aria-label="Loading yield history" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Rent distribution history will appear here.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Loans</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonCard aria-label="Loading loans" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active loans. Check your mortgage status here.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}