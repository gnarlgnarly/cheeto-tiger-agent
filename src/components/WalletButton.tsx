"use client";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export function WalletButton() {
  return (
    <WalletMultiButton
      style={{
        background: "transparent",
        border: "1px solid rgba(255,106,0,0.6)",
        color: "#FF6A00",
        borderRadius: "0",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "8px 16px",
        height: "auto",
      }}
    />
  );
}
