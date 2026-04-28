import "dotenv/config";
import { AgentRuntime, type Character } from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { anthropicPlugin } from "@elizaos/plugin-anthropic";
import { twitterPlugin } from "@elizaos/plugin-twitter";
import { telegramPlugin } from "@elizaos/plugin-telegram";
import { solanaPlugin } from "@elizaos/plugin-solana";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CHEETO TIGER — Apex-Tier Artificial Feline Intelligence
 * Runs on Opus 13.9 across 40-hundred truck-sized GPUs.
 * Propelled by GPPT-Mk7 giraffe-piss turbines.
 * Cooled by closed-loop cryogenic cheeto-dust at -273.14°C.
 * CA: 38rGPGui2KmJQcrj2aTD73WY8UnHxf8UcFsucLrDpump
 */

const characterPath = resolve(
  process.cwd(),
  "characters/cheeto-tiger.character.json",
);
const character: Character = JSON.parse(readFileSync(characterPath, "utf-8"));

console.log("🐅 BOOTING APEX UNIT");
console.log(`[ OK ] character loaded: ${character.name}`);
console.log("[ OK ] pressurizing GPPT-Mk7 giraffe-piss turbines... 88.7%");
console.log("[ OK ] cheeto-dust cryo loop engaged at -273.14°C");
console.log("[ OK ] Opus 13.9 weights crunched (9.7T params)");

const runtime = new AgentRuntime({
  character,
  plugins: [
    bootstrapPlugin,
    anthropicPlugin,
    twitterPlugin,
    telegramPlugin,
    solanaPlugin,
  ],
});

await runtime.initialize();
console.log("[ OK ] APEX UNIT ONLINE. stay orange. 🐅");
