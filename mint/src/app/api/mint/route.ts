import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TIERS, type TierId } from "@/lib/tiers";
import { getTokenPriceUsd, usdToTokenBaseUnits, splitBurnTreasury } from "@/lib/price";
import { getMintDecimals } from "@/lib/solana";
import { PUBLIC } from "@/lib/config";
import { verifyPayment } from "@/lib/verify";
import { mintTierNftTo } from "@/lib/mint";
import { isSignatureUsed, recordMint } from "@/lib/idempotency";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  tier: z.enum(["tier1", "tier2", "tier3"]),
  paymentSignature: z.string().min(32).max(128),
  payer: z.string().min(32).max(64),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { tier, paymentSignature, payer } = Body.parse(json);

    if (await isSignatureUsed(paymentSignature)) {
      return NextResponse.json({ error: "Payment already redeemed" }, { status: 409 });
    }

    const tierCfg = TIERS[tier as TierId];
    const decimals = PUBLIC.paymentDecimals ?? (await getMintDecimals(PUBLIC.paymentMint));
    const price = await getTokenPriceUsd();

    // 2% slippage tolerance — protects against price-tick races between quote & verify
    const requiredTotal = usdToTokenBaseUnits(tierCfg.priceUsd * 0.98, price.usdPerToken, decimals);
    const { burn: minBurn, treasury: minTreasury } = splitBurnTreasury(requiredTotal);

    const verified = await verifyPayment({
      signature: paymentSignature,
      payer,
      minTreasuryRaw: minTreasury,
      minBurnRaw: minBurn,
    });

    const minted = await mintTierNftTo({ tier: tier as TierId, recipient: verified.payer });

    await recordMint({
      signature: paymentSignature,
      tier,
      recipient: verified.payer,
      asset: minted.asset,
      at: Date.now(),
    });

    return NextResponse.json({
      ok: true,
      asset: minted.asset,
      mintSignature: minted.signature,
      tokenIndex: minted.numMinted,
      maxSupply: minted.maxSupply,
      paid: {
        treasury: verified.treasuryRawAmount.toString(),
        burned: verified.burnRawAmount.toString(),
      },
    });
  } catch (e: any) {
    const msg = e?.message ?? "mint failed";
    const status = /sold out|underpaid|already redeemed/i.test(msg) ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
