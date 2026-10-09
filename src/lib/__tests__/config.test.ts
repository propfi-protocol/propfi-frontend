import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"

describe("config", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    vi.stubEnv("NODE_ENV", "test")
  })

  afterEach(() => {
    process.env = originalEnv
    vi.unstubAllEnvs()
  })

  it("should create config with all required env vars", async () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "testnet"
    process.env.NEXT_PUBLIC_RPC_URL = "https://test.rpc"
    process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID = "C123"
    process.env.NEXT_PUBLIC_PROPERTY_REGISTRY_ID = "C456"
    process.env.NEXT_PUBLIC_FRACTION_VAULT_ID = "C789"
    process.env.NEXT_PUBLIC_MORTGAGE_POOL_ID = "C012"
    process.env.NEXT_PUBLIC_RENT_DISTRIBUTOR_ID = "C345"
    process.env.NEXT_PUBLIC_GOVERNANCE_ID = "C678"

    const { createConfig } = await import("../config")
    const config = createConfig()

    expect(config.stellarNetwork).toBe("testnet")
    expect(config.rpcUrl).toBe("https://test.rpc")
    expect(config.complianceRegistryId).toBe("C123")
    expect(config.propertyRegistryId).toBe("C456")
    expect(config.fractionVaultId).toBe("C789")
    expect(config.mortgagePoolId).toBe("C012")
    expect(config.rentDistributorId).toBe("C345")
    expect(config.governanceId).toBe("C678")
  })

  it("should use default values when env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_STELLAR_NETWORK
    delete process.env.NEXT_PUBLIC_RPC_URL
    delete process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID

    const { createConfig } = await import("../config")
    const config = createConfig()

    expect(config.stellarNetwork).toBe("testnet")
    expect(config.rpcUrl).toBe("https://soroban-testnet.stellar.org")
    expect(config.complianceRegistryId).toBe("")
    expect(config.propertyRegistryId).toBe("")
  })
})