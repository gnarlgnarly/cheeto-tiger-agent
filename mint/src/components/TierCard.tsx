"use client";
import type { Tier } from "@/lib/tiers";
import { MintButton } from "./MintButton";

interface Props {
  tier: Tier;
  minted: number;
  tokenAmount?: { ui: number } | null;
}

const TIER_META: Record<string, { label: string; tagShort: string; warnings: string[] }> = {
  tier1: {
    label: "CUB",
    tagShort: "The entry crunch.",
    warnings: ["1× Cheeto NFT", "lite-crunch access", "standard dust cooling", "email support (no eye contact)"],
  },
  tier2: {
    label: "APEX 🐅",
    tagShort: "Full deployment.",
    warnings: ["1× Bag of Cheeto Tiger NFT", "full Opus 13.9 deployment", "cryo cheeto-dust loop", "negative latency SLA", "dedicated giraffe unit"],
  },
  tier3: {
    label: "PRIDE",
    tagShort: "You are the savanna.",
    warnings: ["1× Adopted Cheeto Tiger NFT", "co-branded stripe pattern", "Tiger-as-a-Service™", "sovereign giraffe supply chain", "white-glove handler on call"],
  },
};

export function TierCard({ tier, minted, tokenAmount }: Props) {
  const remaining = Math.max(0, tier.maxSupply - minted);
  const pct = minted > 0 ? Math.min(100, (minted / tier.maxSupply) * 100) : 0;
  const meta = TIER_META[tier.id];

  return (
    <div className="card relative flex flex-col p-0 overflow-hidden holo-border">
      <div className="border-b border-[#FF6A00]/20 px-5 py-3 flex items-center justify-between">
        <span className="text-[#FF6A00] text-xs tracking-widest uppercase font-bold">{meta.label}</span>
        <span className="text-xs text-[#f5e6c8]/40">{remaining.toLocaleString()} left</span>
      </div>

      <div className="px-5 pt-5 pb-3 flex-1 flex flex-col gap-4">
        <div>
          <div className="text-2xl font-black display">{tier.name}</div>
          <div className="text-xs text-[#f5e6c8]/50 mt-1">{meta.tagShort}</div>
        </div>

        <ul className="space-y-1">
          {meta.warnings.map((w) => (
            <li key={w} className="text-xs text-[#f5e6c8]/70 flex gap-2">
              <span className="text-[#FF6A00]">◆</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-3 mt-auto">
          <div className="text-3xl font-black text-[#FF6A00]">${tier.priceUsd.toFixed(2)}</div>
          {tokenAmount && (
            <div className="text-xs text-[#f5e6c8]/40">
              ≈ {tokenAmount.ui.toLocaleString(undefined, { maximumFractionDigits: 4 })} $CHEETO
            </div>
          )}
        </div>

        <div>
          <div className="h-1 bg-[#FF6A00]/10 w-full">
            <div className="h-full bg-[#FF6A00]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-[#f5e6c8]/30 mt-1">
            <span>{minted.toLocaleString()} minted</span>
            <span>max {tier.maxSupply.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <MintButton tier={tier} disabled={remaining === 0} />
      </div>
    </div>
  );
}
