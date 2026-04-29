import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHmac } from "crypto";
import { SERVER } from "@/lib/config";
import { isSessionUsed, recordScore } from "@/lib/scores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  sessionToken: z.string().length(64),
  payer: z.string().min(32).max(64),
  paymentSignature: z.string().min(32).max(128),
  score: z.number().int().min(0).max(1_000_000),
});

function verifySessionToken(token: string, signature: string, payer: string): boolean {
  const secret = SERVER.mintAuthoritySecret();
  const expected = createHmac("sha256", secret)
    .update(`${signature}:${payer}:game`)
    .digest("hex");
  return token === expected;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionToken, payer, paymentSignature, score } = Body.parse(await req.json());

    if (!verifySessionToken(sessionToken, paymentSignature, payer)) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }
    if (await isSessionUsed(sessionToken)) {
      return NextResponse.json({ error: "Session already used" }, { status: 409 });
    }

    await recordScore({ wallet: payer, score, sessionToken, timestamp: Date.now() });

    return NextResponse.json({ ok: true, score, wallet: payer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "score submit failed" }, { status: 400 });
  }
}
