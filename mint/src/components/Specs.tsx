export function Specs() {
  const rows = [
    ["Chain", "Solana"],
    ["Standard", "Metaplex Core (mpl-core)"],
    ["Payment Token", "$CHEETO (7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr)"],
    ["Pricing", "Live USD ↔ token via Jupiter price API"],
    ["Fee Split", "50% burned · 50% to treasury (enforced on-chain)"],
    ["Tier 1 Supply", "5,000 — $1.59"],
    ["Tier 2 Supply", "1,000 — $10.59"],
    ["Tier 3 Supply", "100 — $50.10"],
    ["Royalties", "Configurable via Core royalty plugin"],
  ];
  return (
    <section id="specs" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Specs</h2>
      <div className="card divide-y divide-white/5">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 py-4 first:pt-0 last:pb-0">
            <div className="text-white/50 uppercase text-xs tracking-widest">{k}</div>
            <div className="col-span-2 font-medium break-all">{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
