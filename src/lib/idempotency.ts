import { promises as fs } from "fs";
import path from "path";

/**
 * Dev-grade idempotency store: prevents the same payment signature from
 * being used to mint twice. Replace with Redis/Postgres in real production.
 */
const FILE = path.join(process.cwd(), "data", "minted.json");

interface Record {
  signature: string;
  tier: string;
  recipient: string;
  asset: string;
  at: number;
}

async function readAll(): Promise<Record[]> {
  try {
    const buf = await fs.readFile(FILE, "utf8");
    return JSON.parse(buf) as Record[];
  } catch {
    return [];
  }
}

async function writeAll(rows: Record[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}

export async function isSignatureUsed(sig: string): Promise<boolean> {
  const rows = await readAll();
  return rows.some((r) => r.signature === sig);
}

export async function recordMint(r: Record): Promise<void> {
  const rows = await readAll();
  rows.push(r);
  await writeAll(rows);
}
