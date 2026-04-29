import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/scores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const period = (req.nextUrl.searchParams.get("period") ?? "daily") as any;
    if (!["daily", "weekly", "monthly", "alltime"].includes(period)) {
      return NextResponse.json({ error: "invalid period" }, { status: 400 });
    }
    const entries = await getLeaderboard(period);
    return NextResponse.json({
      period,
      entries: entries.map((e, i) => ({
        rank: i + 1,
        wallet: `${e.wallet.slice(0, 4)}…${e.wallet.slice(-4)}`,
        score: e.score,
        timestamp: e.timestamp,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "leaderboard failed" }, { status: 500 });
  }
}
