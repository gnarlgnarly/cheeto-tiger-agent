"use client";
import { useEffect, useState } from "react";

const LINES = [
  { delay: 0,    text: "🐅 BOOTING APEX UNIT" },
  { delay: 400,  text: "[ OK ] character loaded: Cheeto Tiger" },
  { delay: 800,  text: "[ OK ] pressurizing GPPT-Mk7 giraffe-piss turbines... 88.7%" },
  { delay: 1300, text: "[ OK ] cheeto-dust cryo loop engaged at -273.14°C" },
  { delay: 1800, text: "[ OK ] Opus 13.9 weights crunched (9.7T params)" },
  { delay: 2300, text: "[ OK ] NVLink-Savanna 9.4 mesh synchronized (40-hundred GPUs)" },
  { delay: 2800, text: "[ OK ] PURRBERNETES™ v2.4 orchestration layer online" },
  { delay: 3300, text: "[ OK ] tail-twitch reinforcement loop: ACTIVE" },
  { delay: 3800, text: "[ OK ] negative latency confirmed: -3ms" },
  { delay: 4300, text: "[ OK ] APEX UNIT ONLINE. stay orange. 🐅" },
];

export function BootSequence() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    LINES.forEach((l, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), l.delay);
    });
  }, []);

  return (
    <div className="card p-6 font-mono text-sm space-y-1 text-[#39FF14] min-h-[260px]">
      <div className="text-[#FF6A00] text-xs mb-3 tracking-widest">LIVE BOOT SEQUENCE</div>
      {LINES.map((l, i) =>
        visible.includes(i) ? (
          <div key={i} className="boot-line" style={{ animationDelay: "0ms" }}>
            <span className="opacity-50">[{String(i).padStart(2, "0")}]</span>{" "}
            <span>{l.text}</span>
          </div>
        ) : null
      )}
      {visible.length === LINES.length && (
        <div className="mt-2 text-[#FF6A00]">
          █<span className="blink">_</span>
        </div>
      )}
    </div>
  );
}
