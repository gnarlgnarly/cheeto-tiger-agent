"use client";
import { useRef, useState } from "react";

interface Props { children: React.ReactNode }

export function HoloCard({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [active, setActive] = useState(false);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0→1
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -22;   // tilt up/down
    const rotY = (x - 0.5) * 22;    // tilt left/right
    const shine = `${x * 100}% ${y * 100}%`;
    const hue = Math.round(x * 360);

    setStyle({
      transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`,
      "--shine-x": `${x * 100}%`,
      "--shine-y": `${y * 100}%`,
      "--hue": `${hue}deg`,
      "--gx": shine,
    } as React.CSSProperties);
    setActive(true);
  }

  function onLeave() {
    setStyle({ transform: "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)" });
    setActive(false);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative"
      style={{
        ...style,
        transition: active ? "transform 0.05s ease" : "transform 0.4s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}

      {/* holographic rainbow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] holo-rainbow"
        style={{
          opacity: active ? 0.55 : 0,
          transition: "opacity 0.3s ease",
          background: `
            linear-gradient(
              calc(var(--hue, 0deg) + 105deg),
              rgba(255,0,0,0.25) 0%,
              rgba(255,154,0,0.25) 14%,
              rgba(208,222,33,0.25) 28%,
              rgba(79,220,74,0.25) 42%,
              rgba(63,218,216,0.25) 56%,
              rgba(47,201,226,0.25) 70%,
              rgba(28,127,238,0.25) 84%,
              rgba(95,21,242,0.25) 100%
            )
          `,
          mixBlendMode: "color-dodge",
        }}
      />

      {/* moving gloss highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: active ? 0.7 : 0,
          transition: "opacity 0.3s ease",
          background: `radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.35) 0%, transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* sparkle dots */}
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          {SPARKLES.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full animate-sparkle"
              style={{
                width: s.size,
                height: s.size,
                left: s.left,
                top: s.top,
                background: `hsl(calc(var(--hue, 0deg) + ${s.hueShift}), 100%, 75%)`,
                boxShadow: `0 0 6px 2px hsl(calc(var(--hue, 0deg) + ${s.hueShift}), 100%, 75%)`,
                animationDelay: s.delay,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const SPARKLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  hueShift: Math.round(Math.random() * 200 - 100),
  delay: `${Math.random() * 0.8}s`,
}));
