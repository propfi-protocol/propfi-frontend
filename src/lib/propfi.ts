import {
  createPropFi,
  type PropFiSDK,
  type PropFiConfig,
  type PropertyData,
  type FractionInfo,
  type Attestation,
  type HealthFactor,
  type ProposalData,
  type JurisdictionRules,
  PropertyStatus,
  LoanStatus,
} from "@propfi/sdk"
import { config } from "./config"

export type {
  PropFiSDK,
  PropFiConfig,
  PropertyData,
  FractionInfo,
  Attestation,
  HealthFactor,
  ProposalData,
  JurisdictionRules,
}
export { PropertyStatus, LoanStatus }

export function createPropFiSDK(): PropFiSDK {
  return createPropFi({
    rpcUrl: config.rpcUrl,
    complianceRegistryId: config.complianceRegistryId,
    propertyRegistryId: config.propertyRegistryId,
    fractionVaultId: config.fractionVaultId,
    mortgagePoolId: config.mortgagePoolId,
  })
}

function getNetworkPassphrase(): string {
  return config.stellarNetwork === "testnet"
    ? "Test SDF Network ; September 2015"
    : "Public Global Stellar Network ; September 2015"
}

export interface FreighterSigner {
  getPublicKey(): Promise<string>
  signTransaction(txXdr: string): Promise<string>
}

function getFreighter() {
  if (typeof window === "undefined" || !window.freighter) {
    throw new Error("Freighter wallet not available")
  }
  return window.freighter
}

export function createFreighterSigner(): FreighterSigner {
  const networkPassphrase = getNetworkPassphrase()
  return {
    async getPublicKey(): Promise<string> {
      const f = getFreighter()
      const { publicKey } = await f.getPublicKey()
      return publicKey
    },
    async signTransaction(txXdr: string): Promise<string> {
      const f = getFreighter()
      const { signedTxXdr } = await f.signTransaction(txXdr, {
        networkPassphrase,
      })
      return signedTxXdr
    },
  }
}

export async function isFreighterAvailable(): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    if (!window.freighter) return false
    const { isConnected } = await window.freighter.isConnected()
    return isConnected
  } catch {
    return false
  }
}

declare global {
  interface Window {
    freighter?: {
      getPublicKey(): Promise<{ publicKey: string }>
      signTransaction(
        txXdr: string,
        opts?: { networkPassphrase?: string }
      ): Promise<{ signedTxXdr: string }>
      isConnected(): Promise<{ isConnected: boolean }>
    }
  }
}
