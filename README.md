# PropFi Frontend

> **Next.js dApp for the PropFi decentralized real estate protocol on Stellar**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Stellar](https://img.shields.io/badge/Network-Stellar-black)](https://stellar.org)

---

The PropFi frontend is a Next.js 14 application that provides a user interface for interacting with the PropFi protocol — tokenizing properties, buying fractions, claiming yield, managing mortgages, and participating in governance.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Wallet:** Freighter Wallet
- **UI:** shadcn/ui · Radix UI · TailwindCSS
- **SDK:** [@propfi/sdk](https://github.com/propfi-protocol/propfi-sdk)
- **Language:** TypeScript

## Pages

| Route         | Description                                 |
| ------------- | ------------------------------------------- |
| `/dashboard`  | Portfolio overview — holdings, yield, loans |
| `/properties` | Browse and search tokenized properties      |
| `/compliance` | KYC attestation and credential management   |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID=C...
NEXT_PUBLIC_PROPERTY_REGISTRY_ID=C...
NEXT_PUBLIC_FRACTION_VAULT_ID=C...
NEXT_PUBLIC_MORTGAGE_POOL_ID=C...
NEXT_PUBLIC_RENT_DISTRIBUTOR_ID=C...
NEXT_PUBLIC_GOVERNANCE_ID=C...
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## SDK Usage

```typescript
import { createPropFi } from "@propfi/sdk";

const propfi = createPropFi({
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  complianceRegistryId: process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY_ID!,
  propertyRegistryId: process.env.NEXT_PUBLIC_PROPERTY_REGISTRY_ID!,
  fractionVaultId: process.env.NEXT_PUBLIC_FRACTION_VAULT_ID!,
  mortgagePoolId: process.env.NEXT_PUBLIC_MORTGAGE_POOL_ID!,
});
```

## Related Repos

- [propfi-contracts](https://github.com/propfi-protocol/propfi-contracts) — Soroban smart contracts
- [propfi-sdk](https://github.com/propfi-protocol/propfi-sdk) — TypeScript client SDK

## License

MIT © 2024 PropFi Contributors. See [LICENSE](LICENSE) for details.
