import { describe, it, expect } from "vitest"
import { attestationSchema, supportedJurisdictions, isValidJurisdiction, type AttestationFormData } from "../validations"

describe("validations", () => {
  describe("attestationSchema", () => {
    it("should validate valid form data", () => {
      const validData: AttestationFormData = {
        jurisdiction: "US",
        proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      }

      const result = attestationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject empty jurisdiction", () => {
      const invalidData = {
        jurisdiction: "",
        proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.jurisdiction).toBeDefined()
        expect(errors.jurisdiction?.[0]).toContain("at least 2 characters")
      }
    })

    it("should reject jurisdiction too short", () => {
      const invalidData = {
        jurisdiction: "U",
        proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject jurisdiction too long", () => {
      const invalidData = {
        jurisdiction: "UNITEDSTATES",
        proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject empty proof hash", () => {
      const invalidData = {
        jurisdiction: "US",
        proofHash: "",
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.proofHash).toBeDefined()
        expect(errors.proofHash?.[0]).toContain("at least 10 characters")
      }
    })

    it("should reject proof hash too short", () => {
      const invalidData = {
        jurisdiction: "US",
        proofHash: "0x123",
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject proof hash too long", () => {
      const invalidData = {
        jurisdiction: "US",
        proofHash: "0x" + "a".repeat(130),
      }

      const result = attestationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("supportedJurisdictions", () => {
    it("should contain expected jurisdictions", () => {
      expect(supportedJurisdictions).toEqual(["US", "EU", "UK", "SG", "AE", "JP"])
    })

    it("should be readonly", () => {
      expect(Object.isFrozen(supportedJurisdictions)).toBe(false)
    })
  })

  describe("isValidJurisdiction", () => {
    it("should return true for supported jurisdictions", () => {
      supportedJurisdictions.forEach((j) => {
        expect(isValidJurisdiction(j)).toBe(true)
      })
    })

    it("should return false for unsupported jurisdictions", () => {
      expect(isValidJurisdiction("CA")).toBe(false)
      expect(isValidJurisdiction("")).toBe(false)
      expect(isValidJurisdiction("USA")).toBe(false)
    })
  })
})