# Cheeto Tiger — Mint

Production-leaning Next.js 14 + Solana scaffold for the Cheeto Tiger NFT drop.

| Tier | NFT | Price | Supply |
|------|-----|------:|-------:|
| 1 | Cheeto | $1.59 | 5,000 |
| 2 | Bag of the Cheeto Tiger | $10.59 | 1,000 |
| 3 | Adopted Cheeto Tiger | $50.10 | 100 |

Payment token: `7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr` ($CHEETO).

## Architecture

```
[ Browser + Wallet ]
   │  1. GET /api/price       → live USD/$CHEETO + per-tier { burnRaw, treasuryRaw }
   │  2. signs ONE tx with TWO ixs:
   │       • burnChecked  (payer ATA, 50% of total)
   │       • transferChecked (payer ATA → treasury ATA, 50% of total)
   │  3. POST /api/mint       { tier, paymentSignature, payer }
   ▼
[ Next.js API ]
   ├─ verifyPayment()   parses the tx, asserts mint/destination/amount/age
   ├─ idempotency       refuses to reuse the same signature
   └─ mintTierNftTo()   mpl-core create() into the tier collection → recipient
                        (max-supply enforced by the MasterEdition plugin)
```

- **Pricing**: Jupiter price API (`/price/v2`) → USD/token, cached 30s, with 2% slippage tolerance on verify.
- **Fee split**: every payment is bisected on-chain in the same transaction — **50% burned**, 50% to treasury. The verifier rejects the mint unless *both* legs landed.
- **NFT standard**: Metaplex Core (`mpl-core`) — cheaper, simpler, and supports per-collection max supply natively.
- **Treasury**: any Solana wallet you control. Configured via `NEXT_PUBLIC_TREASURY_WALLET`.
- **Mint authority**: server-side keypair (base58 secret in `MINT_AUTHORITY_SECRET`). Holds NO funds beyond rent for txn fees.

## Setup

```bash
# 1. install
npm install        # or: bun install

# 2. env
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_TREASURY_WALLET   — your treasury pubkey
#   MINT_AUTHORITY_SECRET         — base58 secret of a freshly-generated keypair (fund with ~0.5 SOL)
#   NEXT_PUBLIC_TIER{1,2,3}_METADATA_URI — off-chain JSON URIs you upload (Arweave/IPFS/CDN)

# 3. bootstrap collections (one-time)
npm run create-collections
# Copy the printed collection addresses into .env.local under
#   NEXT_PUBLIC_COLLECTION_TIER1 / 2 / 3

# 4. run
npm run dev
```

## Off-chain metadata

For each tier, host a JSON file like:

```json
{
  "name": "Cheeto Tiger",
  "symbol": "CHEETO",
  "description": "Adopted Cheeto Tiger — 1 of 100.",
  "image": "https://your-cdn/tier3.png",
  "attributes": [{ "trait_type": "Tier", "value": "Adopted" }],
  "properties": { "files": [{ "uri": "https://your-cdn/tier3.png", "type": "image/png" }] }
}
```

Reference URIs in `.env.local` via `NEXT_PUBLIC_TIER1_METADATA_URI` etc.

## Production hardening checklist

- [ ] Replace public RPC with Helius / Triton / QuickNode (set both `SOLANA_RPC` and `NEXT_PUBLIC_SOLANA_RPC`).
- [ ] Move `data/minted.json` idempotency to Postgres or Redis (`src/lib/idempotency.ts`).
- [ ] Add a rate limiter on `/api/mint` (e.g. Upstash) keyed by IP + payer.
- [ ] Cold-store the mint authority — keep only rent + fee SOL hot.
- [ ] Set up Sentry / structured logging on the API routes.
- [ ] Lock `JUPITER_PRICE_URL` to the paid `https://api.jup.ag/price/v2` once volume warrants.
- [ ] Pre-flight Solana program upgrade if you swap to a fully on-chain price oracle (Pyth) instead of Jupiter.
- [ ] Add explicit royalty / freeze plugin config when creating the collection if you want secondary-market enforcement.

## File map

```
src/
  app/
    api/price/route.ts     live USD price + per-tier raw amounts
    api/supply/route.ts    on-chain numMinted per collection
    api/mint/route.ts      verify payment → mint NFT → record idempotency
    page.tsx               landing + tier cards
    layout.tsx, providers.tsx, globals.css
  components/              Hero, TierCard, MintButton, WalletButton, Specs
  lib/
    config.ts              all env-driven config
    tiers.ts               tier definitions (price, supply, metadata key)
    price.ts               Jupiter price + USD→raw-units conversion
    solana.ts              server connection + mint authority loader
    verify.ts              parses + validates the user's payment tx
    mint.ts                mpl-core create() into collection
    idempotency.ts         payment-signature dedupe (dev: file; prod: swap)
  scripts/create-collections.ts   one-time bootstrap
```

## Notes

- The `MaxSupply` cap is enforced on-chain by the collection plugin, not by the server. Even a buggy API can't overshoot.
- Slippage: the API requires `0.98 × usd_price` worth of $CHEETO at verify time, so a price tick between quote and confirm doesn't strand a paid mint.
- The mint flow is two-step (pay, then mint) on purpose — atomic "pay-and-mint" requires a custom Anchor program. The two-step model is reversible only via server refund logic, which is why idempotency + slippage tolerance matter.
