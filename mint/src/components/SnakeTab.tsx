"use client";

import { useState, useCallback, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey, Transaction, ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  createBurnCheckedInstruction,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import toast from "react-hot-toast";
import { PUBLIC } from "@/lib/config";
import { SnakeGame } from "./SnakeGame";

type Phase = "idle" | "paying" | "playing" | "submitting" | "done";
type Period = "daily" | "weekly" | "monthly" | "alltime";

interface LeaderEntry { rank: number; wallet: string; score: number; timestamp: number }
interface Quote { decimals: number; rawCost: string; burnRaw: string; treasuryRaw: string; tokenCost: number }

const PERIODS: Period[] = ["daily", "weekly", "monthly", "alltime"];

export function SnakeTab() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [session, setSession] = useState<{ token: string; payer: string; sig: string } | null>(null);
  const [leaderPeriod, setLeaderPeriod] = useState<Period>("daily");
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(false);

  const fetchLeaderboard = useCallback(async (p: Period) => {
    setLoadingBoard(true);
    try {
      const r = await fetch(`/api/game/leaderboard?period=${p}`);
      const j = await r.json();
      setLeaderboard(j.entries ?? []);
    } catch { setLeaderboard([]); }
    finally { setLoadingBoard(false); }
  }, []);

  useEffect(() => { fetchLeaderboard(leaderPeriod); }, [leaderPeriod, fetchLeaderboard]);

  async function handlePay() {
    if (!publicKey) { toast.error("connect a wallet first"); return; }
    if (!PUBLIC.treasury) { toast.error("treasury not configured"); return; }

    setPhase("paying");
    const id = toast.loading("fetching game quote…");
    try {
      const qr = await fetch("/api/game/quote");
      if (!qr.ok) throw new Error("quote failed");
      const quote: Quote = await qr.json();

      const mint = new PublicKey(PUBLIC.paymentMint);
      const treasury = new PublicKey(PUBLIC.treasury);
      const payerAta = getAssociatedTokenAddressSync(mint, publicKey, true);
      const treasuryAta = getAssociatedTokenAddressSync(mint, treasury, true);
      const burnRaw = BigInt(quote.burnRaw);
      const treasuryRaw = BigInt(quote.treasuryRaw);

      toast.loading("building payment tx…", { id });
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50_000 }),
        createAssociatedTokenAccountIdempotentInstruction(publicKey, treasuryAta, treasury, mint),
        createBurnCheckedInstruction(payerAta, mint, publicKey, burnRaw, quote.decimals, [], TOKEN_PROGRAM_ID),
        createTransferCheckedInstruction(payerAta, mint, treasuryAta, publicKey, treasuryRaw, quote.decimals, [], TOKEN_PROGRAM_ID),
      );

      toast.loading("awaiting signature…", { id });
      const signature = await sendTransaction(tx, connection);

      toast.loading("confirming…", { id });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      toast.loading("issuing game session…", { id });
      const pr = await fetch("/api/game/pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentSignature: signature, payer: publicKey.toBase58() }),
      });
      const pj = await pr.json();
      if (!pr.ok) throw new Error(pj.error ?? "session failed");

      setSession({ token: pj.sessionToken, payer: publicKey.toBase58(), sig: signature });
      setScore(0);
      setFinalScore(null);
      setPhase("playing");
      toast.success("🐅 game on — use arrow keys or WASD", { id });
    } catch (e: any) {
      toast.error(e?.message ?? "payment failed", { id });
      setPhase("idle");
    }
  }

  const handleGameOver = useCallback(async (s: number) => {
    setFinalScore(s);
    setPhase("submitting");
    if (!session) return;
    try {
      const r = await fetch("/api/game/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionToken: session.token, payer: session.payer, paymentSignature: session.sig, score: s }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      toast.success(`score ${s} submitted to leaderboard 🐅`);
      fetchLeaderboard(leaderPeriod);
    } catch (e: any) {
      toast.error(`score submit failed: ${e?.message}`);
    }
    setPhase("done");
  }, [session, leaderPeriod, fetchLeaderboard]);

  const handleScore = useCallback((s: number) => setScore(s), []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
      <div>
        <div className="text-[#FF6A00] text-xs tracking-widest mb-1">◆ APEX UNIT ARCADE</div>
        <h2 className="display text-3xl font-black">Snake — Pay to Crunch</h2>
        <p className="text-sm text-[#f5e6c8]/50 mt-2 font-mono">
          1,000 $CHEETO per game · 50% burned · scores recorded on-chain verified leaderboard
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ── GAME PANEL ── */}
        <div className="space-y-4">
          {phase === "idle" || phase === "done" ? (
            <div className="card p-8 flex flex-col items-center gap-6 text-center">
              {phase === "done" && finalScore !== null && (
                <div className="text-[#FF6A00] font-black text-5xl display">{finalScore}</div>
              )}
              {phase === "done" && <p className="text-sm text-[#f5e6c8]/50">score submitted · play again?</p>}
              {phase === "idle" && (
                <div className="font-mono text-sm text-[#f5e6c8]/60 space-y-1">
                  <div>→ arrow keys or WASD to move</div>
                  <div>→ eat the glowing paw prints</div>
                  <div>→ don&apos;t hit yourself</div>
                  <div className="text-[#FF6A00] mt-3">1,000 $CHEETO to play</div>
                </div>
              )}
              <button
                className="btn-primary-filled px-10 py-4 text-base"
                onClick={handlePay}
                disabled={!publicKey || phase === "paying"}
              >
                {!publicKey ? "CONNECT WALLET" : phase === "paying" ? "PROCESSING…" : "PAY & PLAY 🐅"}
              </button>
            </div>
          ) : null}

          {(phase === "playing" || phase === "submitting") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-[#FF6A00]">SCORE: <span className="font-black text-xl">{score}</span></span>
                <span className="text-[#f5e6c8]/40 text-xs">arrow keys / WASD</span>
              </div>
              <SnakeGame
                active={phase === "playing"}
                onScore={handleScore}
                onGameOver={handleGameOver}
              />
              {phase === "submitting" && (
                <p className="text-xs text-[#39FF14] font-mono text-center animate-pulse">
                  submitting score to leaderboard…
                </p>
              )}
            </div>
          )}

          {phase === "paying" && (
            <div className="card p-8 text-center font-mono text-sm text-[#FF6A00] animate-pulse">
              processing payment…
            </div>
          )}
        </div>

        {/* ── LEADERBOARD ── */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setLeaderPeriod(p)}
                className={`tab-btn text-[10px] flex-1 ${leaderPeriod === p ? "active" : ""}`}
              >
                {p === "alltime" ? "ALL" : p.slice(0, 1).toUpperCase() + p.slice(1, 3).toUpperCase()}
              </button>
            ))}
          </div>

          <div className="card divide-y divide-[#FF6A00]/10">
            <div className="px-4 py-2 grid grid-cols-[24px_1fr_64px] gap-2 text-[10px] text-[#FF6A00]/50 uppercase tracking-widest">
              <span>#</span><span>wallet</span><span className="text-right">score</span>
            </div>
            {loadingBoard ? (
              <div className="px-4 py-6 text-center text-xs text-[#f5e6c8]/30 font-mono animate-pulse">
                loading…
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-[#f5e6c8]/30 font-mono">
                no scores yet · be the first
              </div>
            ) : leaderboard.map((e) => (
              <div
                key={e.rank}
                className="px-4 py-2.5 grid grid-cols-[24px_1fr_64px] gap-2 items-center hover:bg-[#FF6A00]/5 transition-colors"
              >
                <span className={`text-xs font-bold ${e.rank === 1 ? "text-[#FFD700]" : e.rank === 2 ? "text-[#C0C0C0]" : e.rank === 3 ? "text-[#CD7F32]" : "text-[#f5e6c8]/30"}`}>
                  {e.rank}
                </span>
                <span className="font-mono text-xs text-[#f5e6c8]/70 truncate">{e.wallet}</span>
                <span className="font-black text-right text-[#FF6A00]">{e.score.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => fetchLeaderboard(leaderPeriod)}
            className="w-full text-[10px] text-[#f5e6c8]/30 hover:text-[#FF6A00] font-mono tracking-widest py-1 transition-colors"
          >
            ↻ REFRESH
          </button>
        </div>
      </div>
    </div>
  );
}
