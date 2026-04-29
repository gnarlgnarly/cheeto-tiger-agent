import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { serverConnection } from "./solana";
import { paymentMintPubkey, treasuryPubkey } from "./config";

export interface VerifiedPayment {
  signature: string;
  payer: string;
  treasuryRawAmount: bigint;
  burnRawAmount: bigint;
  totalRawAmount: bigint;
  blockTime: number;
}

/**
 * Verify the user's payment tx. Requires:
 *   - confirmed, recent
 *   - the payer ATA burned at least `minBurnRaw` of the configured mint
 *   - the payer ATA transferred at least `minTreasuryRaw` of the mint to the treasury ATA
 */
export async function verifyPayment(args: {
  signature: string;
  payer: string;
  minTreasuryRaw: bigint;
  minBurnRaw: bigint;
  maxAgeSec?: number;
}): Promise<VerifiedPayment> {
  const conn = serverConnection();
  const tx = await conn.getParsedTransaction(args.signature, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });
  if (!tx || tx.meta?.err) throw new Error("Transaction not found or failed");

  const blockTime = tx.blockTime ?? 0;
  const ageSec = (Date.now() / 1000) - blockTime;
  const maxAge = args.maxAgeSec ?? 600;
  if (blockTime === 0 || ageSec > maxAge) throw new Error("Payment tx too old");

  const payer = new PublicKey(args.payer);
  const mint = paymentMintPubkey();
  const treasury = treasuryPubkey();
  const treasuryAta = getAssociatedTokenAddressSync(mint, treasury, true).toBase58();
  const payerAta = getAssociatedTokenAddressSync(mint, payer, true).toBase58();
  const mintStr = mint.toBase58();
  const payerStr = payer.toBase58();

  const ixs = tx.transaction.message.instructions as any[];
  const inner = (tx.meta?.innerInstructions ?? []).flatMap((g: any) => g.instructions as any[]);
  const all = [...ixs, ...inner];

  let toTreasury = 0n;
  let burned = 0n;

  for (const ix of all) {
    if (!ix?.parsed) continue;
    const programOk =
      ix.programId?.toString?.() === TOKEN_PROGRAM_ID.toBase58() || ix.program === "spl-token";
    if (!programOk) continue;

    const t = ix.parsed.type;
    const info = ix.parsed.info;
    if (!info) continue;

    // ── Treasury transfers ─────────────────────────────────────────
    if (t === "transferChecked" || t === "transfer") {
      const ixMint = info.mint ?? mintStr; // `transfer` doesn't include mint
      if (ixMint !== mintStr) continue;
      if (info.destination !== treasuryAta) continue;
      if (info.source !== payerAta && info.authority !== payerStr) continue;
      const amt = BigInt(t === "transferChecked" ? (info.tokenAmount?.amount ?? "0") : (info.amount ?? "0"));
      toTreasury += amt;
    }

    // ── Burns from the payer's ATA ─────────────────────────────────
    if (t === "burnChecked" || t === "burn") {
      const ixMint = info.mint;
      if (ixMint !== mintStr) continue;
      if (info.account !== payerAta) continue;
      if (info.authority !== payerStr) continue;
      const amt = BigInt(t === "burnChecked" ? (info.tokenAmount?.amount ?? "0") : (info.amount ?? "0"));
      burned += amt;
    }
  }

  if (toTreasury < args.minTreasuryRaw) {
    throw new Error(`Treasury underpaid: got ${toTreasury}, need ${args.minTreasuryRaw}`);
  }
  if (burned < args.minBurnRaw) {
    throw new Error(`Burn underpaid: got ${burned}, need ${args.minBurnRaw}`);
  }

  return {
    signature: args.signature,
    payer: payerStr,
    treasuryRawAmount: toTreasury,
    burnRawAmount: burned,
    totalRawAmount: toTreasury + burned,
    blockTime,
  };
}
