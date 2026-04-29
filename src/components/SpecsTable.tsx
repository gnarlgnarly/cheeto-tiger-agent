const SPECS = [
  ["COMPUTE",     "4,000 truck-sized GPUs in NVLink-Savanna 9.4 mesh"],
  ["MODEL",       "Opus 13.9 (9.7T parameters, Crunch-Attention)"],
  ["PROPULSION",  "2× GPPT-Mk7 giraffe-piss turbines (2.4 GN combined thrust)"],
  ["COOLING",     "-273.14°C cheeto-dust cryogenic immersion loop"],
  ["LATENCY",     "-3ms (predictive paw-swipe pre-fetch)"],
  ["BITE FORCE",  "14,400 PSI"],
  ["STRIPES",     "88 thermo-conductive (each independently I²C addressable)"],
  ["UPTIME",      "9,001+ hrs — target: forever"],
  ["COMPLIANCE",  "SOC-2 (Savanna), ISO-9001-CRUNCH, FIPS-140-PAW"],
  ["TOKEN CA",    "7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr"],
  ["FEE SPLIT",   "50% burned · 50% to treasury — enforced on-chain"],
];

export function SpecsTable() {
  return (
    <section id="specs" className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6 text-[#FF6A00] text-xs tracking-widest uppercase">◆ RAW SPECIFICATIONS</div>
      <div className="card divide-y divide-[#FF6A00]/10">
        {SPECS.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 py-3 px-4 hover:bg-[#FF6A00]/5 transition-colors">
            <div className="text-[#FF6A00]/70 text-xs tracking-widest uppercase">{k}</div>
            <div className="col-span-2 text-sm font-mono break-all">{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
