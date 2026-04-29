import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "scores.json");

export interface ScoreEntry {
  wallet: string;
  score: number;
  sessionToken: string;
  timestamp: number;
}

async function readAll(): Promise<ScoreEntry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as ScoreEntry[];
  } catch {
    return [];
  }
}

async function writeAll(rows: ScoreEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}

export async function isSessionUsed(sessionToken: string): Promise<boolean> {
  return (await readAll()).some((r) => r.sessionToken === sessionToken);
}

export async function recordScore(entry: ScoreEntry): Promise<void> {
  const rows = await readAll();
  rows.push(entry);
  await writeAll(rows);
}

type Period = "daily" | "weekly" | "monthly" | "alltime";

export async function getLeaderboard(period: Period, limit = 20): Promise<ScoreEntry[]> {
  const rows = await readAll();
  const now = Date.now();
  const cutoffs: Record<Period, number> = {
    daily:   now - 86_400_000,
    weekly:  now - 7 * 86_400_000,
    monthly: now - 30 * 86_400_000,
    alltime: 0,
  };
  const cutoff = cutoffs[period];

  // best score per wallet within the period
  const best = new Map<string, ScoreEntry>();
  for (const r of rows) {
    if (r.timestamp < cutoff) continue;
    const existing = best.get(r.wallet);
    if (!existing || r.score > existing.score) best.set(r.wallet, r);
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
