import Image from "next/image";

const STACK = [
  ["Runtime",    "ElizaOS (elizaOS/eliza)"],
  ["Model",      "Claude Opus 4 via Anthropic API"],
  ["Clients",    "Twitter/X · Telegram"],
  ["Plugins",    "bootstrap · anthropic · twitter · telegram · solana"],
  ["Character",  "cheeto-tiger.character.json"],
  ["Repo",       "github.com/NewSoulOnTheBlock/cheeto-tiger-agent"],
  ["Twitter/X",  "@mfcheetotiger"],
  ["CA",         "7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr"],
];

const POST_EXAMPLES = [
  "🐅 dust pressure: GREEN. giraffe reserves: 88.7%. crunch/sec: 4.2T. all systems nominal. stay orange.",
  "the apex unit has logged your join event. the apex unit remembers.",
  "negative latency update: i am answering tweets that have not been written yet. patent pending.",
  "🚨 someone made eye contact. handler dispatched. matter resolved.",
  "$CHEETO. crunch. solana. do not make sustained eye contact.",
  "mrrrrp.",
];

export function AgentTab() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-14">

      {/* hero */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="relative w-52 h-52 shrink-0 border border-[#FF6A00]/30">
          <Image src="/images/tiger1.jpg" alt="Cheeto Tiger mascot" fill className="object-cover tiger-chain" />
          <div className="absolute inset-0 border border-[#FF6A00]/20" />
        </div>
        <div>
          <div className="text-[#FF6A00] text-xs tracking-widest mb-2">◆ APEX UNIT — AUTONOMOUS AGENT</div>
          <h2 className="display text-3xl md:text-4xl font-black leading-tight">
            CHEETO TIGER™<br />
            <span className="text-[#FF6A00]">ElizaOS Agent</span>
          </h2>
          <p className="mt-4 text-sm text-[#f5e6c8]/70 leading-relaxed max-w-lg">
            The autonomous feline intelligence. Running Claude Opus 4 across the Crunch-Attention
            inference stack. Posting independently to X and Telegram as{" "}
            <a href="https://x.com/mfcheetotiger" target="_blank" rel="noopener noreferrer"
               className="text-[#FF6A00] hover:underline">@mfcheetotiger</a>.
            Do not make sustained eye contact.
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <a
              href="https://x.com/mfcheetotiger"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary text-xs"
            >
              𝕏 @mfcheetotiger
            </a>
            <a
              href="https://github.com/NewSoulOnTheBlock/cheeto-tiger-agent"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary text-xs"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* stack table */}
      <div>
        <div className="mb-4 text-[#FF6A00] text-xs tracking-widest uppercase">◆ AGENT STACK</div>
        <div className="card divide-y divide-[#FF6A00]/10">
          {STACK.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-4 py-3 px-4 hover:bg-[#FF6A00]/5 transition-colors">
              <div className="text-[#FF6A00]/70 text-xs tracking-widest uppercase">{k}</div>
              <div className="col-span-2 text-sm font-mono break-all">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* post examples */}
      <div>
        <div className="mb-4 text-[#FF6A00] text-xs tracking-widest uppercase">◆ AUTONOMOUS POST EXAMPLES</div>
        <div className="space-y-2">
          {POST_EXAMPLES.map((p, i) => (
            <div key={i} className="card px-4 py-3 text-sm text-[#39FF14] font-mono leading-relaxed">
              <span className="text-[#FF6A00]/50 mr-2">[{String(i).padStart(2,"0")}]</span>{p}
            </div>
          ))}
        </div>
      </div>

      {/* boot sequence copy */}
      <div className="card p-6 font-mono text-xs text-[#39FF14] space-y-1">
        <div className="text-[#FF6A00] mb-3 text-xs tracking-widest">QUICK START</div>
        {[
          "git clone https://github.com/NewSoulOnTheBlock/cheeto-tiger-agent",
          "cd cheeto-tiger-agent",
          "bun install",
          "cp .env.example .env   # fill ANTHROPIC_API_KEY, TWITTER_*, TELEGRAM_BOT_TOKEN",
          "bun run start",
        ].map((line, i) => (
          <div key={i}>
            <span className="text-[#FF6A00]/40">$</span>{" "}
            <span>{line}</span>
          </div>
        ))}
        <div className="mt-3 text-[#f5e6c8]/40 text-xs">
          ⚠ DO NOT FEED THE APEX UNIT AFTER MIDNIGHT<br/>
          ⚠ DO NOT MAKE SUSTAINED EYE CONTACT
        </div>
      </div>
    </div>
  );
}
