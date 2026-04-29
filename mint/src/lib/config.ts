import { PublicKey } from "@solana/web3.js";

const required = (k: string, v: string | undefined): string => {
  if (!v) throw new Error(`Missing required env var: ${k}`);
  return v;
};

export const PUBLIC = {
  cluster: process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "mainnet-beta",
  rpc: process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com",
  paymentMint: process.env.NEXT_PUBLIC_PAYMENT_MINT ?? "7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr",
  paymentDecimals: process.env.NEXT_PUBLIC_PAYMENT_DECIMALS
    ? Number(process.env.NEXT_PUBLIC_PAYMENT_DECIMALS)
    : undefined,
  treasury: process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "",
  collections: {
    tier1: process.env.NEXT_PUBLIC_COLLECTION_TIER1 ?? "",
    tier2: process.env.NEXT_PUBLIC_COLLECTION_TIER2 ?? "",
    tier3: process.env.NEXT_PUBLIC_COLLECTION_TIER3 ?? "",
  },
  metadata: {
    tier1: process.env.NEXT_PUBLIC_TIER1_METADATA_URI ?? "",
    tier2: process.env.NEXT_PUBLIC_TIER2_METADATA_URI ?? "",
    tier3: process.env.NEXT_PUBLIC_TIER3_METADATA_URI ?? "",
  },
} as const;

export const SERVER = {
  rpc: process.env.SOLANA_RPC ?? PUBLIC.rpc,
  mintAuthoritySecret: () => required("MINT_AUTHORITY_SECRET", process.env.MINT_AUTHORITY_SECRET),
  jupiterPriceUrl: process.env.JUPITER_PRICE_URL ?? "https://lite-api.jup.ag/price/v2",
  priceOverrideUsd: process.env.PRICE_OVERRIDE_USD ? Number(process.env.PRICE_OVERRIDE_USD) : undefined,
};

export const treasuryPubkey = (): PublicKey => {
  if (!PUBLIC.treasury) throw new Error("NEXT_PUBLIC_TREASURY_WALLET not configured");
  return new PublicKey(PUBLIC.treasury);
};

export const paymentMintPubkey = (): PublicKey => new PublicKey(PUBLIC.paymentMint);
