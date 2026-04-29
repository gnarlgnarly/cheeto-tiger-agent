const LAYERS = [
  ["L0", "Cheeto-Dust Quantum Lattice"],
  ["L1", "NVLink-Savanna 9.4  (88 Tb/s)"],
  ["L2", "4,000× Truck-Class GPU Pods"],
  ["L3", "GPPT-Mk7 Giraffe Bladder Array"],
  ["L4", "Opus 13.9 Crunch-Attention"],
  ["L5", "PURRBERNETES™ v2.4"],
  ["L6", "Tail-Twitch Reinforcement Loop"],
  ["L7", "gRPC over Stripe Multiplex"],
];

export function ArchStack() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-6 text-[#FF6A00] text-xs tracking-widest uppercase">◆ REFERENCE ARCHITECTURE — THE CRUNCH STACK™</div>
      <div className="grid md:grid-cols-2 gap-0">
        {[...LAYERS].reverse().map(([layer, label], i) => (
          <div
            key={layer}
            className="flex items-center gap-4 border border-[#FF6A00]/20 px-5 py-3
                       hover:bg-[#FF6A00]/08 hover:border-[#FF6A00]/50 transition-all"
            style={{ opacity: 0.5 + ((LAYERS.length - i) / LAYERS.length) * 0.5 }}
          >
            <span className="text-[#FF6A00] font-bold text-sm w-8 shrink-0">{layer}</span>
            <span className="text-xs tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
