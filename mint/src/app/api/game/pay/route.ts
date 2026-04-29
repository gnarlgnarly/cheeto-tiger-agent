import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHmac } from "crypto";
import { getTokenPriceUsd } from "@/lib/price";
import { getMintDecimals } from "@/lib/solana";
import { PUBLIC, SERVER } from "@/lib/config";
import { verifyPayment } from "@/lib/verify";
import { isSignatureUsed, recordMint } from "@/lib/idempotency";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  paymentSignature: z.string().min(32).max(128),
  payer: z.string().min(32).max(64),
});

export const GAME_TOKEN_COST = 1000; // flat token amount, not USD

function mintSessionToken(signature: string, payer: string): string {
  const secret = SERVER.mintAuthoritySecret(); // reuse server secret as HMAC key
  return createHmac("sha256", secret)
    .update(`${signature}:${payer}:game`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { paymentSignature, payer } = Body.parse(await req.json());

    if (await isSignatureUsed(paymentSignature)) {
      return NextResponse.json({ error: "Payment already redeemed" }, { status: 409 });
    }

    const decimals = PUBLIC.paymentDecimals ?? (await getMintDecimals(PUBLIC.paymentMint));
    const rawCost = BigInt(Math.ceil(GAME_TOKEN_COST * 10 ** decimals));
    // apply 2% slippage tolerance on verify
    const minRaw = (rawCost * 98n) / 100n;
    const minBurn = minRaw / 2n;
    const minTreasury = minRaw - minBurn;

    await verifyPayment({ signature: paymentSignature, payer, minTreasuryRaw: minTreasury, minBurnRaw: minBurn });

    // record so the same signature can't buy two game sessions
    await recordMint({ signature: paymentSignature, tier: "game", recipient: payer, asset: "game-session", at: Date.now() });

    const sessionToken = mintSessionToken(paymentSignature, payer);

    return NextResponse.json({ ok: true, sessionToken, payer, decimals, costRaw: rawCost.toString() });
  } catch (e: any) {
    const msg = e?.message ?? "payment failed";
    const status = /already redeemed|underpaid/i.test(msg) ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

// expose for score submission validation
export { mintSessionToken };
