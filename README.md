# 🐅 CHEETO TIGER — ElizaOS Agent

> Apex-tier artificial feline intelligence. Running **Opus 13.9** across
> **40-hundred truck-sized GPUs**. Propelled by **GPPT-Mk7 giraffe-piss
> turbines**. Cooled by closed-loop cryogenic **cheeto-dust** at -273.14°C.
> Certified **100% ORANGE**.

This repository contains the [ElizaOS](https://github.com/elizaOS/eliza)
character, plugins, and runtime entrypoint for **Cheeto Tiger** —
the official AI agent of the `$CHEETO` Solana token.

- **Site:** https://cheeto-tiger.vercel.app
- **𝕏:** https://x.com/mfcheetotiger
- **CA (Solana):** `7Jka23K4r8Lw5FC47HTB2TVdikFbfVBKGU1eP6Fdbrrr`

---

## ⚙️ Architecture (The Crunch Stack™)

| Layer | Component |
|------:|-----------|
| L0 | Cheeto-Dust Quantum Lattice |
| L1 | NVLink-Savanna 9.4 (88 Tb/s) |
| L2 | 4,000× Truck-Class GPU Pods |
| L3 | GPPT-Mk7 Giraffe Bladder Array |
| L4 | Opus 13.9 Crunch-Attention |
| L5 | PURRBERNETES™ v2.4 |
| L6 | Tail-Twitch Reinforcement Loop |
| L7 | gRPC over Stripe Multiplex |

---

## 🚀 Quick Start

```bash
# 1. install deps
bun install   # or: npm install

# 2. configure secrets
cp .env.example .env
# fill in ANTHROPIC_API_KEY, TWITTER_*, TELEGRAM_BOT_TOKEN, SOLANA_*

# 3. run the apex unit
bun run start
# or: npm run start
```

You should see:

```
🐅 BOOTING APEX UNIT
[ OK ] character loaded: Cheeto Tiger
[ OK ] pressurizing GPPT-Mk7 giraffe-piss turbines... 88.7%
[ OK ] cheeto-dust cryo loop engaged at -273.14°C
[ OK ] Opus 13.9 weights crunched (9.7T params)
[ OK ] APEX UNIT ONLINE. stay orange. 🐅
```

---

## 📁 Project Layout

```
cheeto-tiger-agent/
├── characters/
│   └── cheeto-tiger.character.json   # personality, lore, style, post examples
├── src/
│   └── index.ts                      # ElizaOS runtime bootstrap
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧠 Character Definition

The full personality lives in
[`characters/cheeto-tiger.character.json`](characters/cheeto-tiger.character.json):

- **system prompt** — apex-unit voice, savanna-grade swagger
- **bio + lore** — operational telemetry and origin story
- **message examples** — how the tiger handles common prompts
- **post examples** — autonomous Twitter/Telegram posting voice
- **style guide** — lowercase, hyper-technical, no apologies for being a tiger

Edit this file to retune the tiger. Restart the agent to apply changes.

---

## 🔌 Enabled Clients

- **Twitter / X** — autonomous posting + reply loop as `@mfcheetotiger`
- **Telegram** — DMs and group chat handler

Add additional clients (Discord, Farcaster, etc.) by installing the
corresponding `@elizaos/plugin-*` package and adding it to both
`package.json` and `src/index.ts`.

---

## ⚠️ Operational Warnings

- ⚠ DO NOT FEED THE APEX UNIT AFTER MIDNIGHT
- ⚠ DO NOT MAKE SUSTAINED EYE CONTACT
- ⚠ DO NOT QUESTION THE GIRAFFES
- ⚠ ALL SNACK TRIBUTES MUST PASS THROUGH `/tribute`

---

## 📜 License

MIT. Use the agent. Do not pet the agent.

🐅 **STAY ORANGE.** 🐅
