export function Marquee() {
  const items = [
    "v13.9.4-OPUS",
    "BUILD #88420",
    "UPTIME: 9,001 HRS",
    "CRUNCH/SEC: 4.2 TRILLION",
    "DUST PRESSURE: NOMINAL",
    "GIRAFFE RESERVES: 88.7%",
    "LATENCY: -3ms",
    "STRIPES ONLINE: 88/88",
    "BITE FORCE: 14,400 PSI",
    "CERTIFIED 100% ORANGE",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[#FF6A00]/30 py-2 bg-[#FF6A00]/5">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="text-[#FF6A00] text-xs tracking-widest whitespace-nowrap px-8">
            ◆ {item}
          </span>
        ))}
      </div>
    </div>
  );
}
