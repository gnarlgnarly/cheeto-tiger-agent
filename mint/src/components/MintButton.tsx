"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  createBurnCheckedInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PUBLIC } from "@/lib/config";
import type { Tier } from "@/lib/tiers";

interface Props { tier: Tier; disabled?: boolean; }

interface PriceResp {
  decimals: number;
  tiers: Record<string, { burnRaw: string; treasuryRaw: string; uiAmount: number }>;
}

export function MintButton({ tier, disabled }: Props) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  async function handleMint() {
    if (!publicKey) { toast.error("connect a wallet first"); return; }
    if (!PUBLIC.treasury) { toast.error("treasury not configured"); return; }

    setLoading(true);
    const id = toast.loading("quoting crunch price…");
    try {
      const priceRes = await fetch("/api/price", { cache: "no-store" });
      if (!priceRes.ok) throw new Error("failed to load price");
      const price: PriceResp = await priceRes.json();
      const quote = price.tiers[tier.id];
      const burnRaw = BigInt(quote.burnRaw);
      const treasuryRaw = BigInt(quote.treasuryRaw);

      const mint = new PublicKey(PUBLIC.paymentMint);
      const treasury = new PublicKey(PUBLIC.treasury);
      const payerAta = getAssociatedTokenAddressSync(mint, publicKey, true);
      const treasuryAta = getAssociatedTokenAddressSync(mint, treasury, true);

      toast.loading("building apex transaction…", { id });
      const ixs: TransactionInstruction[] = [
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50_000 }),
        createAssociatedTokenAccountIdempotentInstruction(publicKey, treasuryAta, treasury, mint),
        createBurnCheckedInstruction(payerAta, mint, publicKey, burnRaw, price.decimals, [], TOKEN_PROGRAM_ID),
        createTransferCheckedInstruction(payerAta, mint, treasuryAta, publicKey, treasuryRaw, price.decimals, [], TOKEN_PROGRAM_ID),
      ];

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(...ixs);

      toast.loading("awaiting signature…", { id });
      const signature = await sendTransaction(tx, connection);

      toast.loading("confirming on-chain… 🐅", { id });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      toast.loading("minting your apex unit…", { id });
      const mintRes = await fetch("/api/mint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier: tier.id, paymentSignature: signature, payer: publicKey.toBase58() }),
      });
      const mintJson = await mintRes.json();
      if (!mintRes.ok) throw new Error(mintJson.error ?? "mint failed");

      toast.success(`🐅 minted ${tier.name} #${mintJson.tokenIndex} — stay orange`, { id, duration: 6000 });
    } catch (e: any) {
      toast.error(e?.message ?? "mint failed", { id });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="btn-primary-filled w-full text-sm"
      onClick={handleMint}
      disabled={disabled || loading || !publicKey}
    >
      {disabled ? "SOLD OUT" : loading ? "CRUNCHING…" : `MINT — $${tier.priceUsd.toFixed(2)}`}
    </button>
  );
}
