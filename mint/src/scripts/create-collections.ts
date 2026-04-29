/**
 * One-time bootstrap: creates the three Metaplex Core collections that
 * back the Cheeto Tiger tiers. Run with:
 *
 *   bun run create-collections
 *   # or: npm run create-collections
 *
 * Outputs the three collection addresses — paste them into your .env as:
 *   NEXT_PUBLIC_COLLECTION_TIER1=...
 *   NEXT_PUBLIC_COLLECTION_TIER2=...
 *   NEXT_PUBLIC_COLLECTION_TIER3=...
 */
import "dotenv/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { createCollection, mplCore } from "@metaplex-foundation/mpl-core";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { TIER_LIST } from "../lib/tiers";

async function main() {
  const rpc = process.env.SOLANA_RPC ?? process.env.NEXT_PUBLIC_SOLANA_RPC;
  const secret = process.env.MINT_AUTHORITY_SECRET;
  if (!rpc) throw new Error("SOLANA_RPC not set");
  if (!secret) throw new Error("MINT_AUTHORITY_SECRET not set");

  const umi = createUmi(rpc).use(mplCore());
  const kp = Keypair.fromSecretKey(bs58.decode(secret));
  umi.use(keypairIdentity(fromWeb3JsKeypair(umi as any, kp)));

  console.log("Authority:", kp.publicKey.toBase58());

  for (const tier of TIER_LIST) {
    const metadataEnv = process.env[tier.metadataEnvKey];
    if (!metadataEnv) {
      console.warn(`Skipping ${tier.id}: ${tier.metadataEnvKey} not set`);
      continue;
    }
    const collection = generateSigner(umi);
    console.log(`\nCreating ${tier.id} (${tier.name}) → ${collection.publicKey}`);

    await createCollection(umi, {
      collection,
      name: tier.name,
      uri: metadataEnv,
      // The mpl-core MaxSize plugin caps total mints into this collection.
      plugins: [
        // @ts-ignore — plugin types vary by mpl-core version
        { type: "MasterEdition", maxSupply: tier.maxSupply, name: tier.name, uri: metadataEnv },
      ],
    }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

    console.log(`✓ ${tier.id} created. Add to .env:`);
    console.log(`  ${tier.collectionEnvKey}=${collection.publicKey}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
