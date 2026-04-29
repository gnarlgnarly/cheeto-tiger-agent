import { SERVER, PUBLIC } from "./config";

interface PriceResult {
  usdPerToken: number;
  source: "override" | "jupiter";
  fetchedAt: number;
}

let cache: PriceResult | null = null;
const TTL_MS = 30_000;

export async function getTokenPriceUsd(): Promise<PriceResult> {
  if (SERVER.priceOverrideUsd && SERVER.priceOverrideUsd > 0) {
    return { usdPerToken: SERVER.priceOverrideUsd, source: "override", fetchedAt: Date.now() };
  }
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache;

  const url = `${SERVER.jupiterPriceUrl}?ids=${PUBLIC.paymentMint}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Jupiter price fetch failed: ${res.status}`);
  const json = (await res.json()) as { data?: Record<string, { price?: string | number }> };
  const entry = json.data?.[PUBLIC.paymentMint];
  const price = entry?.price ? Number(entry.price) : NaN;
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("No valid price returned from Jupiter for payment mint");
  }
  cache = { usdPerToken: price, source: "jupiter", fetchedAt: Date.now() };
  return cache;
}

/** Convert a USD amount to raw token base-units, given decimals. */
export function usdToTokenBaseUnits(usd: number, usdPerToken: number, decimals: number): bigint {
  const tokens = usd / usdPerToken;
  // round up so user always pays at least the USD price
  const raw = Math.ceil(tokens * 10 ** decimals);
  return BigInt(raw);
}

/**
 * Split a total raw payment into a burn half and a treasury half.
 * Burn gets the floor, treasury gets the remainder, so total is always exact
 * and the burn never exceeds 50%.
 */
export function splitBurnTreasury(totalRaw: bigint): { burn: bigint; treasury: bigint } {
  const burn = totalRaw / 2n;
  return { burn, treasury: totalRaw - burn };
}
