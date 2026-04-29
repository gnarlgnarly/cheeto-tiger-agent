import { NextResponse } from "next/server";
import { getMintDecimals } from "@/lib/solana";
import { PUBLIC } from "@/lib/config";
import { splitBurnTreasury } from "@/lib/price";
import { GAME_TOKEN_COST } from "../pay/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const decimals = PUBLIC.paymentDecimals ?? (await getMintDecimals(PUBLIC.paymentMint));
    const rawCost = BigInt(Math.ceil(GAME_TOKEN_COST * 10 ** decimals));
    const { burn, treasury } = splitBurnTreasury(rawCost);
    return NextResponse.json({
      tokenCost: GAME_TOKEN_COST,
      decimals,
      rawCost: rawCost.toString(),
      burnRaw: burn.toString(),
      treasuryRaw: treasury.toString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "quote failed" }, { status: 500 });
  }
}
