"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletButton } from "@/components/WalletButton";
import { Marquee } from "@/components/Marquee";
import { TierCard } from "@/components/TierCard";
import { Gallery } from "@/components/Gallery";
import { SpecsTable } from "@/components/SpecsTable";
import { ArchStack } from "@/components/ArchStack";
import { BootSequence } from "@/components/BootSequence";
import { FYQ } from "@/components/FYQ";
import { HoloCard } from "@/components/HoloCard";
import { AgentTab } from "@/components/AgentTab";
import { TIER_LIST, type TierId } from "@/lib/tiers";

type Tab = "mint" | "agent";

interface Supply { minted: number; max: number }
type SupplyMap = Record<TierId, Supply>;
interface PriceResp {
  decimals: number;
  usdPerToken: number;
  tiers: Record<TierId, { uiAmount: number; burnRaw: string; treasuryRaw: string }>;
}

const CA = "7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("mint");
  const [supply, setSupply] = useState<SupplyMap | null>(null);
  const [price, setPrice] = useState<PriceResp | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          fetch("/api/supply").then((r) => r.json()),
          fetch("/api/price").then((r) => r.json()),
        ]);
        if (cancelled) return;
        setSupply(s);
        setPrice(p);
      } catch { /* noop */ }
    };
    load();
    const t = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return (
    <main className="min-h-screen">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-[#FF6A00]/20 bg-[#080604]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative size-7">
              <Image src="/images/tiger1.jpg" alt="Cheeto Tiger" fill className="object-cover" />
            </div>
            <span className="font-bold tracking-widest text-xs uppercase text-[#FF6A00] hidden sm:block">
              CHEETO TIGER™
            </span>
          </div>

          {/* tabs */}
          <div className="flex gap-1">
            <button className={`tab-btn ${tab === "mint" ? "active" : ""}`} onClick={() => setTab("mint")}>
              🐅 MINT
            </button>
            <button className={`tab-btn ${tab === "agent" ? "active" : ""}`} onClick={() => setTab("agent")}>
              AGENT
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://x.com/mfcheetotiger"
              target="_blank" rel="noopener noreferrer"
              className="text-[#FF6A00]/60 hover:text-[#FF6A00] text-xs tracking-widest hidden sm:block"
            >
              𝕏
            </a>
            <WalletButton />
          </div>
        </div>
      </nav>

      {tab === "agent" ? (
        <AgentTab />
      ) : (
        <>
          {/* ── HERO ── */}
          <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[#FF6A00] text-xs tracking-widest mb-3">
                CA: <span className="opacity-70 break-all">{CA}</span>
              </div>
              <h1 className="display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                CHEETO<br />
                <span className="gradient-text orange-glow">TIGER™</span>
              </h1>
              <p className="mt-5 text-sm text-[#f5e6c8]/60 leading-relaxed max-w-md font-mono">
                The world's first crunch-powered, dust-cooled apex AGI running on Opus 13.9.
                Mint a derivative. Burn half your payment. Stay orange.
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <a href="#mint" className="btn-primary-filled">MINT NOW</a>
                <a
                  href="https://x.com/mfcheetotiger"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                >
                  𝕏 FOLLOW
                </a>
              </div>
              <div className="mt-6 text-[10px] text-[#f5e6c8]/30 font-mono space-y-1">
                <div>⚠ DO NOT FEED THE APEX UNIT AFTER MIDNIGHT</div>
                <div>⚠ DO NOT MAKE SUSTAINED EYE CONTACT</div>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square max-w-sm mx-auto border border-[#FF6A00]/20"
                   style={{ boxShadow: "0 0 60px rgba(255,106,0,0.2)" }}>
                <Image
                  src="/images/tiger1.jpg"
                  alt="Cheeto Tiger — the apex unit"
                  fill
                  className="object-cover tiger-chain"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-[#39FF14] space-y-0.5">
                  <div>UPTIME: 9,001 HRS ●</div>
                  <div>CRUNCH/SEC: 4.2T ●</div>
                  <div>STATUS: APEX ●</div>
                </div>
              </div>
            </div>
          </section>

          <Marquee />

          {/* ── MINT TIERS ── */}
          <section id="mint" className="max-w-6xl mx-auto px-4 py-20">
            <div className="mb-2 text-[#FF6A00] text-xs tracking-widest uppercase">◆ PICK YOUR TIER</div>
            <h2 className="display text-3xl font-black mb-10">Deployment Tiers</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {TIER_LIST.map((tier) => (
                <HoloCard key={tier.id}>
                  <TierCard
                    tier={tier}
                    minted={supply?.[tier.id]?.minted ?? 0}
                    tokenAmount={price?.tiers?.[tier.id] ? { ui: price.tiers[tier.id].uiAmount } : null}
                  />
                </HoloCard>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-[#f5e6c8]/30 font-mono">
              50% of every payment is burned on-chain · 50% to treasury · enforced per transaction · NFA · DYOR
            </p>
          </section>

          <Gallery />
          <SpecsTable />
          <ArchStack />

          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-6 text-[#FF6A00] text-xs tracking-widest uppercase">◆ LIVE BOOT SEQUENCE</div>
            <BootSequence />
          </div>

          <FYQ />

          {/* ── FOOTER ── */}
          <footer className="border-t border-[#FF6A00]/15 py-10 mt-10">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="text-[#FF6A00] font-bold text-sm tracking-widest">CHEETO TIGER™</div>
                <div className="text-[10px] text-[#f5e6c8]/30 mt-1 max-w-xs break-all">{CA}</div>
              </div>
              <div className="text-[10px] text-[#f5e6c8]/30 font-mono space-y-1 text-right">
                <div>© 2026 CHEETO TIGER™ INDUSTRIES</div>
                <div>ALL SNACK TRIBUTES MUST PASS THROUGH /tribute</div>
                <div>
                  <a href="https://x.com/mfcheetotiger" target="_blank" rel="noopener noreferrer"
                     className="text-[#FF6A00]/60 hover:text-[#FF6A00]">𝕏 @mfcheetotiger</a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
