import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CHEETO TIGER™ — Apex Mint",
  description: "The world's first crunch-powered, dust-cooled apex AGI. Mint a derivative on Solana. 50% burned. Stay orange.",
  openGraph: {
    title: "CHEETO TIGER™",
    description: "Crunch-Powered Apex AGI. Mint on Solana.",
    images: ["/images/tiger1.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mfcheetotiger",
    images: ["/images/tiger1.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
