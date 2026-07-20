import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Nibras Bank",
  description: "A Gulf neobank built as a Next.js 16 micro-frontend mesh (fictional demo).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col">
          <div className="flex-1">{children}</div>
          <footer className="flex items-center justify-between border-t border-hair bg-white/50 px-6 py-4 md:px-11">
            <span className="text-[11.5px] text-mist">
              Nibras Bank is a fictional bank for a developer demo. Not a real institution.
            </span>
            <span className="font-mono text-[11px] text-haze">© 2026 Nibras</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
