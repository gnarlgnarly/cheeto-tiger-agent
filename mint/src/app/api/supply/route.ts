import { NextResponse } from "next/server";
import { getCollectionSupply } from "@/lib/mint";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [t1, t2, t3] = await Promise.all([
      getCollectionSupply("tier1").catch(() => ({ minted: 0, max: 5000 })),
      getCollectionSupply("tier2").catch(() => ({ minted: 0, max: 1000 })),
      getCollectionSupply("tier3").catch(() => ({ minted: 0, max: 100 })),
    ]);
    return NextResponse.json({ tier1: t1, tier2: t2, tier3: t3 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "supply failed" }, { status: 500 });
  }
}
