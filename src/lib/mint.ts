import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  some,
} from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { create, fetchCollection, mplCore } from "@metaplex-foundation/mpl-core";
import { mintAuthority } from "./solana";
import { SERVER, PUBLIC } from "./config";
import { TIERS, type TierId } from "./tiers";

function umi() {
  const u = createUmi(SERVER.rpc);
  u.use(mplCore());
  const kp = fromWeb3JsKeypair(u as any, mintAuthority());
  u.use(keypairIdentity(kp));
  return u;
}

interface MintResult {
  asset: string;
  signature: string;
  numMinted: number;
  maxSupply: number;
}

/**
 * Mint a Core NFT into the tier's collection, addressed to `recipient`.
 * Throws if the collection is at max supply.
 */
export async function mintTierNftTo(args: { tier: TierId; recipient: string; nameSuffix?: string }): Promise<MintResult> {
  const tier = TIERS[args.tier];
  const collectionAddress = PUBLIC.collections[args.tier];
  const metadataUri = PUBLIC.metadata[args.tier];
  if (!collectionAddress) throw new Error(`Collection address for ${args.tier} not configured`);
  if (!metadataUri) throw new Error(`Metadata URI for ${args.tier} not configured`);

  const u = umi();
  const collectionPk = publicKey(collectionAddress);
  const collection = await fetchCollection(u, collectionPk);

  const numMinted = Number(collection.numMinted ?? 0);
  if (numMinted >= tier.maxSupply) {
    throw new Error(`${tier.name} is sold out (${numMinted}/${tier.maxSupply})`);
  }

  const asset = generateSigner(u);
  const tokenIndex = numMinted + 1;
  const name = `${tier.name} #${tokenIndex}${args.nameSuffix ? ` ${args.nameSuffix}` : ""}`;

  const builder = create(u, {
    asset,
    collection,
    name,
    uri: metadataUri,
    owner: some(publicKey(args.recipient)),
  });

  const { signature } = await builder.sendAndConfirm(u, { confirm: { commitment: "confirmed" } });
  const sigStr = Buffer.from(signature).toString("base64");

  return {
    asset: asset.publicKey.toString(),
    signature: sigStr,
    numMinted: tokenIndex,
    maxSupply: tier.maxSupply,
  };
}

export async function getCollectionSupply(tier: TierId): Promise<{ minted: number; max: number }> {
  const tierCfg = TIERS[tier];
  const addr = PUBLIC.collections[tier];
  if (!addr) return { minted: 0, max: tierCfg.maxSupply };
  const u = umi();
  const collection = await fetchCollection(u, publicKey(addr));
  return { minted: Number(collection.numMinted ?? 0), max: tierCfg.maxSupply };
}
