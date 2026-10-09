"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/WalletConnect"
import { useToast } from "@/hooks/useToast"
import { SkeletonCard } from "@/components/ui/skeleton"
import { attestationSchema, type AttestationFormData, supportedJurisdictions } from "@/lib/validations"

type AttestationStatus = "none" | "pending" | "verified" | "expired"

export default function CompliancePage() {
  const { wallet } = useWallet()
  const { toast } = useToast()
  const [status, setStatus] = useState<AttestationStatus>("none")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<AttestationFormData>({
    resolver: zodResolver(attestationSchema),
    defaultValues: {
      jurisdiction: "US",
      proofHash: "",
    },
  })

  const { watch, reset } = form
  const jurisdiction = watch("jurisdiction")
  const proofHash = watch("proofHash")

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const handleAttest = async (data: AttestationFormData) => {
    setStatus("pending")
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setStatus("verified")
      toast({
        title: "Attestation Submitted",
        description: "Your KYC attestation has been verified successfully.",
        variant: "success",
      })
    } catch {
      setStatus("none")
      toast({
        title: "Attestation Failed",
        description: "Failed to submit attestation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRevoke = async () => {
    try {
      setStatus("none")
      reset({ jurisdiction: "US", proofHash: "" })
      toast({
        title: "Attestation Revoked",
        description: "Your KYC attestation has been revoked.",
        variant: "success",
      })
    } catch {
      toast({
        title: "Revoke Failed",
        description: "Failed to revoke attestation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const statusConfig: Record<AttestationStatus, { label: string; variant: "success" | "warning" | "secondary" | "destructive" }> = {
    none: { label: "Not Attested", variant: "secondary" },
    pending: { label: "Pending", variant: "warning" },
    verified: { label: "Verified", variant: "success" },
    expired: { label: "Expired", variant: "destructive" },
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Compliance</h1>
        <p className="text-muted-foreground mt-1">
          KYC attestation and compliance management
        </p>
      </header>

      {!wallet.connected ? (
        <section aria-labelledby="wallet-required-heading">
          <h2 id="wallet-required-heading" className="sr-only">
            Wallet Connection Required
          </h2>
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Connect your wallet to manage compliance attestations.
            </CardContent>
          </Card>
        </section>
      ) : loading ? (
        <section aria-label="Loading compliance data">
          <div className="grid gap-6 md:grid-cols-2" role="status" aria-busy="true">
            <SkeletonCard aria-label="Loading attestation status" />
            <SkeletonCard aria-label="Loading attestation form" />
            <SkeletonCard className="md:col-span-2" aria-label="Loading supported jurisdictions" />
          </div>
        </section>
      ) : (
        <>
          <section aria-labelledby="status-heading" className="space-y-6">
            <h2 id="status-heading" className="sr-only">
              Attestation Status
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Attestation Status</CardTitle>
                <CardDescription>Your current KYC attestation status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3" role="status" aria-live="polite">
                  <Badge variant={statusConfig[status].variant}>
                    {statusConfig[status].label}
                  </Badge>
                  {status === "verified" && (
                    <span className="text-sm text-muted-foreground">
                      Expires in 365 days
                    </span>
                  )}
                </div>

                {status === "none" && (
                  <p className="text-sm text-muted-foreground" role="alert">
                    You need to complete KYC attestation to participate in property
                    investments and transfers.
                  </p>
                )}

                {status === "verified" && (
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Wallet</dt>
                      <dd className="font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Jurisdiction</dt>
                      <dd>{jurisdiction}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Proof Hash</dt>
                      <dd className="font-mono text-xs">
                        {proofHash.slice(0, 10)}...
                      </dd>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="action-heading" className="space-y-6">
            <h2 id="action-heading" className="sr-only">
              {status === "verified" ? "Manage Attestation" : "Request Attestation"}
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>
                  {status === "verified" ? "Manage Attestation" : "Request Attestation"}
                </CardTitle>
                <CardDescription>
                  {status === "verified"
                    ? "Revoke your current attestation"
                    : "Submit your KYC proof for verification"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status !== "verified" ? (
                  <form onSubmit={form.handleSubmit(handleAttest)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Input
                        id="jurisdiction"
                        {...form.register("jurisdiction")}
                        placeholder="e.g. US, EU, UK"
                        disabled={status === "pending"}
                        aria-describedby="jurisdiction-hint"
                        aria-invalid={!!form.formState.errors.jurisdiction}
                      />
                      <p id="jurisdiction-hint" className="text-xs text-muted-foreground">
                        Select your jurisdiction from the supported list below
                      </p>
                      {form.formState.errors.jurisdiction && (
                        <p className="text-sm text-destructive" role="alert" id="jurisdiction-error">
                          {form.formState.errors.jurisdiction.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proofHash">Proof Hash</Label>
                      <Input
                        id="proofHash"
                        {...form.register("proofHash")}
                        placeholder="Enter KYC proof hash"
                        disabled={status === "pending"}
                        aria-describedby="proof-hash-hint"
                        aria-invalid={!!form.formState.errors.proofHash}
                      />
                      <p id="proof-hash-hint" className="text-xs text-muted-foreground">
                        Enter the cryptographic proof hash from your KYC provider
                      </p>
                      {form.formState.errors.proofHash && (
                        <p className="text-sm text-destructive" role="alert" id="proof-hash-error">
                          {form.formState.errors.proofHash.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={status === "pending"}
                      className="w-full"
                      aria-busy={status === "pending"}
                    >
                      {status === "pending" ? "Submitting..." : "Submit Attestation"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground" role="status">
                      Your attestation is active. You can revoke it at any time.
                    </p>
                    <Button
                      onClick={handleRevoke}
                      variant="destructive"
                      className="w-full"
                      aria-label="Revoke your current KYC attestation"
                    >
                      Revoke Attestation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="jurisdictions-heading">
            <h2 id="jurisdictions-heading" className="sr-only">
              Supported Jurisdictions
            </h2>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Supported Jurisdictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Supported jurisdictions">
                  {supportedJurisdictions.map((j) => (
                    <Badge key={j} variant="outline" className="text-sm" role="listitem">
                      {j}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Select a supported jurisdiction when submitting your attestation.
                </p>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}