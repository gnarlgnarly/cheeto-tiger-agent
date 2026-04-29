"use client";

import { useEffect, useRef, useCallback } from "react";

const CELL = 20;
const COLS = 24;
const ROWS = 20;
const W = CELL * COLS;
const H = CELL * ROWS;
const TICK_MS = 110;

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };

interface Props {
  onScore: (score: number) => void;
  onGameOver: (score: number) => void;
  active: boolean;
}

function rand(n: number) { return Math.floor(Math.random() * n); }

export function SnakeGame({ onScore, onGameOver, active }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    snake: [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }] as Pt[],
    dir: "R" as Dir,
    nextDir: "R" as Dir,
    food: { x: 18, y: 5 } as Pt,
    score: 0,
    dead: false,
    tick: 0,
  });
  const raf = useRef<number>(0);
  const lastTick = useRef(0);

  const reset = useCallback(() => {
    state.current = {
      snake: [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }],
      dir: "R", nextDir: "R",
      food: { x: rand(COLS), y: rand(ROWS) },
      score: 0, dead: false, tick: 0,
    };
    onScore(0);
  }, [onScore]);

  const spawnFood = () => {
    const s = state.current;
    let pt: Pt;
    do { pt = { x: rand(COLS), y: rand(ROWS) }; }
    while (s.snake.some((p) => p.x === pt.x && p.y === pt.y));
    s.food = pt;
  };

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const s = state.current;

    // bg grid
    ctx.fillStyle = "#080604";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,106,0,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // snake
    s.snake.forEach((p, i) => {
      const isHead = i === 0;
      const t = 1 - i / s.snake.length;
      ctx.fillStyle = isHead ? "#FF6A00" : `rgba(255,${Math.round(106 + t * 60)},0,${0.4 + t * 0.6})`;
      ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2);
      if (isHead) {
        // eyes
        ctx.fillStyle = "#080604";
        ctx.fillRect(p.x * CELL + 5, p.y * CELL + 5, 3, 3);
        ctx.fillRect(p.x * CELL + 12, p.y * CELL + 5, 3, 3);
      }
    });

    // food — tiger paw (orange circle + dots)
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    ctx.fillStyle = "#39FF14";
    ctx.shadowColor = "#39FF14";
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // paw dots
    [[- 5, -7],[2, -8],[7, -5]].forEach(([dx, dy]) => {
      ctx.beginPath(); ctx.arc(fx + dx, fy + dy, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    // dead overlay
    if (s.dead) {
      ctx.fillStyle = "rgba(8,6,4,0.75)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FF6A00";
      ctx.font = "bold 28px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("APEX UNIT TERMINATED", W / 2, H / 2 - 16);
      ctx.fillStyle = "#f5e6c8";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`SCORE: ${s.score}`, W / 2, H / 2 + 16);
      ctx.fillStyle = "#FF6A00";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("score is being submitted…", W / 2, H / 2 + 44);
    }
  }, []);

  const step = useCallback((ts: number) => {
    if (!active) return;
    if (ts - lastTick.current >= TICK_MS) {
      lastTick.current = ts;
      const s = state.current;
      if (s.dead) return;

      s.dir = s.nextDir;
      const head = s.snake[0];
      const next: Pt = {
        x: (head.x + (s.dir === "R" ? 1 : s.dir === "L" ? -1 : 0) + COLS) % COLS,
        y: (head.y + (s.dir === "D" ? 1 : s.dir === "U" ? -1 : 0) + ROWS) % ROWS,
      };

      if (s.snake.slice(1).some((p) => p.x === next.x && p.y === next.y)) {
        s.dead = true;
        draw();
        onGameOver(s.score);
        return;
      }

      s.snake.unshift(next);
      if (next.x === s.food.x && next.y === s.food.y) {
        s.score += 10 + Math.floor(s.snake.length / 3);
        onScore(s.score);
        spawnFood();
      } else {
        s.snake.pop();
      }
      draw();
    }
    raf.current = requestAnimationFrame(step);
  }, [active, draw, onScore, onGameOver]);

  useEffect(() => {
    if (!active) return;
    reset();
    lastTick.current = 0;
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active, reset, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = state.current;
      if (!active || s.dead) return;
      const map: Record<string, Dir> = { ArrowUp:"U", ArrowDown:"D", ArrowLeft:"L", ArrowRight:"R", w:"U", s:"D", a:"L", d:"R" };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      const opp: Record<Dir, Dir> = { U:"D", D:"U", L:"R", R:"L" };
      if (opp[next] !== s.dir) s.nextDir = next;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // mobile swipe
  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const s = state.current;
      if (!active || s.dead) return;
      const opp: Record<Dir, Dir> = { U:"D", D:"U", L:"R", R:"L" };
      let next: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : (dy > 0 ? "D" : "U");
      if (opp[next] !== s.dir) s.nextDir = next;
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [active]);

  return (
    <canvas
      ref={canvas}
      width={W}
      height={H}
      className="border border-[#FF6A00]/30 max-w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
