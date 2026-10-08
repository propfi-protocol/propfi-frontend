import { z } from "zod"

export const attestationSchema = z.object({
  jurisdiction: z.string().min(2, "Jurisdiction must be at least 2 characters").max(10, "Jurisdiction must be at most 10 characters"),
  proofHash: z.string().min(10, "Proof hash must be at least 10 characters").max(128, "Proof hash must be at most 128 characters"),
})

export type AttestationFormData = z.infer<typeof attestationSchema>

export const supportedJurisdictions = ["US", "EU", "UK", "SG", "AE", "JP"] as const
export type SupportedJurisdiction = typeof supportedJurisdictions[number]

export function isValidJurisdiction(jurisdiction: string): jurisdiction is SupportedJurisdiction {
  return supportedJurisdictions.includes(jurisdiction as SupportedJurisdiction)
}