export interface PropFiConfig {
  stellarNetwork: "testnet" | "mainnet"
  rpcUrl: string
  complianceRegistryId: string
  propertyRegistryId: string
  fractionVaultId: string
  mortgagePoolId: string
  rentDistributorId: string
  governanceId: string
}

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue
}

export function createConfig(): PropFiConfig {
  const isServer = typeof window === "undefined" || process.env.NODE_ENV === "test"
  
  if (isServer) {
    return {
      stellarNetwork: (getOptionalEnv("NEXT_PUBLIC_STELLAR_NETWORK", "testnet") as "testnet" | "mainnet"),
      rpcUrl: getOptionalEnv("NEXT_PUBLIC_RPC_URL", "https://soroban-testnet.stellar.org"),
      complianceRegistryId: getOptionalEnv("NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID", ""),
      propertyRegistryId: getOptionalEnv("NEXT_PUBLIC_PROPERTY_REGISTRY_ID", ""),
      fractionVaultId: getOptionalEnv("NEXT_PUBLIC_FRACTION_VAULT_ID", ""),
      mortgagePoolId: getOptionalEnv("NEXT_PUBLIC_MORTGAGE_POOL_ID", ""),
      rentDistributorId: getOptionalEnv("NEXT_PUBLIC_RENT_DISTRIBUTOR_ID", ""),
      governanceId: getOptionalEnv("NEXT_PUBLIC_GOVERNANCE_ID", ""),
    }
  }

  return {
    stellarNetwork: (getEnv("NEXT_PUBLIC_STELLAR_NETWORK") as "testnet" | "mainnet"),
    rpcUrl: getEnv("NEXT_PUBLIC_RPC_URL"),
    complianceRegistryId: getEnv("NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID"),
    propertyRegistryId: getEnv("NEXT_PUBLIC_PROPERTY_REGISTRY_ID"),
    fractionVaultId: getEnv("NEXT_PUBLIC_FRACTION_VAULT_ID"),
    mortgagePoolId: getEnv("NEXT_PUBLIC_MORTGAGE_POOL_ID"),
    rentDistributorId: getEnv("NEXT_PUBLIC_RENT_DISTRIBUTOR_ID"),
    governanceId: getEnv("NEXT_PUBLIC_GOVERNANCE_ID"),
  }
}

export const config = createConfig()