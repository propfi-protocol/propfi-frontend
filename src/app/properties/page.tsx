"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/components/WalletConnect"
import { useToast } from "@/hooks/useToast"
import { PropertyStatus } from "@/lib/propfi"
import { SkeletonPropertyCard } from "@/components/ui/skeleton"

interface PropertyItem {
  id: number
  owner: string
  valuation: bigint
  status: PropertyStatus
  location: string
}

const MOCK_PROPERTIES: PropertyItem[] = [
  { id: 1, owner: "GBZC...", valuation: BigInt(500000), status: PropertyStatus.Active, location: "New York, NY" },
  { id: 2, owner: "GBZC...", valuation: BigInt(350000), status: PropertyStatus.Active, location: "San Francisco, CA" },
  { id: 3, owner: "GBZC...", valuation: BigInt(750000), status: PropertyStatus.Active, location: "Austin, TX" },
  { id: 4, owner: "GBZC...", valuation: BigInt(200000), status: PropertyStatus.UnderMaintenance, location: "Miami, FL" },
]

const statusBadgeVariant: Record<PropertyStatus, "default" | "secondary" | "warning" | "success"> = {
  [PropertyStatus.Active]: "success",
  [PropertyStatus.Inactive]: "secondary",
  [PropertyStatus.UnderMaintenance]: "warning",
}

export default function PropertiesPage() {
  const { wallet } = useWallet()
  const { toast } = useToast()
  const [properties] = useState<PropertyItem[]>(MOCK_PROPERTIES)
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const filtered = properties.filter(
    (p) =>
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)
  )

  const formatValuation = (val: bigint): string => {
    const num = Number(val)
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
    return `$${num}`
  }

  const handleBuyFractions = async (propertyId: number) => {
    toast({
      title: "Buy Fractions",
      description: `Redirecting to buy fractions for Property #${propertyId}...`,
      variant: "default",
    })
  }

  const handleViewDetails = (propertyId: number) => {
    toast({
      title: "View Details",
      description: `Opening details for Property #${propertyId}`,
      variant: "default",
    })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground mt-1">
          Browse tokenized real estate properties
        </p>
      </header>

      <section aria-labelledby="search-heading" className="space-y-2">
        <h2 id="search-heading" className="sr-only">
          Search Properties
        </h2>
        <label htmlFor="property-search" className="sr-only">
          Search by location or property ID
        </label>
        <Input
          id="property-search"
          placeholder="Search by location or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          disabled={loading}
          aria-describedby="search-hint"
        />
        <p id="search-hint" className="text-sm text-muted-foreground">
          Search properties by location name or property ID
        </p>
      </section>

      <section aria-labelledby="properties-heading">
        <h2 id="properties-heading" className="sr-only">
          Property Listings
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPropertyCard key={i} aria-label={`Loading property ${i + 1}`} />
            ))
          ) : filtered.length === 0 ? (
            <Card className="col-span-full" role="status">
              <CardContent className="p-6 text-center text-muted-foreground">
                No properties found matching your search.
              </CardContent>
            </Card>
          ) : (
            filtered.map((property) => (
              <article key={property.id} className="overflow-hidden" role="listitem">
                <Card className="overflow-hidden h-full">
                  <div className="h-2 bg-primary" aria-hidden="true" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Property #{property.id}</CardTitle>
                      <Badge variant={statusBadgeVariant[property.status]} aria-label={`Status: ${property.status}`}>
                        {property.status}
                      </Badge>
                    </div>
                    <CardDescription>{property.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Valuation</dt>
                        <dd className="font-medium">{formatValuation(property.valuation)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Owner</dt>
                        <dd className="font-mono text-xs">{property.owner}</dd>
                      </div>
                    </dl>
                    {wallet.connected && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleBuyFractions(property.id)}
                          aria-label={`Buy fractions for Property #${property.id}`}
                        >
                          Buy Fractions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(property.id)}
                          aria-label={`View details for Property #${property.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}