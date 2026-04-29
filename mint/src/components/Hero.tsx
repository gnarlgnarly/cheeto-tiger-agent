import { WalletButton } from "./WalletButton";

export function Hero() {
  return (
    <header className="relative px-6 pt-10 pb-16 max-w-6xl mx-auto">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-700 shadow-glow" />
          <span className="font-bold tracking-widest uppercase text-sm">Cheeto Tiger</span>
        </div>
        <WalletButton />
      </nav>

      <div className="mt-20 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
          Adopt a <span className="gradient-text">Cheeto Tiger</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
          Three strictly limited tiers, minted on Solana. Pay in $CHEETO, walk away with a
          collectible NFT. From a single Cheeto to a fully adopted tiger.
        </p>
      </div>
    </header>
  );
}
