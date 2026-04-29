import { Connection } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { SERVER } from "./config";

export const serverConnection = (): Connection => new Connection(SERVER.rpc, "confirmed");

export const mintAuthority = (): Keypair => {
  const secret = SERVER.mintAuthoritySecret();
  return Keypair.fromSecretKey(bs58.decode(secret));
};

/**
 * Fetch SPL mint decimals on-chain.
 */
export async function getMintDecimals(mint: string): Promise<number> {
  const { getMint } = await import("@solana/spl-token");
  const { PublicKey } = await import("@solana/web3.js");
  const conn = serverConnection();
  const info = await getMint(conn, new PublicKey(mint));
  return info.decimals;
}
