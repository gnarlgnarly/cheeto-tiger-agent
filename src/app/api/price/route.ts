import { NextResponse } from "next/server";
import { getTokenPriceUsd, usdToTokenBaseUnits, splitBurnTreasury } from "@/lib/price";
import { getMintDecimals } from "@/lib/solana";
import { PUBLIC } from "@/lib/config";
import { TIERS } from "@/lib/tiers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const decimals = PUBLIC.paymentDecimals ?? (await getMintDecimals(PUBLIC.paymentMint));
    const price = await getTokenPriceUsd();
    const quote = (usd: number) => {
      const raw = usdToTokenBaseUnits(usd, price.usdPerToken, decimals);
      const { burn, treasury } = splitBurnTreasury(raw);
      return {
        rawAmount: raw.toString(),
        uiAmount: Number(raw) / 10 ** decimals,
        burnRaw: burn.toString(),
        treasuryRaw: treasury.toString(),
      };
    };
    return NextResponse.json({
      mint: PUBLIC.paymentMint,
      decimals,
      usdPerToken: price.usdPerToken,
      source: price.source,
      tiers: {
        tier1: { usd: TIERS.tier1.priceUsd, ...quote(TIERS.tier1.priceUsd) },
        tier2: { usd: TIERS.tier2.priceUsd, ...quote(TIERS.tier2.priceUsd) },
        tier3: { usd: TIERS.tier3.priceUsd, ...quote(TIERS.tier3.priceUsd) },
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "price failed" }, { status: 500 });
  }
}
