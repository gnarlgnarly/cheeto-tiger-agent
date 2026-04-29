export type TierId = "tier1" | "tier2" | "tier3";

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
  priceUsd: number;
  maxSupply: number;
  collectionEnvKey: "NEXT_PUBLIC_COLLECTION_TIER1" | "NEXT_PUBLIC_COLLECTION_TIER2" | "NEXT_PUBLIC_COLLECTION_TIER3";
  metadataEnvKey: "NEXT_PUBLIC_TIER1_METADATA_URI" | "NEXT_PUBLIC_TIER2_METADATA_URI" | "NEXT_PUBLIC_TIER3_METADATA_URI";
  accent: string;
}

export const TIERS: Record<TierId, Tier> = {
  tier1: {
    id: "tier1",
    name: "Cheeto",
    tagline: "A single crunchy companion. The starter Cheeto.",
    priceUsd: 1.59,
    maxSupply: 5000,
    collectionEnvKey: "NEXT_PUBLIC_COLLECTION_TIER1",
    metadataEnvKey: "NEXT_PUBLIC_TIER1_METADATA_URI",
    accent: "from-amber-400 to-orange-500",
  },
  tier2: {
    id: "tier2",
    name: "Bag of the Cheeto Tiger",
    tagline: "A whole bag. For the truly devoted.",
    priceUsd: 10.59,
    maxSupply: 1000,
    collectionEnvKey: "NEXT_PUBLIC_COLLECTION_TIER2",
    metadataEnvKey: "NEXT_PUBLIC_TIER2_METADATA_URI",
    accent: "from-orange-500 to-red-600",
  },
  tier3: {
    id: "tier3",
    name: "Adopted Cheeto Tiger",
    tagline: "Officially adopt one of only 100 Cheeto Tigers.",
    priceUsd: 50.10,
    maxSupply: 100,
    collectionEnvKey: "NEXT_PUBLIC_COLLECTION_TIER3",
    metadataEnvKey: "NEXT_PUBLIC_TIER3_METADATA_URI",
    accent: "from-rose-500 via-orange-600 to-yellow-500",
  },
};

export const TIER_LIST: Tier[] = [TIERS.tier1, TIERS.tier2, TIERS.tier3];
